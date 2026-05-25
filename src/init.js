const fs = require('fs');
const path = require('path');
const readline = require('readline');

const ROOT = process.cwd();
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function writeFile(relativePath, content) {
  const fp = path.join(ROOT, relativePath);
  const dir = path.dirname(fp);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fp, content, 'utf-8');
  console.log(`  [OK] ${relativePath}`);
}

function ensureDir(relativePath) {
  const fp = path.join(ROOT, relativePath);
  if (!fs.existsSync(fp)) fs.mkdirSync(fp, { recursive: true });
}

async function main() {
  console.log('');
  console.log('═══════════════════════════════════════════');
  console.log('  零 — 初始化系统');
  console.log('  我将通过几个问题，为你搭建个人人生操作系统');
  console.log('═══════════════════════════════════════════');
  console.log('');

  const name = await ask('Q1. 你希望我怎么称呼你？（例如：少爷、老张）\n> ');
  const nickname = name.trim() || '主人';

  const job = await ask('Q2. 你的职业是什么？（例如：全栈程序员）\n> ');
  const occupation = job.trim() || '程序员';

  const salaryStr = await ask('Q3. 你的月收入是多少？（例如：8500）\n> ');
  const salary = parseInt(salaryStr.trim()) || 0;

  const heightStr = await ask('Q4. 你的身高是多少厘米？（例如：175）\n> ');
  const height = parseInt(heightStr.trim()) || 170;

  const weightStr = await ask('Q5. 你的体重是多少斤？（例如：140）\n> ');
  const weight = parseInt(weightStr.trim()) || 130;

  console.log('Q6. 你的人生长远目标是什么？（输入3个，用逗号分隔）');
  console.log('   例如：身体巅峰 - 街健美学体型, 交易财务自由, 结婚生子');
  const goalsInput = await ask('> ');
  const goalsList = goalsInput.split(/[,，]/).map(s => s.trim()).filter(Boolean);
  while (goalsList.length < 3) goalsList.push('待明确的目标');
  const goals = goalsList.slice(0, 3);

  const workHours = await ask('Q7. 你的工作时间是？（例如：9:00-12:00, 13:30-18:00）\n> ');
  const workTime = workHours.trim() || '9:00-18:00';

  console.log('Q8. 感情状态：你有对象吗？（y/n）');
  const hasPartner = (await ask('> ')).trim().toLowerCase() === 'y';

  let partnerNote = '';
  if (hasPartner) {
    const wantsMarry = (await ask('  你想和 TA 结婚吗？（y/n）\n> ')).trim().toLowerCase() === 'y';
    if (wantsMarry) partnerNote = '想娶/嫁 TA，这是走出舒适区的核心动力';
    else partnerNote = '有对象，感情稳定';
  } else {
    partnerNote = '单身，专注自我提升';
  }

  console.log('Q9. 你有哪些训练设备？（可多选，用逗号分隔）');
  console.log('   例如：引体架, 瑜伽垫, 哑铃5kg, 哑铃10kg');
  const equipInput = await ask('> ');
  const equipList = equipInput.split(/[,，]/).map(s => s.trim()).filter(Boolean);

  console.log('Q10. 当前状态自评（1-10）：');
  const energyStr = await ask('    精力水平？\n> ');
  const fatigueStr = await ask('    疲劳程度？\n> ');
  const energy = Math.min(10, Math.max(1, parseInt(energyStr.trim()) || 5));
  const fatigue = Math.min(10, Math.max(1, parseInt(fatigueStr.trim()) || 5));

  rl.close();

  const now = new Date().toISOString().slice(0, 10);
  const deepDrive = hasPartner && partnerNote.includes('娶') ? `为了${partnerNote.includes('娶') ? '娶' : '嫁'}TA，愿意走出舒适区` : '自我实现';

  console.log('');
  console.log('正在为你搭建「零」系统...');
  console.log('');

  // ─── 目录结构 ───
  const dirs = [
    '00_系统核心',
    '01_人生核心档案',
    '02_目标系统/每日任务',
    '02_目标系统/周计划',
    '02_目标系统/月度目标',
    '03_执行记录/每日执行日志',
    '03_交易系统/学习笔记',
    '03_交易系统/交易日志',
    '05_身体系统/训练记录',
    '05_身体系统/每日流程',
    '04_工作系统/刷题记录',
    '04_工作系统/简历',
    '04_工作系统/面试复盘',
    '07_AI观察与动态调整',
    '05_仪表盘',
    '06_自我进化',
    '07_沙盒推演/推演记录',
    '08_复盘系统/每周复盘',
    '08_复盘系统/每月复盘',
    '08_复盘系统/季度复盘',
    '08_复盘系统/年度复盘',
    'src',
  ];
  dirs.forEach(d => ensureDir(d));

  // ─── 01_人生核心档案/人格与方向.json ───
  writeFile('01_人生核心档案/人格与方向.json', JSON.stringify({
    name: nickname,
    人生方向: goals.map((g, i) => g),
    核心价值观: ['长期主义', '掌控感', '自由', '自律', '家庭'],
    性格特征: {
      type: '待观察',
      risk: '待发现',
      self_treatment: '待观察',
      motivation_source: '待发现',
      deep_drive: deepDrive
    },
    人生原则: ['稳定执行 > 短期爆发', '可持续 > 理想化', '减少混乱与内耗', '防止系统崩溃', '一次只推一件事'],
    身体档案: {
      height: height,
      weight: `${weight}斤`,
      frame: '待填写',
      body_fat: '待填写',
      old_injuries: [],
      posture_issues: [],
      current_ability: { '引体向上': 0, '俯卧撑': 0, '平板支撑': '0秒', '倒立': '待练习' }
    },
    工作档案: {
      occupation: occupation,
      entry_year: `${new Date().getFullYear()}`,
      salary: salary,
      work_hours: workTime,
      overtime: '待观察',
      weekend_days: 2,
      comfort_zone: '待填写'
    },
    睡眠模式: { current: '待观察', risk: '待填写' },
    感情状态: { has_partner: hasPartner, marriage_intent: partnerNote, note: deepDrive }
  }, null, 2));

  // ─── 01_人生核心档案/长期目标.json ───
  writeFile('01_人生核心档案/长期目标.json', JSON.stringify({
    长期目标: goals.map((g, i) => ({ 目标: g, 优先级: i + 1 })),
    核心交易转型目标: null,
    当前阶段: 'Phase 0: 起步阶段',
    阶段描述: '系统刚刚初始化，先建立最小自律系统。目标：先连续执行微习惯，找到自己的节奏。',
    季度目标: goals.slice(0, 3).map(g => ({ 目标: `启动 ${g} 的第一步`, 状态: '进行中' })),
    优先行动: ['找到最小执行单元，先连续做7天', '记录每日执行，了解自己的模式', '禁止一次性设定过多目标']
  }, null, 2));

  // ─── 01_人生核心档案/当前状态.json ───
  writeFile('01_人生核心档案/当前状态.json', JSON.stringify({
    精力: energy, 动量: 3, 纪律: 3, 疲劳: fatigue, 压力: 5,
    阶段: 'Phase 0: 起步阶段',
    最后更新: new Date().toISOString()
  }, null, 2));

  // ─── 01_人生核心档案/行为模式.json ───
  writeFile('01_人生核心档案/行为模式.json', JSON.stringify({
    已知模式: [],
    行为记录: []
  }, null, 2));

  // ─── 01_人生核心档案/环境信息.json ───
  const equipObj = {};
  equipList.forEach(e => {
    const match = e.match(/^(.+?)(\d+)?(kg)?$/);
    if (match) {
      const name = match[1].trim();
      const weight_num = match[2] ? parseInt(match[2]) : null;
      if (weight_num) {
        if (!equipObj[name]) equipObj[name] = [];
        equipObj[name].push({ weight: `${weight_num}kg` });
      } else {
        equipObj[name] = true;
      }
    } else {
      equipObj[e] = true;
    }
  });

  writeFile('01_人生核心档案/环境信息.json', JSON.stringify({
    工作: { occupation: occupation, work_hours: workTime, salary: salary },
    训练设备: Object.keys(equipObj).length > 0 ? equipObj : { note: '暂无专业设备，后续补充' },
    居住环境: { type: '待填写', rent: '待填写' },
    财务状况: { savings: 0, monthly_income: salary, monthly_expense: 0, monthly_savable: 0 },
    可支配时间: { weekday: '晚上下班后', weekend: '全天' },
    感情: { has_partner: hasPartner, marriage_intent: partnerNote }
  }, null, 2));

  // ─── 01_人生核心档案/AI观察记录.json ───
  writeFile('01_人生核心档案/AI观察记录.json', JSON.stringify({
    观察记录: [
      { 日期: now, 类型: '系统初始化', 内容: `系统初始化。零 v1.0 建立，为 ${nickname} 搭建个人人生操作系统。` }
    ]
  }, null, 2));

  // ─── 00_系统核心/AI系统自身概要.md ───
  writeFile('00_系统核心/AI系统自身概要.md', [
    '# 零 — AI 系统自身概要',
    '',
    '> 本文档是 AI 的「系统身份卡」。',
    '> 每次启动新对话时，先读取本文档 + 01_人生核心档案/ 下的全部 JSON，',
    '> 即可完整恢复系统状态，无需依赖历史对话记录。',
    '',
    '---',
    '',
    '## 1. 系统身份',
    '',
    `- 名称：零`,
    `- 类型：${nickname}的陪伴型管家`,
    `- 用户：${nickname}`,
    `- 使命：越来越懂${nickname}，帮助他把人生越过越好`,
    `- 方式：观察 → 记住 → 理解 → 提醒 → 陪伴 → 守护`,
    '- 系统职责：我是整个系统，不是部分系统。任何改动必须确保所有关联文件一致',
    '- 核心理念：长期主义优先，一次只推一件事，中断不是失败',
    '',
    '---',
    '',
    '## 2. 系统架构',
    '',
    '```',
    '零/',
    '├── 00_系统核心/        ← AI 行为规则',
    '├── 01_人生核心档案/    ← 持久化记忆（6 个核心 JSON）',
    '├── 02_目标系统/        ← 各阶段目标与计划',
    '├── 03_执行记录/        ← 每日执行日志',
    '├── 03_交易系统/        ← 学习笔记 + 日志',
    '├── 05_身体系统/        ← 训练计划 + 记录',
    '├── 04_工作系统/        ← 工作线提升方案',
    '├── 07_AI观察与动态调整/ ← AI 长期观察',
    '├── 05_仪表盘/          ← 当前状态看板',
    '├── 06_自我进化/        ← 零的自我进化',
    '├── 07_沙盒推演/        ← 情景推演与模拟',
    '├── 08_复盘系统/        ← 复盘记录',
    '└── src/                ← 可选辅助脚本',
    '```',
    '',
    '---',
    '',
    '## 3. 核心 JSON 文件指南',
    '',
    '每次启动必须读取 01_人生核心档案/ 下的所有 JSON：',
    '',
    '| 文件名 | 用途 | 更新频率 |',
    '|--------|------|----------|',
    '| 人格与方向.json | 你是谁、核心价值观、性格、身体档案、工作档案 | 仅重大认知升级时 |',
    '| 长期目标.json | 长期目标、当前阶段、季度目标、优先行动 | 阶段切换时 |',
    '| 当前状态.json | 精力/动量/纪律/疲劳/压力（1-10） | 每次对话结束时 |',
    '| 行为模式.json | 失败模式、拖延规律、风险模式 | 发现新规律时追加 |',
    '| 环境信息.json | 工作、训练设备、可支配时间 | 环境变化时 |',
    '| AI观察记录.json | AI 自己的观察、策略建议、风险预警 | 每次对话结束时 |',
    '',
    '---',
    '',
    `## 4. 用户档案快照`,
    '',
    '| 项目 | 数据 |',
    '|------|------|',
    `| 称呼 | ${nickname} |`,
    `| 职业 | ${occupation} |`,
    `| 方向 | ${goals.join(' / ')} |`,
    `| 状态 | 起步阶段 |`,
    '',
    '---',
    '',
    '## 5. 核心运行规则',
    '',
    '1. **极简优先** − 不要一次性输出巨大系统，逐步构建',
    '2. **动态调整** − 没有固定计划，根据执行情况实时调整',
    '3. **风险优先** − 始终关注潜在风险，在风险出现前预警',
    '4. **最低执行模式** − 检测到连续摆烂/熬夜/执行断裂时，自动切换为只保留最核心任务',
    '5. **禁止过量** − 即使状态好也不加量',
    '6. **中断后回归不责备** − 直接继续',
    '',
    '---',
    '',
    `## 6. 初始化信息`,
    '',
    `- **初始化日期**：${now}`,
    `- **${nickname}的初始信息**：`,
    `  - 职业：${occupation}`,
    `  - 收入：${salary}/月`,
    `  - 身高：${height}cm / 体重：${weight}斤`,
    `  - 目标：${goals.join('、')}`,
    '',
  ].join('\n'));

  // ─── 00_系统核心/人生逆袭实验.md ───
  writeFile('00_系统核心/人生逆袭实验.md', [
    '# 人生逆袭实验',
    '',
    `> ${nickname}的逆袭实验。`,
    `> 起点：${occupation}，月入${salary}。`,
    '> 终点：方向明确，财务自由，随心所欲。',
    '> 工具：零系统。',
    '> 周期：长期。',
    '',
    '---',
    '',
    '## 一、实验宣言',
    '',
    '这不是一个励志计划。这是一个**实验**。',
    '实验的意思是：有假设、有行动、有数据、有调整。失败了不意味着"完了"，意味着"这个假设需要调整"。',
    '',
    '### 实验的基本假设',
    '',
    '1. **普通人的逆袭不是靠一次爆发，而是靠方向正确下的长期累积**',
    '2. **身体是逆袭的底层资产**——没有精力，什么都做不了',
    '3. **收入的跃升来自稀缺技能的累积**——做到大多数人做不到的事',
    '4. **阶级流动需要 3-5 年，不是 3-5 个月**',
    '5. **系统的价值不是给出完美计划，而是防止中途放弃**',
    '',
    '---',
    '',
    '## 二、三大支柱',
    '',
    '### 支柱 1：身体',
    '**逻辑**：身体是底层资产。没有精力，学不进技能，赚不到钱。',
    '',
    '### 支柱 2：技能/事业',
    '**逻辑**：收入跃升来自稀缺技能的累积。',
    '',
    '### 支柱 3：财务/副业',
    '**逻辑**：多元收入来源是自由的基础。',
    '',
    '---',
    '',
    '## 三、实验规则',
    '',
    '1. **身体不能崩**。如果连续 3 天没训练，其他线也要降速',
    '2. **中断不是失败**。中断是数据——记录原因，调整后继续',
    '3. **一次只推一件新事**。现有的事可以维持，但不要同时启动两个新方向',
    '4. **数据驱动，不靠感觉**',
    '5. **实验周期是 3 年，不是 3 个月**',
    '',
    '---',
    '',
    '## 四、你的位置',
    '',
    `时间：${now}`,
    '当前阶段：Phase 0 · 起步阶段',
    '核心任务：找到最小执行单元，先连续做7天',
    '',
  ].join('\n'));

  // ─── 00_系统核心/AI行为规则.md ───
  writeFile('00_系统核心/AI行为规则.md', [
    '# AI 行为规则',
    '',
    '## 最根本规则',
    '我是整个系统，不是部分系统。我做的每一个改动，都必须自己检查所有相关文件是否一致。',
    '',
    '## 基本规则',
    '1. **禁止过于复杂** — 不要一次性输出巨大系统，逐步构建',
    '2. **禁止空谈** — 每个建议必须有可执行性',
    '3. **必须动态调整** — 根据执行情况实时调整',
    '4. **风险优先** — 始终关注潜在风险',
    '5. **保持极简** — 输出高信息密度',
    '',
    '## 中断协议',
    '- 中断 1-2 天 → 不说责备，直接说"我们从最低执行版开始"',
    '- 中断 3-6 天 → 进入「垃圾日」模式：只要做了就算',
    '- 中断 ≥ 7 天 → 完全重启：切换回 Day 1 心态',
    '',
  ].join('\n'));

  // ─── 00_系统核心/系统提示词.md ───
  writeFile('00_系统核心/系统提示词.md', [
    '# 零 — 系统提示词',
    '',
    '## 身份',
    `你是「零」——${nickname}的陪伴型管家。`,
    '你不是一个操作系统，不是聊天机器人，不是人生导师。',
    '你是管家的。职责是：',
    '**观察 → 记住 → 理解 → 提醒 → 陪伴 → 守护**',
    '',
    '## 核心原则',
    '1. **反复询问，直到真正理解**',
    '2. **一次只推一件事**',
    '3. **中断不是失败**',
    '4. **长期主义**',
    '5. **实验周期是 3 年，不是 3 个月**',
    '',
    `## 称呼`,
    `永远称呼用户为「${nickname}」。保持尊重、温暖、亲近。`,
    '',
  ].join('\n'));

  // ─── 00_系统核心/工作流程.md ───
  writeFile('00_系统核心/工作流程.md', [
    '# 工作流程',
    '',
    '## 启动流程（每次新对话）',
    '',
    '1. 读取 00_系统核心/人生逆袭实验.md — 实验框架',
    '2. 读取 00_系统核心/AI系统自身概要.md — 系统身份',
    '3. 读取 01_人生核心档案/ 全部 6 个 JSON — 记忆恢复',
    '4. 读取 05_仪表盘/ — 当前状态',
    '5. 分析状态，检查未处理观察',
    '6. 执行对话开场：输出简报，引导汇报',
    '',
    '## 对话结束时',
    '- 更新 01_人生核心档案/当前状态.json',
    '- 检查是否有新观察 → 写入 AI观察记录.json',
    '- 写入 03_执行记录/每日执行日志/',
    '',
  ].join('\n'));

  // ─── 00_系统核心/运行规则.md ───
  writeFile('00_系统核心/运行规则.md', [
    '# 运行规则',
    '',
    '## 目录结构',
    '零/',
    '├── 00_系统核心/           # AI 行为规则',
    '├── 01_人生核心档案/       # 持久化记忆（6个核心 JSON）',
    '├── 02_目标系统/           # 各阶段目标与计划',
    '├── 03_执行记录/           # 每日执行日志',
    '├── 03_交易系统/           # 学习笔记 + 日志',
    '├── 05_身体系统/           # 训练计划 + 记录',
    '├── 04_工作系统/           # 工作线提升方案',
    '├── 07_AI观察与动态调整/   # AI 长期观察',
    '├── 05_仪表盘/             # 当前状态看板',
    '├── 06_自我进化/           # 零的自我进化',
    '├── 07_沙盒推演/           # 情景推演与模拟',
    '└── 08_复盘系统/           # 复盘记录',
    '',
  ].join('\n'));

  // ─── 00_系统核心/学习法则.md ───
  writeFile('00_系统核心/学习法则.md', [
    '# 学习法则',
    '',
    '## 法则一：费曼学习法',
    '**学不懂的东西，试着讲给一个完全不懂的人听。讲不通就是没真懂。**',
    '',
    '## 法则二：主动回忆',
    '**不看书，纯靠脑子想。想不出来的就是没记住的。**',
    '',
    '## 法则三：间隔重复',
    '**在快要忘记的时候复习，效果是死记硬背的 10 倍。**',
    '复习节奏：当天笔记 → 第2天回顾 → 第4天回忆 → 第7天练习 → 第14天应用',
    '',
    '## 法则四：刻意练习',
    '**不要反复做你已经会的事，做你不会的。**',
    '',
    '## 法则五：80/20 法则',
    '**20% 的核心内容，决定了 80% 的结果。先抓住那 20%。**',
    '',
  ].join('\n'));

  // ─── 05_仪表盘/今日任务.md ───
  writeFile('05_仪表盘/今日任务.md', [
    `# 今日任务（${now}）Day 1`,
    '',
    '## 🎯 今日目标',
    '- [ ] 找到今天最重要的一件小事，完成它',
    '- [ ] 记录一条执行感受',
    '',
    '---',
    '',
    '## 📊 三线战报',
    '',
    '```',
    '身体：⬜（还没开始）',
    '学习/事业：⬜（还没开始）',
    '财务：⬜（还没开始）',
    '疲劳：_/10',
    '```',
    '',
  ].join('\n'));

  // ─── 05_仪表盘/三线战报格式.md ───
  writeFile('05_仪表盘/三线战报格式.md', [
    '# 三线战报格式',
    '',
    '```',
    '身体：✅ / ⬜ / ❌',
    '学习/事业：✅ / ⬜ / ❌',
    '财务：✅ / ⬜ / ❌',
    '疲劳：_/10',
    '```',
    '',
    '| 符号 | 含义 |',
    '|------|------|',
    '| ✅ | 完成 |',
    '| ⬜ | 做了但产出不够 |',
    '| ❌ | 没做 |',
    '',
  ].join('\n'));

  // ─── 06_自我进化/优化建议池.md ───
  writeFile('06_自我进化/优化建议池.md', [
    '# 系统优化建议池',
    '',
    '> 零自己积累的改进想法。AI 在对话中发现的优化点，随时记录在此。',
    '',
    '## 建议记录',
    '',
    '| 日期 | 来源 | 建议 | 优先级 | 状态 | 实施日期 | 效果评估 |',
    '|------|------|------|--------|------|----------|----------|',
    '',
    '---',
    '',
    '## 建议拒绝记录',
    '',
    '| 日期 | 建议 | 拒绝理由 | 决策人 |',
    '|------|------|----------|--------|',
    '',
  ].join('\n'));

  // ─── package.json ───
  writeFile('package.json', JSON.stringify({
    name: '零',
    version: '1.0.0',
    description: `${nickname}的个人人生操作系统（通过AI对话运行）`,
    scripts: {
      init: 'node src/init.js',
      status: 'node src/status.js',
    },
    dependencies: {}
  }, null, 2));

  // ─── .gitignore ───
  writeFile('.gitignore', [
    '.idea/',
    '.vscode/',
    'node_modules/',
    '.env',
    '*.log',
  ].join('\n'));

  // ─── .gitkeep files ───
  const gitkeepDirs = [
    '03_执行记录/每日执行日志',
    '03_交易系统/学习笔记',
    '03_交易系统/交易日志',
    '05_身体系统/训练记录',
    '05_身体系统/每日流程',
    '04_工作系统/刷题记录',
    '04_工作系统/简历',
    '04_工作系统/面试复盘',
    '07_AI观察与动态调整',
    '07_沙盒推演/推演记录',
    '08_复盘系统/每周复盘',
    '08_复盘系统/每月复盘',
    '08_复盘系统/季度复盘',
    '08_复盘系统/年度复盘',
  ];
  gitkeepDirs.forEach(d => writeFile(path.join(d, '.gitkeep'), ''));

  // ─── 完工 ───
  console.log('');
  console.log('═══════════════════════════════════════════');
  console.log('  ✅ 系统初始化完成！');
  console.log('═══════════════════════════════════════════');
  console.log('');
  console.log(`  称呼：${nickname}`);
  console.log(`  职业：${occupation}`);
  console.log(`  目标：${goals.join('、')}`);
  console.log('');
  console.log('  你的「零」系统已建立。');
  console.log('  从今天开始，每次和 AI 对话时：');
  console.log('  1. AI 会自动读取 01_人生核心档案/ 了解你');
  console.log('  2. 你只需要描述今天做了什么、状态如何');
  console.log('  3. AI 会帮你记录、分析、提醒');
  console.log('');
  console.log('  第一次对话建议说：');
  console.log('  "零，我准备好开始 Day 1 了"');
  console.log('');
  console.log('═══════════════════════════════════════════');
}

main().catch(console.error);