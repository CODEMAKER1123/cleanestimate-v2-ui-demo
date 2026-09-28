(function (root, factory) {
  const model = factory();
  if (typeof module === 'object' && module.exports) module.exports = model;
  else root.ScheduleModel = model;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const START = 7 * 60, END = 18 * 60, STEP = 15;
  const resources = [
    { id: 'north', name: 'North crew', sub: 'Truck 01 · Luis + Andre', kind: 'service', color: '#0f766e' },
    { id: 'central', name: 'Central crew', sub: 'Truck 02 · Maya + Ben', kind: 'service', color: '#2563a6' },
    { id: 'south', name: 'South crew', sub: 'Truck 03 · Jess + Kai', kind: 'service', color: '#af6734' },
    { id: 'lights', name: 'Lights crew', sub: 'Truck 04 · Drew + Sam', kind: 'service', color: '#8c5baa' },
    { id: 'sales', name: 'Sales · Avery', sub: 'Consultations', kind: 'sales', color: '#b98a21' }
  ];
  const pad = n => String(n).padStart(2, '0');
  const localDate = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const addDays = (date, days) => { const d = new Date(`${date}T12:00:00`); d.setDate(d.getDate() + days); return localDate(d); };
  const toMinutes = time => { const m = /^(\d{2}):(\d{2})$/.exec(time || ''); return m ? +m[1] * 60 + +m[2] : NaN; };
  const toTime = minutes => `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
  const dates = days => addDays(localDate(new Date()), days);
  function seed() {
    const specs = [
      ['north',0,'07:30',120,'House wash + gutters','Wren Hollow','Lancaster','Done'],
      ['north',0,'10:00',180,'Roof soft wash','Maple Grove Studio','Lititz','On site'],
      ['north',0,'14:00',150,'Siding + walkways','Harbor Field Books','Lancaster','Scheduled'],
      ['central',0,'08:00',180,'Commercial exterior','Willow Court Offices','Ephrata','On site'],
      ['central',0,'12:00',120,'Window + entry wash','Cedar Lane Bakery','Lancaster','Scheduled'],
      ['central',0,'15:00',120,'Patio restoration','Stonebridge Kitchen','Manheim','Scheduled'],
      ['south',0,'07:45',150,'Driveway + patio','Marlow House','Mount Joy','Done'],
      ['south',0,'11:00',120,'Fence wash','Elm Rise Cottage','Elizabethtown','Scheduled'],
      ['south',0,'14:15',90,'Storefront wash','Juniper Market','Lancaster','Scheduled'],
      ['lights',0,'08:00',210,'Roofline measure','Ashwood Commons','Lititz','On site'],
      ['lights',0,'12:15',240,'Holiday light install','Pine & Pearl Hall','Lancaster','Scheduled'],
      ['sales',0,'08:30',60,'Site consultation','Fernway Dental','Lancaster','Confirmed'],
      ['sales',0,'10:15',75,'Commercial walkthrough','Brookfield Center','Ephrata','Confirmed'],
      ['sales',0,'13:00',60,'Exterior estimate','Sagebrook House','Lititz','Scheduled'],
      ['sales',0,'15:15',75,'Lighting consultation','Moss & Main','Lancaster','Scheduled'],
      ['north',1,'08:00',180,'House wash','Rowan Glen House','Manheim','Scheduled'],
      ['central',1,'09:00',210,'Commercial wash','Birchline Offices','Lancaster','Scheduled'],
      ['south',1,'08:30',150,'Patio + walkway','Eastvale Studio','Lititz','Scheduled'],
      ['lights',1,'09:00',240,'Holiday light install','Oakmere Hall','Mount Joy','Scheduled'],
      ['sales',1,'10:00',75,'Site consultation','Clovercrest Shop','Ephrata','Confirmed'],
      ['north',2,'09:00',180,'Roof soft wash','Lindenbrook House','Lancaster','Scheduled'],
      ['central',2,'08:00',150,'Storefront wash','Northfield Cafe','Lititz','Scheduled'],
      ['sales',2,'13:30',60,'Exterior estimate','Wicker & Fern','Manheim','Scheduled'],
      ['south',3,'09:00',180,'Siding wash','Bracken Grove','Lancaster','Scheduled'],
      ['lights',3,'08:00',240,'Holiday light install','Ivory Pine Place','Lititz','Scheduled'],
      ['sales',4,'11:00',90,'Commercial walkthrough','Riverside Loft','Lancaster','Confirmed']
    ];
    const jobs = specs.map((s, i) => ({ id: `J${i+1}`, resource: s[0], date: dates(s[1]), start: s[2], duration: s[3], service: s[4], customer: s[5], city: s[6], status: s[7], kind: s[0] === 'sales' ? 'sales' : 'service' }));
    [
      ['House wash + gutters','Amberleaf House','Lancaster',120,'service'],
      ['Patio restoration','Bluebird Cottage','Lititz',150,'service'],
      ['Commercial walkthrough','Crescent Works','Manheim',75,'sales'],
      ['Holiday light install','Meadowmere Hall','Ephrata',180,'service']
    ].forEach((s,i) => jobs.push({ id:`Q${i+1}`, resource:null, date:null, start:null, duration:s[3], service:s[0], customer:s[1], city:s[2], status:'Ready to schedule', kind:s[4] }));
    return jobs;
  }
  function validateMove(jobs, jobId, target) {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return 'Job not found.';
    if (target === null) return null;
    const resource = resources.find(r => r.id === target.resource);
    if (!resource) return 'Choose a resource.';
    if (resource.kind !== job.kind) return `${job.kind === 'sales' ? 'Sales visits' : 'Service work'} must use a ${job.kind === 'sales' ? 'sales rep' : 'service crew'}.`;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(target.date || '') || localDate(new Date(`${target.date}T12:00:00`)) !== target.date) return 'Choose a valid date.';
    const start = toMinutes(target.start), end = start + job.duration;
    if (!Number.isInteger(start) || start % STEP || start < START || end > END) return 'Choose a 15-minute start between 7:00 AM and the end of the workday.';
    const conflict = jobs.find(other => other.id !== jobId && other.resource === target.resource && other.date === target.date && start < toMinutes(other.start) + other.duration && end > toMinutes(other.start));
    return conflict ? `Conflicts with ${conflict.customer} (${toTime(toMinutes(conflict.start))}–${toTime(toMinutes(conflict.start) + conflict.duration)}).` : null;
  }
  function move(jobs, jobId, target) {
    const error = validateMove(jobs, jobId, target);
    if (error) return { error, jobs };
    return { error: null, jobs: jobs.map(j => j.id === jobId ? { ...j, resource: target?.resource || null, date: target?.date || null, start: target?.start || null, status: target ? (j.status === 'Ready to schedule' ? 'Scheduled' : j.status) : 'Ready to schedule' } : j) };
  }
  return { START, END, STEP, resources, localDate, addDays, toMinutes, toTime, seed, validateMove, move };
});
