const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const COMMON_PATHS = [
  'C:\\Program Files\\Git\\bin\\git.exe',
  'C:\\Program Files (x86)\\Git\\bin\\git.exe',
  'C:\\Git\\bin\\git.exe',
  'D:\\Git\\bin\\git.exe',
  path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Git', 'bin', 'git.exe'),
  path.join(process.env.USERPROFILE || '', 'scoop', 'apps', 'git', 'current', 'bin', 'git.exe'),
];

function findGit() {
  // 1. 先尝试直接用 git（PATH 已配置）
  try {
    execSync('where git', { stdio: 'pipe' });
    return 'git';
  } catch { /* 继续查找 */ }

  // 2. 常见路径查找
  for (const p of COMMON_PATHS) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  // 3. 从注册表查找（仅限 Windows）
  if (process.platform === 'win32') {
    try {
      const regOutput = execSync(
        'reg query "HKLM\\SOFTWARE\\GitForWindows" /v InstallPath',
        { stdio: 'pipe', encoding: 'utf8' }
      );
      const match = regOutput.match(/InstallPath\s+REG_\w+\s+(.+)/);
      if (match) {
        const gitPath = path.join(match[1].trim(), 'bin', 'git.exe');
        if (fs.existsSync(gitPath)) {
          return gitPath;
        }
      }
    } catch { /* 忽略注册表错误 */ }
  }

  return null;
}

function runGit(args, options = {}) {
  const git = findGit();
  if (!git) {
    console.error('[错误] 未找到 git.exe');
    console.error('');
    console.error('常见解决方式：');
    console.error('  1. 安装 Git for Windows：https://git-scm.com/download/win');
    console.error('  2. 或将 git.exe 所在目录加入系统 PATH');
    console.error('  3. 或修改 src/push.js 中的 COMMON_PATHS 添加你的 Git 路径');
    process.exit(1);
  }

  console.log(`[Git] 使用: ${git}`);
  return execSync(`"${git}" ${args}`, { stdio: 'inherit', ...options });
}

const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);

try {
  runGit('add -A');
  try {
    runGit(`commit -m "${timestamp}"`);
  } catch {
    console.log('[提示] 没有变更需要提交，跳过 commit');
    process.exit(0);
  }
  runGit('push');
  console.log('\nDone.');
} catch (err) {
  console.error('\n推送失败:', err.message || err);
  process.exit(1);
}
