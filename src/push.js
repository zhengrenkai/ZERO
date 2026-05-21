const { execSync } = require('child_process');

const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);

try {
  execSync('git add -A', { stdio: 'inherit' });
  execSync(`git commit -m "${timestamp}"`, { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });
  console.log('\nDone.');
} catch (err) {
  console.error('推送失败:', err.message);
  process.exit(1);
}
