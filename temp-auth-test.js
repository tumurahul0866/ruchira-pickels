const fetch = global.fetch || require('node-fetch');
(async () => {
  try {
    const adminBody = { email: 'admin@vasukipickles.com', password: 'Admin@123' };
    const adminResp = await fetch('http://127.0.0.1:3001/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminBody),
    });
    console.log('ADMIN STATUS', adminResp.status);
    console.log('ADMIN BODY', await adminResp.text());

    const regBody = { name: 'Test User', email: `testuser+${Date.now()}@example.com`, phone: '1234567890', password: 'TestPass123' };
    const regResp = await fetch('http://127.0.0.1:3001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(regBody),
    });
    console.log('REGISTER STATUS', regResp.status);
    console.log('REGISTER BODY', await regResp.text());
  } catch (err) {
    console.error(err);
  }
})();
