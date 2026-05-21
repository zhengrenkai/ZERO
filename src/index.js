const fs = require('fs');
const path = require('path');
const { validateJSON } = require('./validate');

const ROOT = path.join(__dirname, '..');
const CORE_DIR = path.join(ROOT, '01_人生核心档案');
const LOG_DIR = path.join(ROOT, '03_执行记录', '每日执行日志');

function readJSON(...segments) {
  const fp = path.join(ROOT, ...segments);
  if (!fs.existsSync(fp)) return null;
  try {
    return JSON.parse(fs.readFileSync(fp, 'utf-8'));
  } catch {
    console.error(`[ERROR] JSON 解析失败: ${fp}`);
    return null;
  }
}

function validateAll() {
  const coreFiles = fs.readdirSync(CORE_DIR).filter(f => f.endsWith('.json'));
  let totalErrors = 0;

  for (const fileName of coreFiles) {
    const data = readJSON('01_人生核心档案', fileName);
    if (!data) {
      console.log(`  [WARN] ${fileName} — 文件为空或解析失败`);
      continue;
    }
    const errors = validateJSON(fileName, data);
    if (errors.length > 0) {
      console.log(`  [FAIL] ${fileName}`);
      errors.forEach(e => console.log(`         → ${e}`));
      totalErrors += errors.length;
    } else {
      console.log(`  [OK]   ${fileName}`);
    }
  }

  return totalErrors;
}

function countExecutionDays() {
  if (!fs.existsSync(LOG_DIR)) return 0;

  const files = fs.readdirSync(LOG_DIR)
    .filter(f => f.endsWith('.md'))
    .sort();

  if (files.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = files.length - 1; i >= 0; i--) {
    const fileName = files[i];
    const dateStr = fileName.replace('.md', '');
    const [y, m, d] = dateStr.split('-').map(Number);
    const fileDate = new Date(y, m - 1, d);
    fileDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - streak);

    if (fileDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else if (i === files.length - 1 && fileDate > expectedDate) {
      continue;
    } else {
      break;
    }
  }

  return streak;
}

function countWeeklyExecution() {
  if (!fs.existsSync(LOG_DIR)) return { done: 0, total: 0 };

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  startOfWeek.setHours(0, 0, 0, 0);

  const files = fs.readdirSync(LOG_DIR)
    .filter(f => f.endsWith('.md'))
    .filter(f => {
      const dateStr = f.replace('.md', '');
      const [y, m, d] = dateStr.split('-').map(Number);
      const fileDate = new Date(y, m - 1, d);
      return fileDate >= startOfWeek && fileDate <= today;
    });

  const dayDiff = Math.floor((today - startOfWeek) / (1000 * 60 * 60 * 24)) + 1;
  return { done: files.length, total: Math.min(dayDiff, 7) };
}

function formatDivider(title) {
  const width = 39;
  const pad = Math.max(0, Math.floor((width - title.length) / 2));
  return '═'.repeat(pad) + ' ' + title + ' ' + '═'.repeat(width - pad - title.length - 2);
}

const identity = readJSON('01_人生核心档案', '人格与方向.json');
const goals = readJSON('01_人生核心档案', '长期目标.json');
const state = readJSON('01_人生核心档案', '当前状态.json');
const patterns = readJSON('01_人生核心档案', '行为模式.json');
const observations = readJSON('01_人生核心档案', 'AI观察记录.json');

console.log('');
console.log('═══════════════════════════════════════════');
console.log('  零');
console.log('═══════════════════════════════════════════');
console.log('');

if (state) {
  const 精力条 = '█'.repeat(state.精力) + '░'.repeat(10 - state.精力);
  const 动量条 = '█'.repeat(state.动量) + '░'.repeat(10 - state.动量);
  const 纪律条 = '█'.repeat(state.纪律) + '░'.repeat(10 - state.纪律);
  const 疲劳条 = '█'.repeat(state.疲劳) + '░'.repeat(10 - state.疲劳);
  const 压力条 = '█'.repeat(state.压力) + '░'.repeat(10 - state.压力);

  console.log(`  阶段: ${state.阶段}`);
  console.log(`  精力 ${精力条} ${state.精力}/10`);
  console.log(`  动量 ${动量条} ${state.动量}/10`);
  console.log(`  纪律 ${纪律条} ${state.纪律}/10`);
  console.log(`  疲劳 ${疲劳条} ${state.疲劳}/10`);
  console.log(`  压力 ${压力条} ${state.压力}/10`);
  console.log('');
}

console.log(formatDivider('执行统计'));
const streak = countExecutionDays();
const weekly = countWeeklyExecution();
console.log(`  连续执行: ${streak} 天`);
console.log(`  本周执行: ${weekly.done}/${weekly.total}`);
console.log('');

if (goals && goals.长期目标) {
  console.log(formatDivider('长期目标'));
  goals.长期目标.forEach((g, i) => console.log(`  P${g.优先级}  ${g.目标}`));
  console.log('');
}

if (goals && goals.季度目标) {
  console.log(formatDivider('季度目标'));
  goals.季度目标.forEach(g => {
    const icon = g.状态 === '进行中' ? '▶' : g.状态 === '已完成' ? '✓' : '○';
    console.log(`  ${icon} ${g.目标}`);
  });
  console.log('');
}

if (observations && observations.观察记录) {
  console.log(formatDivider('最新观察'));
  const latest = observations.观察记录.slice(-2);
  latest.forEach(o => console.log(`  [${o.类型}] ${o.内容.slice(0, 60)}...`));
  console.log('');
}

console.log(formatDivider('数据校验'));
const errorCount = validateAll();
if (errorCount === 0) {
  console.log('  ✓ 全部通过');
}
console.log('');

console.log('═══════════════════════════════════════════');
console.log(`  目录: ${ROOT}`);
console.log('═══════════════════════════════════════════');
