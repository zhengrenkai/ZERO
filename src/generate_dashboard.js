const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

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

function writeFile(...segments) {
  const filePath = segments.pop();
  const dirPath = path.join(ROOT, ...segments);
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
  const fullPath = path.join(dirPath, filePath);
  return (content) => fs.writeFileSync(fullPath, content, 'utf-8');
}

function generate当前人生状态(state, goals) {
  const phase = (state && state.阶段) || (goals && goals.当前阶段) || '未知';
  const now = new Date().toISOString().slice(0, 10);

  return [
    '# 当前人生状态',
    '',
    `> 自动生成 | 最后更新: ${now}`,
    '',
    '## 阶段',
    `**${phase}**`,
    '',
    '## 生命体征',
    '| 指标 | 分数 | 趋势 |',
    '|------|------|------|',
    `| 精力 | ${state ? state.精力 + '/10' : 'N/A'} | — |`,
    `| 动量 | ${state ? state.动量 + '/10' : 'N/A'} | — |`,
    `| 纪律 | ${state ? state.纪律 + '/10' : 'N/A'} | — |`,
    `| 疲劳 | ${state ? state.疲劳 + '/10' : 'N/A'} | — |`,
    `| 压力 | ${state ? state.压力 + '/10' : 'N/A'} | — |`,
    '',
    '## 当前重点',
    ...(goals && goals.优先行动 ? goals.优先行动.map((a, i) => `${i + 1}. ${a}`) : ['1. 无']),
    '',
    '## 里程碑',
    ...(goals && goals.季度目标
      ? goals.季度目标
          .filter(q => q.状态 === '进行中')
          .map(q => `- [ ] ${q.目标}`)
      : ['- [ ] 无']),
    '',
  ].join('\n');
}

function generate当前重点目标(goals) {
  const primaryGoal = goals && goals.长期目标 ? goals.长期目标.find(g => g.优先级 === 1) : null;
  const secondaryGoal = goals && goals.长期目标 ? goals.长期目标.find(g => g.优先级 === 2) : null;

  return [
    '# 当前重点目标',
    '',
    `> 自动生成 | 最后更新: ${new Date().toISOString().slice(0, 10)}`,
    '',
    `## 优先级 1：${primaryGoal ? primaryGoal.目标.split(' - ')[0] : '无'}`,
    ...(goals && goals.优先行动 ? goals.优先行动.map(a => `- ${a}`) : ['- 无']),
    '',
    `## 优先级 2：${secondaryGoal ? secondaryGoal.目标.split(' - ')[0] : '无'}`,
    ...(goals && goals.季度目标
      ? goals.季度目标
          .filter(q => q.状态 === '待开始')
          .map(q => `- ${q.目标}`)
      : ['- 无']),
    '',
  ].join('\n');
}

function main() {
  const state = readJSON('01_人生核心档案', '当前状态.json');
  const goals = readJSON('01_人生核心档案', '长期目标.json');

  if (!state) console.warn('[WARN] 当前状态.json 未找到，将使用默认值');
  if (!goals) console.warn('[WARN] 长期目标.json 未找到，将使用默认值');

  const writeDashboard = writeFile('08_仪表盘');

  const 状态内容 = generate当前人生状态(state, goals);
  writeDashboard('当前人生状态.md')(状态内容);
  console.log('[OK] 08_仪表盘/当前人生状态.md');

  const 目标内容 = generate当前重点目标(goals);
  writeDashboard('当前重点目标.md')(目标内容);
  console.log('[OK] 08_仪表盘/当前重点目标.md');

  console.log('\n仪表盘生成完毕。');
}

main();
