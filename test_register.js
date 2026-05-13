fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'Test',
    lastName: 'User',
    email: 'test@test.com',
    profession: 'medico',
    password: 'password123'
  })
}).then(res => res.text()).then(console.log).catch(console.error);
