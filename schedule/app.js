(() => {
  'use strict';
  const M = window.ScheduleModel, KEY = 'ce-schedule-concept-v1';
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c]);
  const today = M.localDate(new Date());
  const state = { date: today, view: 'day', scope: 'all', resource: 'all', search: '', queueOpen: true, selected: null, lastFocus: null, undo: null, jobs: load() };
  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      if (saved?.version === 1 && Array.isArray(saved.jobs) && saved.jobs.every(j => j && typeof j.id === 'string' && typeof j.duration === 'number')) return saved.jobs;
    } catch (_) { /* A blocked or stale store starts with sample data. */ }
    return M.seed();
  }
  function persist() { try { localStorage.setItem(KEY, JSON.stringify({ version: 1, jobs: state.jobs })); } catch (_) { showToast('Browser storage unavailable; edits last for this session.'); } }
  function fmtDate(date, opts = { weekday:'long', month:'long', day:'numeric' }) { return new Intl.DateTimeFormat('en-US', opts).format(new Date(`${date}T12:00:00`)); }
  function fmtTime(time) { const n = M.toMinutes(time); return `${(Math.floor(n/60)%12)||12}:${String(n%60).padStart(2,'0')}${n<720?'a':'p'}`; }
  function fmtRange(j) { return `${fmtTime(j.start)}–${fmtTime(M.toTime(M.toMinutes(j.start)+j.duration))}`; }
  function weekStart(date) { const d = new Date(`${date}T12:00:00`); return M.addDays(date, -((d.getDay()+6)%7)); }
  function matches(j) { return (state.scope === 'all' || j.kind === state.scope) && (state.resource === 'all' || j.resource === state.resource) && (!state.search || `${j.customer} ${j.service} ${j.city} ${j.status}`.toLowerCase().includes(state.search)); }
  function color(j) { return M.resources.find(r => r.id === j.resource)?.color || (j.kind === 'sales' ? '#b98a21' : '#0f766e'); }
  function buttonJob(j, className, inner) { return `<button class="${className}" data-job="${esc(j.id)}" style="--job-color:${color(j)}" aria-label="${esc(`${j.customer}, ${j.service}, ${j.date ? fmtRange(j) : 'unscheduled'}. Open details`)}">${inner}</button>`; }
  function renderQueue() {
    const jobs = state.jobs.filter(j => !j.date && (state.scope === 'all' || j.kind === state.scope) && (!state.search || `${j.customer} ${j.service} ${j.city}`.toLowerCase().includes(state.search)));
    $('queueCount').textContent = jobs.length;
    $('queueList').innerHTML = jobs.length ? jobs.map(j => buttonJob(j, 'queue-card', `<span class="q-head"><b>${esc(j.customer)}</b><small>${j.duration/60}h</small></span><div class="q-service">${esc(j.service)}</div><div class="q-meta">${esc(j.city)} · ${j.kind === 'sales' ? 'Sales' : 'Service'}</div>`)).join('') : '<div class="empty-state">No jobs in this queue</div>';
  }
  function renderDay() {
    const visibleResources = M.resources.filter(r => (state.scope === 'all' || r.kind === state.scope) && (state.resource === 'all' || r.id === state.resource));
    const hours = Array.from({length:11},(_,i) => `<div class="hour">${fmtTime(M.toTime((i+7)*60))}</div>`).join('');
    const rows = visibleResources.map(r => {
      const jobs = state.jobs.filter(j => j.date === state.date && j.resource === r.id && matches(j));
      const all = state.jobs.filter(j => j.date === state.date && j.resource === r.id);
      const load = all.reduce((n,j) => n+j.duration,0);
      const cards = jobs.map(j => {
        const x = (M.toMinutes(j.start)-M.START)*100/(M.END-M.START), width = j.duration*100/(M.END-M.START);
        return buttonJob(j,'job',`<div class="time">${fmtRange(j)}</div><div class="customer">${esc(j.customer)}</div><div class="service">${esc(j.service)}</div><div class="meta"><span>${esc(j.city)}</span><span class="status">${esc(j.status)}</span></div>`).replace('style="--job-color:',`style="left:${x}%;width:${width}%;--job-color:`);
      }).join('');
      return `<div class="resource-row"><div class="resource-name" style="--resource:${r.color}"><div class="name"><i></i>${esc(r.name)}</div><div class="sub">${esc(r.sub)}</div><span class="load">${all.length} ${all.length===1?'job':'jobs'} · ${(load/60).toFixed(1)}h booked</span></div><div class="timeline" data-resource="${r.id}" aria-label="${esc(r.name)} timeline">${cards}</div></div>`;
    }).join('');
    $('content').innerHTML = `<div class="board"><div class="board-header"><div class="resource-heading">CREW / RESOURCE</div><div class="hours">${hours}</div></div>${rows}</div>`;
  }
  function renderWeek() {
    const start = weekStart(state.date), days = Array.from({length:7},(_,i)=>M.addDays(start,i));
    $('content').innerHTML = `<div class="week"><div class="view-intro"><h2>Week of ${fmtDate(start,{month:'short',day:'numeric'})}</h2><span>Select a day or job to inspect</span></div><div class="week-grid">${days.map(date => {
      const jobs = state.jobs.filter(j=>j.date===date && matches(j)).sort((a,b)=>a.start.localeCompare(b.start));
      return `<div class="week-day ${date===today?'today-col':''}"><button class="day-link" data-date="${date}" aria-label="Open ${fmtDate(date)} in day view"><h3>${fmtDate(date,{weekday:'short'})}</h3><div class="day-num">${Number(date.slice(-2))}</div></button><div class="day-count">${jobs.length} ${jobs.length===1?'appointment':'appointments'}</div>${jobs.map(j=>buttonJob(j,'week-item',`<small>${fmtRange(j)}</small><b>${esc(j.customer)}</b><span>${esc(j.service)}</span>`)).join('') || '<p class="no-jobs">Open for scheduling</p>'}</div>`;
    }).join('')}</div></div>`;
  }
  function renderAgenda() {
    const days=Array.from({length:7},(_,i)=>M.addDays(state.date,i));
    $('content').innerHTML=`<div class="agenda"><div class="view-intro"><h2>Upcoming agenda</h2><span>7 days from ${fmtDate(state.date,{month:'short',day:'numeric'})}</span></div>${days.map(date=>{
      const jobs=state.jobs.filter(j=>j.date===date && matches(j)).sort((a,b)=>a.start.localeCompare(b.start));
      return `<section class="agenda-day"><h3>${fmtDate(date)} · ${jobs.length} ${jobs.length===1?'appointment':'appointments'}</h3>${jobs.length ? jobs.map(j=>buttonJob(j,'agenda-item',`<span>${fmtRange(j)}</span><b>${esc(j.customer)}</b><span>${esc(j.service)}</span><span class="muted">${esc(M.resources.find(r=>r.id===j.resource)?.name)}</span><span class="muted">${esc(j.city)}</span>`)).join('') : '<p class="no-jobs">No work scheduled</p>'}</section>`;
    }).join('')}</div>`;
  }
  function render() {
    $('date').value=state.date;
    $('dateLabel').textContent=fmtDate(state.date,{weekday:'long',month:'short',day:'numeric'});
    document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('selected',b.dataset.view===state.view));
    $('queue').hidden=!state.queueOpen;
    $('queueToggle').textContent=state.queueOpen?'Hide queue':'Show queue';
    $('queueToggle').setAttribute('aria-expanded',String(state.queueOpen));
    const start=state.view==='week'?weekStart(state.date):state.date;
    const end=state.view==='day'?start:M.addDays(start,6);
    const visible=state.jobs.filter(j=>j.date && j.date>=start && j.date<=end && matches(j));
    const period=state.view==='day'?(state.date===today?'Today':fmtDate(state.date,{month:'short',day:'numeric'})):state.view==='week'?(start===weekStart(today)?'This week':`Week of ${fmtDate(start,{month:'short',day:'numeric'})}`):'Next 7 days';
    $('summaryText').innerHTML=`${period} · <strong>${visible.length}</strong> scheduled · <strong>${visible.filter(j=>j.kind==='service').length}</strong> service · <strong>${visible.filter(j=>j.kind==='sales').length}</strong> sales`;
    document.querySelector('.summary-hint').textContent=state.view==='day'?'Drag onto the timeline or open a job to schedule':'Open a job to view or edit';
    renderQueue();
    ({day:renderDay,week:renderWeek,agenda:renderAgenda})[state.view]();
  }
  function showToast(message, undo=false) {
    const node=$('toast'); node.textContent=message;
    if(undo){const b=document.createElement('button');b.textContent='Undo';b.addEventListener('click',()=>{if(state.undo){state.jobs=state.undo;state.undo=null;persist();render();showToast('Change undone.');}});node.append(b);}
    node.hidden=false; clearTimeout(showToast.timer); showToast.timer=setTimeout(()=>node.hidden=true,undo?20000:5000);
  }
  function applyMove(jobId,target,status) {
    const result=M.move(state.jobs,jobId,target);
    if(result.error){showToast(result.error);return result.error;}
    state.undo=state.jobs.map(j=>({...j}));
    state.jobs=result.jobs.map(j=>j.id===jobId && status ? {...j,status} : j);
    persist();render();showToast(target?'Schedule saved.':'Job moved to unscheduled.',true);return null;
  }
  function openDrawer(id,source) {
    const job=state.jobs.find(j=>j.id===id);if(!job)return;
    state.selected=id;state.lastFocus=source || document.activeElement;
    const resourceOptions=M.resources.filter(r=>r.kind===job.kind).map(r=>`<option value="${r.id}" ${job.resource===r.id?'selected':''}>${esc(r.name)}</option>`).join('');
    const statusOptions=(job.kind==='sales'?['Scheduled','Confirmed','Done']:['Scheduled','On site','Done']).map(s=>`<option ${job.status===s?'selected':''}>${s}</option>`).join('');
    $('drawerBody').innerHTML=`<h2 id="drawerTitle">${esc(job.customer)}</h2><p class="subtitle">${esc(job.service)} · ${job.kind==='sales'?'Sales visit':'Service job'}</p><div class="detail"><span>Location</span><span>${esc(job.city)}</span></div><div class="detail"><span>Duration</span><span>${job.duration/60} hours</span></div><div class="detail"><span>Current slot</span><span>${job.date?`${fmtDate(job.date,{month:'short',day:'numeric'})} · ${fmtRange(job)}`:'Unscheduled'}</span></div><form id="jobForm"><h3>Schedule this job</h3><label for="jobResource">Resource</label><select id="jobResource" required>${resourceOptions}</select><div class="form-row"><div><label for="jobDate">Date</label><input id="jobDate" type="date" required value="${job.date||state.date}"></div><div><label for="jobTime">Start time</label><input id="jobTime" type="time" min="07:00" max="18:00" step="900" required value="${job.start||'09:00'}"></div></div><label for="jobStatus">Status</label><select id="jobStatus">${statusOptions}</select><p class="error" id="drawerError" role="alert" hidden></p><div class="actions"><button type="submit" class="primary">Save schedule</button>${job.date?'<button id="unschedule" type="button">Unschedule</button>':''}</div></form>`;
    if(!job.resource)$('jobResource').value=job.kind==='sales'?'sales':'north';
    $('drawerShade').hidden=false;$('drawer').hidden=false;$('closeDrawer').focus();
  }
  function closeDrawer() { const id=state.selected;$('drawer').hidden=true;$('drawerShade').hidden=true;state.selected=null;const focusTarget=state.lastFocus?.isConnected ? state.lastFocus : [...document.querySelectorAll('[data-job]')].find(el=>el.dataset.job===id);(focusTarget||$('date')).focus(); }
  $('resource').insertAdjacentHTML('beforeend',M.resources.map(r=>`<option value="${r.id}">${esc(r.name)}</option>`).join(''));
  $('prev').onclick=()=>{state.date=M.addDays(state.date,state.view==='week'?-7:-1);render();};
  $('next').onclick=()=>{state.date=M.addDays(state.date,state.view==='week'?7:1);render();};
  $('today').onclick=()=>{state.date=today;render();};
  $('date').onchange=e=>{if(e.target.value){state.date=e.target.value;render();}};
  $('scope').onchange=e=>{state.scope=e.target.value;render();};
  $('resource').onchange=e=>{state.resource=e.target.value;render();};
  $('search').oninput=e=>{state.search=e.target.value.trim().toLowerCase();render();};
  $('queueToggle').onclick=()=>{state.queueOpen=!state.queueOpen;render();};
  $('reset').onclick=()=>{try{localStorage.removeItem(KEY);}catch(_){}state.jobs=M.seed();state.date=today;state.scope='all';state.resource='all';state.search='';state.view='day';state.undo=null;$('scope').value='all';$('resource').value='all';$('search').value='';render();showToast('Sample schedule restored.');};
  document.querySelector('.view-tabs').onclick=e=>{const b=e.target.closest('[data-view]');if(b){state.view=b.dataset.view;render();}};
  $('content').addEventListener('click',e=>{const day=e.target.closest('[data-date]');if(day){state.date=day.dataset.date;state.view='day';render();return;}const b=e.target.closest('[data-job]');if(b)openDrawer(b.dataset.job,b);});
  $('queueList').addEventListener('click',e=>{const b=e.target.closest('[data-job]');if(b)openDrawer(b.dataset.job,b);});
  let drag=null, suppressClick=false;
  function dropLine(x,y) { return document.elementFromPoint(x,y)?.closest('.timeline'); }
  function clearDrag() {
    if(!drag)return;
    drag.source.classList.remove('drag-source');drag.line?.classList.remove('drag-over');drag.preview?.remove();drag=null;
  }
  document.addEventListener('pointerdown',e=>{
    const source=e.target.closest('[data-job]');
    if(!source || !e.isPrimary || (e.pointerType==='mouse' && e.button!==0) || state.view!=='day')return;
    drag={id:source.dataset.job,source,x:e.clientX,y:e.clientY,pointerId:e.pointerId,moved:false,line:null,preview:null};
  });
  document.addEventListener('pointermove',e=>{
    if(!drag || e.pointerId!==drag.pointerId)return;
    if(!drag.moved && Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<=5)return;
    if(!drag.moved){
      drag.moved=true;drag.source.classList.add('drag-source');
      const job=state.jobs.find(j=>j.id===drag.id);
      drag.preview=document.createElement('div');drag.preview.className='drag-preview';drag.preview.textContent=`${job.customer} · ${job.service}`;document.body.append(drag.preview);
    }
    e.preventDefault();drag.preview.style.left=`${e.clientX+14}px`;drag.preview.style.top=`${e.clientY+14}px`;
    const line=dropLine(e.clientX,e.clientY);
    if(line!==drag.line){drag.line?.classList.remove('drag-over');line?.classList.add('drag-over');drag.line=line;}
  });
  document.addEventListener('pointerup',e=>{
    if(!drag || e.pointerId!==drag.pointerId)return;
    const moved=drag.moved,id=drag.id,line=moved?dropLine(e.clientX,e.clientY):null;
    clearDrag();
    if(!moved)return;
    suppressClick=true;setTimeout(()=>suppressClick=false,350);
    if(!line){showToast('Drop on a crew timeline to schedule.');return;}
    const rect=line.getBoundingClientRect(),ratio=Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width));
    const minutes=M.START+Math.round((ratio*(M.END-M.START))/M.STEP)*M.STEP;
    applyMove(id,{resource:line.dataset.resource,date:state.date,start:M.toTime(minutes)});
  });
  document.addEventListener('pointercancel',e=>{if(drag && e.pointerId===drag.pointerId)clearDrag();});
  document.addEventListener('click',e=>{if(suppressClick){e.preventDefault();e.stopImmediatePropagation();suppressClick=false;}},true);
  $('closeDrawer').onclick=closeDrawer;$('drawerShade').onclick=closeDrawer;
  $('drawer').addEventListener('submit',e=>{if(e.target.id!=='jobForm')return;e.preventDefault();const error=applyMove(state.selected,{resource:$('jobResource').value,date:$('jobDate').value,start:$('jobTime').value},$('jobStatus').value);if(error){$('drawerError').textContent=error;$('drawerError').hidden=false;}else closeDrawer();});
  $('drawer').addEventListener('click',e=>{if(e.target.id==='unschedule'){applyMove(state.selected,null);closeDrawer();}});
  document.addEventListener('keydown',e=>{if($('drawer').hidden)return;if(e.key==='Escape'){e.preventDefault();closeDrawer();}if(e.key==='Tab'){const items=[...$('drawer').querySelectorAll('button,input,select')].filter(el=>!el.disabled);const first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
  render();
})();
