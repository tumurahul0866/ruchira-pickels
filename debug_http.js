import http from 'http';

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const options = {
      hostname: '127.0.0.1',
      port: 3001,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = http.request(options, (res) => {
      let raw = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => (raw += chunk));
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: raw }));
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

(async () => {
  try {
    console.log('--- HEALTH ---');
    const health = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:3001/health', (res) => {
        let raw = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => resolve({ statusCode: res.statusCode, body: raw, headers: res.headers }));
      }).on('error', reject);
    });
    console.log(health);

    console.log('--- REGISTER ---');
    const registerResp = await post('/api/auth/register', {
      name: 'Debug User',
      email: 'debuguser+123@example.com',
      phone: '9999999999',
      password: 'DebugPass123',
    });
    console.log(registerResp);

    console.log('--- ADMIN LOGIN ---');
    const adminResp = await post('/api/admin/login', {
      email: 'ruchira@gmail.com',
      password: 'Admin@123',
    });
    console.log(adminResp);
  } catch (err) {
    console.error('ERROR', err);
    process.exit(1);
  }
})();
