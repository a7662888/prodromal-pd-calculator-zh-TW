// Adapted from Heinzel et al. 2019, Tables 1–2 (CC BY); see SOURCES.md.
export const VERSION = '2019 準則・繁中獨立實作 v1.0.0';
export const SOURCE = 'https://doi.org/10.1002/mds.27802';
export const AGES = [
  {id:'50', label:'50–54 歲', prior:0.004, gba:20, lrrk2:2.5},
  {id:'55', label:'55–59 歲', prior:0.0075, gba:14.7, lrrk2:4},
  {id:'60', label:'60–64 歲', prior:0.0125, gba:11.2, lrrk2:5.6},
  {id:'65', label:'65–69 歲', prior:0.02, gba:9, lrrk2:7.5},
  {id:'70', label:'70–74 歲', prior:0.025, gba:8.4, lrrk2:11.6},
  {id:'75', label:'75–79 歲', prior:0.035, gba:7.1, lrrk2:9.1},
  {id:'80', label:'80 歲以上', prior:0.04, gba:7.5, lrrk2:10.5}
];
const unknown = {value:'unknown', label:'未評估／不確定', lr:1};
const opt = (value,label,lr,positive=false) => ({value,label,lr,positive});
const binary = (yes,no) => [unknown,opt('yes','有／陽性',yes,true),opt('no','無／陰性',no)];
export const MARKERS = [
  {id:'sex', group:'risk', label:'生理性別（依原研究分組）', help:'原研究僅提供男性與女性的 LR；未提供或不適用時不調整。', options:[unknown,opt('male','男性',1.2),opt('female','女性',0.8)]},
  {id:'pesticide', group:'risk', label:'規律農藥暴露', help:'規律職業暴露，或非常頻繁的非職業暴露（超過 100 次）。沒有暴露的 LR 為不適用，不作調整。', options:binary(1.5,1)},
  {id:'solvent', group:'risk', label:'職業性溶劑暴露', help:'以職業暴露史判定；陰性沒有適用的 LR，不作調整。', options:binary(1.5,1)},
  {id:'caffeine', group:'risk', label:'低咖啡因攝取／不使用咖啡因', help:'原準則以每週少於 3 杯咖啡或少於 6 杯茶描述低攝取；混合飲用或界線不明時由研究者判定，無法判定請留未評估。', options:[unknown,opt('yes','低攝取／不使用',1.35,true),opt('no','規律使用',0.88)]},
  {id:'smoking', group:'risk', label:'吸菸史', help:'三種狀態只採一個 LR。曾吸菸按原準則為至少 1 包年；這是研究關聯，不能據此建議吸菸。', options:[unknown,opt('never','從未規律吸菸',1.2),opt('former','曾吸菸，現已戒菸',0.91),opt('current','目前吸菸',0.51)]},
  {id:'diabetes', group:'risk', label:'第二型糖尿病', help:'依既有臨床診斷判定，勿將其他型糖尿病直接套用。', options:binary(1.5,0.97)},
  {id:'inactivity', group:'risk', label:'身體活動不足', help:'每週使呼吸、心跳加快或流汗的活動少於 1 小時。', options:binary(1.3,0.91)},
  {id:'urate', group:'risk', label:'男性血漿尿酸', maleOnly:true, help:'僅適用男性：<5 mg/dL 採 LR 1.8；>5.6 mg/dL 採 LR 0.88。其餘數值或女性不調整；未擴張原文未明確涵蓋的邊界。', options:[unknown,opt('low','<5 mg/dL',1.8,true),opt('middle','5–5.6 mg/dL（不調整）',1),opt('high','>5.6 mg/dL',0.88)]},
  {id:'rbd', group:'clinical', label:'快速動眼期睡眠行為障礙（RBD）', prodromal:true, help:'PSG 為多項睡眠生理檢查；問卷須具已驗證的 80–99% 特異度。只採一個檢測層級；有明確 PSG 結果時優先使用。排除藥物或猝睡症等其他解釋。', options:[unknown,opt('psgYes','PSG 證實 RBD',130,true),opt('psgNo','PSG 排除 RBD',0.65),opt('screenYes','僅問卷篩檢陽性',2.8,true),opt('screenNo','僅問卷篩檢陰性',0.89)]},
  {id:'olfaction', group:'clinical', label:'嗅覺功能減退', prodromal:true, help:'須使用依年齡、性別校正的標準化客觀嗅覺測試；主觀覺得嗅覺變差不足以判定。', options:binary(6.4,0.4)},
  {id:'constipation', group:'clinical', label:'便祕', prodromal:true, help:'每週需治療超過 1 次，或自發排便頻率為每兩天 1 次或更少；排除其他合理解釋。', options:binary(2.5,0.82)},
  {id:'somnolence', group:'clinical', label:'日間過度嗜睡', prodromal:true, help:'依標準化問卷與研究定義判定，並由評估者排除其他明確原因。', options:binary(2.7,0.86)},
  {id:'oh', group:'clinical', label:'姿勢性低血壓（OH）', prodromal:true, help:'神經性 OH 須有臥／坐與站立血壓量測，且經完整臨床評估排除脫水、心臟病、自主神經病變、藥物等原因；症狀性 OH 為臨床診斷或問卷，未完整釐清病因。兩層級不可相乘。', options:[unknown,opt('neuroYes','證實神經性 OH',18.5,true),opt('neuroNo','神經性 OH 評估陰性',0.88),opt('symptomYes','症狀性 OH',3.2,true),opt('symptomNo','症狀性 OH 評估陰性',0.8)]},
  {id:'erectile', group:'clinical', label:'男性勃起功能障礙', prodromal:true, maleOnly:true, help:'依原準則為嚴重至性行為需醫療介入的勃起功能障礙；僅適用男性。', options:binary(3.4,0.87)},
  {id:'urinary', group:'clinical', label:'泌尿功能障礙', prodromal:true, help:'依原準則評估排尿頻率／急迫性等異常；須排除足以解釋症狀的非神經性因素。', options:binary(2,0.9)},
  {id:'depression', group:'clinical', label:'憂鬱，可伴隨焦慮', prodromal:true, help:'依標準化評估或既有臨床診斷。單獨焦慮不能套用陽性，也不能套用無憂鬱的陰性 LR，應採不調整。', options:[unknown,opt('yes','有憂鬱，可伴焦慮',1.6,true),opt('no','無憂鬱且無焦慮',0.88),opt('anxietyOnly','單獨焦慮，無憂鬱（不調整）',1)]},
  {id:'cognition', group:'clinical', label:'整體認知功能缺損', prodromal:true, help:'以客觀、標準化認知評估判定；單一主觀記憶抱怨不足以代替。', options:binary(1.8,0.88)},
  {id:'dopamine', group:'testing', label:'突觸前多巴胺 PET／SPECT 明確異常', prodromal:true, help:'須使用標準化定量與參考值，例如攝取量低於正常預測值 65%，或低於平均 2 個標準差；邊界結果不納入。', options:binary(43.3,0.66)},
  {id:'motor', group:'testing', label:'未達診斷閾值的巴金森症狀', prodromal:true, help:'由專家評估：UPDRS-III >3（排除動作性顫抖），或 MDS-UPDRS-III >6（排除姿勢性及動作性顫抖）。不能用於已達臨床 PD 診斷者。', options:binary(9.6,0.55)},
  {id:'quantMotor', group:'testing', label:'定量動作測試異常', prodromal:true, help:'較同齡常模差超過 1 個標準差，測試對臨床 PD 的特異度須 ≥80%；多項測試時至少半數異常。兩種動作評估同陽性取較高 LR、同陰性取較低 LR；相反結果才相乘。', options:binary(3.5,0.6)},
  {id:'sn', group:'testing', label:'黑質高回音性', help:'由具足夠訓練者執行的經顱超音波；屬風險標記，不計為陽性前驅標記。', options:binary(3.4,0.38)},
  {id:'genetic', group:'genetic', label:'家族史或遺傳風險（擇一）', help:'家族史、GBA、LRRK2 與 PRS 僅選一條路徑，不重複相乘。GBA 依原文 N370S／L444P 等中外顯率變異估計；LRRK2 僅 p.G2019S，不泛用到所有變異。PRS 四分位需依相符研究樣本定義。', options:[unknown,opt('family','一等親有 PD（父母或手足）',2.5),opt('none','無家族史／未檢出適用變異',1),opt('gba','適用的 GBA 變異帶因者','age'),opt('lrrk2','LRRK2 p.G2019S 帶因者','age'),opt('prsHigh','PRS 最高四分位',1.57),opt('prsMiddle','PRS 中間兩個四分位',1),opt('prsLow','PRS 最低四分位',0.45)]}
];
export const GROUPS = [
  {id:'risk', number:'02', title:'背景與風險標記', description:'只填已知資料；沒有評估的項目保留「未評估」。', open:true},
  {id:'clinical', number:'03', title:'非動作前驅標記', description:'依合格評估結果選擇，並排除其他明確原因。', open:true},
  {id:'testing', number:'04', title:'動作評估與輔助檢查', description:'專業檢查結果；程式會處理兩種動作評估的重疊。'},
  {id:'genetic', number:'05', title:'家族與遺傳風險', description:'無檢測結果不需要補做檢測；這一區只採一個風險來源。'}
];
export const EXAMPLE = {age:'60', clinicalPD:'no', highPenetrance:'no', sex:'male', pesticide:'yes', caffeine:'no', smoking:'never', rbd:'psgYes', olfaction:'yes', constipation:'no', depression:'no', somnolence:'no'};
