const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function readJSON(...segments) {
  const fp = path.join(ROOT, ...segments);
  if (!fs.existsSync(fp)) return null;
  return JSON.parse(fs.readFileSync(fp, 'utf-8'));
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
  console.log(`  阶段: ${state.阶段}`);
  console.log(`  精力: ${state.精力}/10 | 动量: ${state.动量}/10 | 纪律: ${state.纪律}/10`);
  console.log(`  疲劳: ${state.疲劳}/10 | 压力: ${state.压力}/10`);
  console.log('');
}

if (goals && goals.长期目标) {
  console.log('  长期目标:');
  goals.长期目标.forEach((g, i) => console.log(`    ${i + 1}. ${g.目标}`));
  console.log('');
}

if (goals && goals.季度目标) {
  console.log('  季度目标:');
  goals.季度目标.forEach(g => console.log(`    ${g.状态 === '进行中' ? '▶' : '○'} ${g.目标}`));
  console.log('');
}

if (observations && observations.观察记录) {
  const latest = observations.观察记录.slice(-2);
  console.log('  最新观察:');
  latest.forEach(o => console.log(`    [${o.类型}] ${o.内容.slice(0, 60)}...`));
  console.log('');
}

console.log('═══════════════════════════════════════════');
console.log(`  目录: ${ROOT}`);
console.log('═══════════════════════════════════════════');
