import {AGES, MARKERS} from './data.js';

export function calculate(input) {
  const age = AGES.find(a => a.id === input.age);
  const blockers = [];
  if (!age) blockers.push(input.age === 'under50' ? '未滿 50 歲：此版本無適用的年齡先驗值。' : '請先選擇年齡層。');
  if (input.clinicalPD !== 'no') blockers.push(input.clinicalPD === 'yes' ? '已達臨床巴金森病診斷者，不適用此前驅研究計算。' : '請先確認尚未達臨床巴金森病診斷。');
  if (input.highPenetrance !== 'no') blockers.push(input.highPenetrance === 'yes' ? '高外顯率單基因變異帶因者不適用 2019 準則。' : '請先完成高外顯率單基因變異的適用性確認。');
  const errors = [];
  for (const m of MARKERS) {
    if (input[m.id] !== undefined && !m.options.some(o => o.value === input[m.id])) errors.push(`無效選項：${m.label}`);
  }
  if (errors.length || blockers.length) return {valid:false, blockers:[...blockers,...errors]};

  const warnings = [];
  const rows = [];
  let assessed = 0;
  for (const m of MARKERS) {
    const option = m.options.find(o => o.value === (input[m.id] ?? 'unknown'));
    if (option.value === 'unknown') continue;
    if (m.maleOnly && input.sex !== 'male') {
      warnings.push(`${m.label}：未選擇男性，已排除此項。`);
      continue;
    }
    assessed++;
    const lr = option.lr === 'age' ? age[option.value] : option.lr;
    rows.push({id:m.id, label:m.label, choice:option.label, lr, prodromal:!!m.prodromal, positive:!!(m.prodromal && option.positive), included:true, reason:''});
  }
  // Berg et al. 2015, Clinical Motor Markers: same-direction tests are dependent.
  const motor = rows.find(r => r.id === 'motor');
  const quant = rows.find(r => r.id === 'quantMotor');
  if (motor && quant && input.motor === input.quantMotor) {
    const omit = input.motor === 'yes' ? (motor.lr >= quant.lr ? quant : motor) : (motor.lr <= quant.lr ? quant : motor);
    omit.included = false;
    omit.reason = input.motor === 'yes' ? '動作評估同陽性，僅採較高 LR' : '動作評估同陰性，僅採較低 LR';
  }
  const used = rows.filter(r => r.included);
  const logLR = used.reduce((sum,r) => sum + Math.log(r.lr),0);
  const totalLR = Math.exp(logLR);
  const priorOdds = age.prior / (1 - age.prior);
  const posteriorOdds = priorOdds * totalLR;
  const probability = posteriorOdds / (1 + posteriorOdds);
  const positiveProdromal = used.filter(r => r.positive).length;
  const prodromalLR = Math.exp(used.filter(r => r.prodromal).reduce((sum,r) => sum + Math.log(r.lr),0));
  const meetsProbability = posteriorOdds >= 4; // exactly 80%, before display rounding
  const probable = meetsProbability && prodromalLR >= 4;
  if (!positiveProdromal) warnings.push('目前沒有納入陽性前驅標記；單靠風險標記不能判為 probable prodromal PD。');
  else if (prodromalLR < 4) warnings.push('前驅標記合併 LR 未達 4，不符合前驅證據條件。');
  if (input.sex === undefined || input.sex === 'unknown') warnings.push('生理性別未納入；這是部分資料估計。');
  return {valid:true, age:age.label, prior:age.prior, priorOdds, totalLR, posteriorOdds, probability, assessed, rows, positiveProdromal, prodromalLR, meetsProbability, probable, warnings};
}

export function formatProbability(p) {
  if (p > 0 && p < 0.0001) return '<0.01';
  if (p < 1 && p > 0.9999) return '>99.99';
  return (p * 100).toFixed(2);
}
