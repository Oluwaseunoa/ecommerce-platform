import React, { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      setMessage('Logged in! Token: ' + data.token);
    } catch {
      setMessage('Login failed.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input placeholder="Email" value={email}
          onChange={e => setEmail(e.target.value)} /><br />
        <input placeholder="Password" type="password" value={password}
          onChange={e => setPassword(e.target.value)} /><br />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;