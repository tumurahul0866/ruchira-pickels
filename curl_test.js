import { execFile } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';

const json = { name: 'Debug User', email: 'debuguser+123@example.com', phone: '9999999999', password: 'DebugPass123' };
const path = './tmp-register.json';
writeFileSync(path, JSON.stringify(json), 'utf8');

const args = ['-i', '-H', 'Content-Type: application/json', '--data-binary', `@${path}`, 'http://127.0.0.1:3001/api/auth/register'];
console.log('curl args:', args);
execFile('curl.exe', args, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 }, (err, stdout, stderr) => {
  console.log('ERROR', err && err.message);
  console.log('STDOUT:\n', stdout);
  console.log('STDERR:\n', stderr);
  unlinkSync(path);
});
