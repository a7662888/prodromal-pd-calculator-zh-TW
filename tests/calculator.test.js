import test from 'node:test';
import assert from 'node:assert/strict';
import {calculate,formatProbability} from '../calculator.js';
import {AGES,MARKERS,EXAMPLE} from '../data.js';

const base = {age:'65',clinicalPD:'no',highPenetrance:'no'};
const close = (actual,expected) => assert.ok(Math.abs(actual-expected)<1e-10,`${actual} != ${expected}`);

test('independent Bayes reference cases: PSG RBD and objective hyposmia',() => {
  const rbd = calculate({...base,sex:'male',rbd:'psgYes'});
  close(rbd.totalLR,156);
  close(rbd.probability,156/205);
  assert.equal(rbd.probable,false);
  const both = calculate({...base,sex:'male',rbd:'psgYes',olfaction:'yes'});
  close(both.probability,998.4/1047.4);
  assert.equal(both.probable,true);
});
test('2015 illustrative profile recalculated with 2019 likelihood ratios',() => {
  const r = calculate(EXAMPLE);
  close(r.totalLR,981.4195961856);
  close(r.probability,981.4195961856/(79+981.4195961856));
});
test('all age priors and genetic age bands match 2019 Table 2',() => {
  const fixture = [
    ['50',.004,20,2.5],['55',.0075,14.7,4],['60',.0125,11.2,5.6],
    ['65',.02,9,7.5],['70',.025,8.4,11.6],['75',.035,7.1,9.1],['80',.04,7.5,10.5]
  ];
  for (const [age,prior,gba,lrrk2] of fixture) {
    close(calculate({...base,age}).probability,prior);
    close(calculate({...base,age,genetic:'gba'}).totalLR,gba);
    close(calculate({...base,age,genetic:'lrrk2'}).totalLR,lrrk2);
  }
  assert.equal(AGES.length,7);
});
test('unknown and NA are neutral; assessed negative is not unknown',() => {
  const unknown = calculate(base);
  close(unknown.totalLR,1);
  assert.equal(unknown.assessed,0);
  close(calculate({...base,pesticide:'no',solvent:'no',genetic:'none'}).totalLR,1);
  close(calculate({...base,olfaction:'no'}).totalLR,.4);
});
test('motor same direction selects one LR, disagreement multiplies both',() => {
  const fixture = [['yes','yes',9.6],['no','no',.55],['no','yes',1.925],['yes','no',5.76]];
  for (const [motor,quantMotor,lr] of fixture) close(calculate({...base,motor,quantMotor}).totalLR,lr);
  assert.equal(calculate({...base,motor:'yes',quantMotor:'yes'}).rows.filter(r=>r.included).length,1);
});
test('PSG and questionnaire outcomes; OH certainty levels',() => {
  for (const [rbd,lr] of [['psgYes',130],['psgNo',.65],['screenYes',2.8],['screenNo',.89]]) close(calculate({...base,rbd}).totalLR,lr);
  for (const [oh,lr] of [['neuroYes',18.5],['neuroNo',.88],['symptomYes',3.2],['symptomNo',.8]]) close(calculate({...base,oh}).totalLR,lr);
});
test('male-only markers never contribute in female or unspecified groups',() => {
  close(calculate({...base,sex:'female',urate:'low',erectile:'yes'}).totalLR,.8);
  close(calculate({...base,urate:'low',erectile:'yes'}).totalLR,1);
  close(calculate({...base,sex:'male',urate:'low',erectile:'yes'}).totalLR,1.2*1.8*3.4);
});
test('isolated anxiety is neither depression-positive nor negative',() => {
  close(calculate({...base,depression:'anxietyOnly'}).totalLR,1);
  close(calculate({...base,depression:'no'}).totalLR,.88);
  close(calculate({...base,depression:'yes'}).totalLR,1.6);
});
test('applicability rejects unknown, under-50, clinical PD and high-penetrance cases',() => {
  for (const input of [{},{...base,age:'under50'},{...base,clinicalPD:'yes'},{...base,highPenetrance:'yes'},{...base,clinicalPD:'unknown'},{...base,highPenetrance:'unknown'}]) assert.equal(calculate(input).valid,false);
});
test('reject malformed marker values without evaluating untrusted text',() => {
  assert.equal(calculate({...base,rbd:'<img src=x onerror=alert(1)>'}).valid,false);
  assert.equal(calculate({...base,genetic:['family','gba']}).valid,false);
});
test('high probability from risk markers alone is not probable prodromal PD',() => {
  const r = calculate({...base,age:'80',sex:'male',pesticide:'yes',solvent:'yes',caffeine:'yes',smoking:'never',diabetes:'yes',inactivity:'yes',urate:'low',sn:'yes',genetic:'gba'});
  assert.ok(r.probability >= .8);
  assert.equal(r.probable,false);
  assert.equal(r.prodromalLR,1);
});
test('positive prodromal marker alone is insufficient if combined prodromal LR <4',() => {
  const r = calculate({...base,age:'80',sex:'male',pesticide:'yes',solvent:'yes',caffeine:'yes',smoking:'never',diabetes:'yes',inactivity:'yes',urate:'low',sn:'yes',genetic:'gba',rbd:'screenYes'});
  assert.ok(r.probability >= .8);
  assert.ok(r.positiveProdromal > 0);
  close(r.prodromalLR,2.8);
  assert.equal(r.probable,false);
});
test('all legal individual selections produce finite bounded probabilities',() => {
  for (const m of MARKERS) for (const o of m.options) {
    const r = calculate({...base,sex:'male',[m.id]:o.value});
    assert.equal(r.valid,true);
    assert.ok(Number.isFinite(r.probability) && r.probability > 0 && r.probability < 1);
  }
});
test('display rounding never drives threshold classification',() => {
  assert.equal(formatProbability(.7999999),'80.00');
  assert.equal(formatProbability(.999999),'>99.99');
  assert.equal(formatProbability(.0000001),'<0.01');
  const below = calculate({...base,sex:'male',rbd:'psgYes'});
  assert.equal(below.meetsProbability,below.posteriorOdds >= 4);
});
