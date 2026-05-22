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

function readFile(...segments) {
  const fp = path.join(ROOT, ...segments);
  if (!fs.existsSync(fp)) return null;
  return fs.readFileSync(fp, 'utf-8');
}

function checkSystemBuildProgress() {
  const roadmap = readFile('09_系统建设', '迭代路线图.md');
  
  if (!roadmap) {
    console.log('[WARN] 迭代路线图.md 未找到');
    return null;
  }

  const lines = roadmap.split('\n');
  let doneTasks = 0;
  let todoTasks = 0;
  let nextTask = null;

  for (const line of lines) {
    if (line.includes('|') && !line.includes('|---') && !line.includes('| 优先级 |')) {
      if (line.includes('✅') || line.includes('已完成')) {
        doneTasks++;
      } else if (line.includes('⬜') && line.includes('待办')) {
        todoTasks++;
        if (!nextTask) {
          const match = line.match(/\|.*\|(.*)\|.*\|.*\|/);
          nextTask = match ? match[1].trim() : null;
        }
      }
    }
  }

  const totalTasks = doneTasks + todoTasks;

  return {
    totalTasks,
    doneTasks,
    todoTasks,
    progress: totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0,
    nextTask
  };
}

function checkSuggestions() {
  const suggestions = readFile('09_系统建设', '优化建议池.md');
  if (!suggestions) return { hasHighPriority: false, count: 0 };

  const highPriorityMatches = suggestions.match(/\*\*高优先级\*\*/g) || [];
  const suggestionMatches = suggestions.match(/- \[ \]/g) || [];

  return {
    hasHighPriority: highPriorityMatches.length > 0,
    count: suggestionMatches.length
  };
}

function checkActionRules() {
  const rules = readFile('00_系统核心', 'AI行为规则.md');
  if (!rules) return false;

  const requiredSections = [
    '主动砍线机制',
    '三线精简会',
    '中断协议',
    'Week 3 末强制疲劳检查'
  ];

  return requiredSections.every(section => rules.includes(section));
}

function checkObservations() {
  const observations = readJSON('01_人生核心档案', 'AI观察记录.json');
  if (!observations || !observations.观察记录) return { count: 0, recent: [] };

  const recent = observations.观察记录
    .slice(-5)
    .map(o => ({
      date: o.时间,
      type: o.类型,
      scope: o.scope
    }));

  return {
    count: observations.观察记录.length,
    recent
  };
}

function checkExecutionLogs() {
  const logDir = path.join(ROOT, '03_执行记录', '每日执行日志');
  if (!fs.existsSync(logDir)) return { count: 0, recent: [] };

  const files = fs.readdirSync(logDir)
    .filter(f => f.endsWith('.md'))
    .sort()
    .slice(-7);

  return {
    count: files.length,
    recent: files
  };
}

function generateReport() {
  const build = checkSystemBuildProgress();
  const suggestions = checkSuggestions();
  const rulesOK = checkActionRules();
  const observations = checkObservations();
  const logs = checkExecutionLogs();

  const now = new Date().toISOString();
  
  let report = `# 系统建设自动检查报告\n\n`;
  report += `> 生成时间: ${now}\n\n`;
  
  report += `## 📊 迭代进度\n`;
  if (build) {
    report += `| 总任务 | 已完成 | 待办 | 进度 |\n`;
    report += `|--------|--------|------|------|\n`;
    report += `| ${build.totalTasks} | ${build.doneTasks} | ${build.todoTasks} | ${build.progress}% |\n\n`;
    
    if (build.nextTask) {
      report += `**下一个任务**: ${build.nextTask}\n\n`;
    }
  }

  report += `## 🎯 优化建议池\n`;
  report += `- 待处理建议: ${suggestions.count} 条\n`;
  report += `- 高优先级: ${suggestions.hasHighPriority ? '有' : '无'}\n\n`;

  report += `## 📋 AI行为规则\n`;
  report += `- 关键规则完整性: ${rulesOK ? '✓ 通过' : '✗ 缺失'}\n\n`;

  report += `## 🔍 AI观察记录\n`;
  report += `- 总记录数: ${observations.count}\n`;
  if (observations.recent.length > 0) {
    report += `- 最近5条记录: 有\n`;
  } else {
    report += `- 最近5条记录: 无\n`;
  }
  report += '\n';

  report += `## 📝 执行日志\n`;
  report += `- 日志总数: ${logs.count}\n`;
  report += `- 最近7天: ${logs.recent.length} 条\n\n`;

  report += `## ⚠️ 预警\n`;
  const warnings = [];
  if (suggestions.hasHighPriority) {
    warnings.push('• 有高优先级优化建议待处理');
  }
  if (!rulesOK) {
    warnings.push('• AI行为规则不完整');
  }
  if (observations.count === 0) {
    warnings.push('• AI观察记录为空');
  }
  if (logs.recent.length < 3) {
    warnings.push('• 最近执行记录不足');
  }

  if (warnings.length > 0) {
    report += warnings.join('\n') + '\n\n';
  } else {
    report += '• 暂无预警\n\n';
  }

  report += `## 🚀 建议行动\n`;
  if (build && build.nextTask) {
    report += `1. 完成下一个系统建设任务: ${build.nextTask}\n`;
  }
  if (suggestions.count > 0) {
    report += `2. 处理优化建议池中的 ${suggestions.count} 条建议\n`;
  }
  report += '3. 每周至少记录1条AI观察\n';

  return report;
}

function main() {
  const report = generateReport();
  console.log(report);

  const outputPath = path.join(ROOT, '09_系统建设', '自动化检查报告.md');
  fs.writeFileSync(outputPath, report, 'utf-8');
  console.log(`\n报告已保存到: ${outputPath}`);

  return report;
}

if (require.main === module) {
  main();
}

module.exports = {
  checkSystemBuildProgress,
  checkSuggestions,
  checkActionRules,
  checkObservations,
  checkExecutionLogs,
  generateReport,
  main
};
