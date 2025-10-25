const lvExp = [0,0,200,1500,4500,10800,28800];
let coinVal = 0; // 默认投币数

/* 主计算 */
function calc(){
  const now  = Math.floor(document.getElementById('expNow').value);
  const coin0= Math.floor(document.getElementById('coinNow').value);
  const vip0 = Math.floor(document.getElementById('vipLeft').value);
  const tgt  = parseInt(document.getElementById('targetLv').value);
  const need = lvExp[tgt] - now;

  if(need <= 0){
    document.getElementById('output').style.display = 'block';
    document.getElementById('resTitle').textContent = '🎉 已达成或超过目标等级';
    document.getElementById('resBody').textContent = '';
    document.getElementById('bar').style.width = '100%';
    return;
  }

  const base = 0
    + (document.getElementById('doLogin').checked ? 5 : 0)
    + (document.getElementById('doWatch').checked ? 5 : 0)
    + (document.getElementById('doShare').checked ? 5 : 0);
  const vipBonus = document.getElementById('doVip').checked ? 10 : 0;
  const coinPerDay = parseInt(document.getElementById('coinPerDay').value);

  let expLeft = need;
  let coinLeft= coin0;
  let vipLeft = vip0;
  let days = 0;
  let coinDays = null; // 记录硬币耗尽那天

  while(expLeft > 0){
    const use = Math.min(coinLeft + 1, coinPerDay);
    const gain = base + use*10 + (vipLeft>0 ? vipBonus : 0);
    expLeft -= gain;
    coinLeft = Math.max(0, coinLeft - (use - 1));
    if(vipLeft>0) vipLeft--;
    days++;

    // 第一次耗尽硬币，记下天数
    if(coinDays === null && coinLeft === 0) coinDays = days;
  }

  document.getElementById('output').style.display = 'block';
  document.getElementById('resTitle').textContent = `还需 ${days} 天到达 Lv${tgt}`;
  const showCoinDur = coin0 > 0 && coinPerDay > 0;
  document.getElementById('resCoin').textContent = (showCoinDur ? `硬币可坚持 ${coinDays ?? days} 天${coinDays !== null ? '（之后每天只剩登录送的1枚）' : ''}` : '');
  document.getElementById('resBody').textContent = ` 每日任务 ${base} 经验 + 投币 ${coinPerDay}×10${vipBonus?' + 大会员'+vipBonus:''} = ${base + coinPerDay*10 + vipBonus} 经验/天`;
  const percent = Math.min(100, Math.floor((now - lvExp[tgt-1]) / (lvExp[tgt] - lvExp[tgt-1]) * 100));
  document.getElementById('bar').style.width = percent + '%';
}
calc();

// 设置开始时间（可以修改这个时间为实际开始搭建的时间）
// 格式：年, 月-1, 日, 时, 分, 秒
const startDate = new Date(2024, 12, 1, 0, 0, 0);

// 显示开始时间
//document.getElementById('startTime').textContent =`开始时间：${startDate.toLocaleString('zh-CN')}`;

function updateTimer() {
    const now = new Date();
    const diff = now - startDate;

    // 计算天数、小时、分钟、秒
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // 更新显示
    document.getElementById('days').textContent = days.toString().padStart(1, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

// 立即更新一次
updateTimer();

// 每秒更新一次
setInterval(updateTimer, 1000);