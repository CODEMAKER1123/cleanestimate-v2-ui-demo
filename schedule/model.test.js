const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('./model.js');

test('moves a queued service job to a valid open 15-minute slot', () => {
  const jobs = M.seed(), date = M.localDate(new Date());
  const result = M.move(jobs, 'Q1', { resource: 'south', date, start: '16:00' });
  assert.equal(result.error, null);
  assert.equal(result.jobs.find(j => j.id === 'Q1').start, '16:00');
  assert.equal(jobs.find(j => j.id === 'Q1').date, null);
});

test('refuses time bounds, off-grid starts, wrong resource type, and overlaps', () => {
  const jobs = M.seed(), date = M.localDate(new Date());
  for (const start of ['06:45', '17:45', '09:10']) assert.ok(M.validateMove(jobs, 'Q1', { resource: 'north', date, start }));
  assert.match(M.validateMove(jobs, 'Q1', { resource: 'sales', date, start: '09:00' }), /service crew/);
  assert.match(M.validateMove(jobs, 'Q1', { resource: 'north', date, start: '10:15' }), /Conflicts with/);
});

test('rescheduling excludes the job itself but detects another job on the target crew', () => {
  const jobs = M.seed(), date = M.localDate(new Date());
  assert.equal(M.validateMove(jobs, 'J1', { resource: 'north', date, start: '07:30' }), null);
  assert.match(M.validateMove(jobs, 'J1', { resource: 'central', date, start: '08:00' }), /Conflicts with/);
  assert.equal(M.move(jobs, 'J1', null).jobs.find(j => j.id === 'J1').date, null);
});
