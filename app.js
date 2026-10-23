import {AGES, MARKERS, GROUPS, VERSION, SOURCE, EXAMPLE} from './data.js';
import {calculate, formatProbability} from './calculator.js';

const $ = id => document.getElementById(id);
const form = $('assessment-form');
if (window.matchMedia('(max-width:760px)').matches) document.querySelector('.audit-panel').open = false;
const number = n => n.toLocaleString('en-US',{maximumFractionDigits:4});
function element(tag,text,className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}
for (const age of AGES) {
  const option = element('option',age.label);
  option.value = age.id;
  $('age').append(option);
  const tr = element('tr');
  for (const text of [age.label,`${number(age.prior*100)}%`,age.gba,age.lrrk2]) tr.append(element('td',text));
  $('age-table').append(tr);
}
for (const group of GROUPS) {
  const section = element('details',undefined,'panel marker-panel');
  section.open = !!group.open;
  const summary = element('summary');
  const heading = element('div',undefined,'section-heading');
  heading.append(element('span',group.number,'section-number'));
  const copy = element('div');
  copy.append(element('h3',group.title),element('p',group.description));
  heading.append(copy);
  summary.append(heading);
  section.append(summary);
  for (const marker of MARKERS.filter(m => m.group === group.id)) {
    const row = element('div',undefined,'field');
    const fieldCopy = element('div',undefined,'field-copy');
    const label = element('label',marker.label);
    label.htmlFor = marker.id;
    const help = element('p',marker.help);
    help.id = `${marker.id}-help`;
    fieldCopy.append(label,help);
    const select = element('select');
    select.id = marker.id;
    select.name = marker.id;
    select.setAttribute('aria-describedby',help.id);
    for (const o of marker.options) {
      const lr = o.lr === 'age' ? '依年齡' : o.lr;
      const option = element('option',`${o.label}${o.value === 'unknown' ? '' : ` · LR ${lr}`}`);
      option.value = o.value;
      select.append(option);
      if (o.value !== 'unknown') {
        const tr = element('tr');
        for (const text of [marker.label,o.label,lr]) tr.append(element('td',text));
        $('lr-table').append(tr);
      }
    }
    row.append(fieldCopy,select);
    section.append(row);
  }
  const foot = element('div',undefined,'group-source');
  const link = element('a','數值來源：2019 更新 Table 1–2 ↗');
  link.href = SOURCE;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  foot.append(link);
  section.append(foot);
  $('marker-groups').append(section);
}
function update() {
  const input = Object.fromEntries(new FormData(form));
  for (const m of MARKERS.filter(m => m.maleOnly)) {
    const disabled = input.sex !== 'male';
    $(m.id).disabled = disabled;
    if (disabled) { $(m.id).value = 'unknown'; input[m.id] = 'unknown'; }
  }
  const result = calculate(input);
  $('result-notes').replaceChildren();
  $('audit-content').replaceChildren();
  $('result-metrics').hidden = !result.valid;
  if (!result.valid) {
    $('probability').textContent = '—';
    $('probability-fill').style.width = '0%';
    $('result-label').textContent = '尚未計算／不適用';
    $('result-explanation').textContent = '請依下列提示確認適用性；不適用者不產生機率估計。';
    for (const text of result.blockers) $('result-notes').append(element('li',text));
    $('audit-content').append(element('p','完成適用範圍後，這裡會逐項列出納入的 LR。'));
    return;
  }
  $('probability').textContent = formatProbability(result.probability);
  $('probability-fill').style.width = `${result.probability*100}%`;
  $('result-label').textContent = result.probable ? '符合 probable prodromal PD 研究分類條件' : result.meetsProbability ? '機率達 80%，但前驅證據未達條件' : '未達 80% 研究門檻';
  $('result-explanation').textContent = result.assessed === 0 ? '目前只使用年齡先驗值，沒有納入任何其他評估；不代表陰性篩檢。' : `依 ${result.age} 與目前已填資料估計；未評估的項目不納入。此分類仍須專業人員核對評估品質與適用性。`;
  $('prior').textContent = `${number(result.prior*100)}%`;
  $('total-lr').textContent = number(result.totalLR);
  $('prodromal-lr').textContent = number(result.prodromalLR);
  $('assessed').textContent = `${result.assessed} / ${MARKERS.length}`;
  for (const text of result.warnings) $('result-notes').append(element('li',text));
  for (const r of result.rows) {
    const row = element('div',undefined,`audit-row${r.included ? '' : ' omitted'}`);
    const label = element('div',r.label);
    label.append(element('small',`${r.choice}${r.included ? '' : `；${r.reason}`}`));
    row.append(label,element('strong',r.included ? `× ${number(r.lr)}` : '不重複計入'));
    $('audit-content').append(row);
  }
  const math = element('p',undefined,'formula-line');
  math.textContent = `先驗勝算 ${number(result.priorOdds)} × 合併 LR ${number(result.totalLR)} = 後驗勝算 ${number(result.posteriorOdds)}；換算機率 ${formatProbability(result.probability)}%。畫面顯示值經四捨五入，分類使用未四捨五入值。`;
  $('audit-content').append(math);
}
form.addEventListener('submit',event => event.preventDefault());
form.addEventListener('change',() => { $('example-note').hidden = true; update(); });
$('reset').addEventListener('click',() => { form.reset(); $('example-note').hidden = true; update(); });
$('example').addEventListener('click',() => {
  form.reset();
  for (const [key,value] of Object.entries(EXAMPLE)) $(key).value = value;
  $('example-note').hidden = false;
  update();
});
$('version').textContent = VERSION;
// Clear browser-restored form values on reload/back navigation; no persistence.
window.addEventListener('pageshow',() => { form.reset(); $('example-note').hidden = true; update(); });
update();
