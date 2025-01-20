import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include', // Include cookies for session management
    });

    if (response.ok) {
      navigate('/admin-dashboard'); // Redirect to the admin dashboard on successful login
    } else {
      const errorData = await response.text();
      setError(errorData || 'Login failed');
    }
  };

  return (
    <div style={{ 
      padding:'40px 20px',
      textAlign:'center',
      margin:'10px 10px'
    }}>
      <h1>Admin Login</h1>
      <form onSubmit={handleLogin}>
        <input style={{ margin:'20px 20px'}}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        /><br></br>
        <input style={{ margin:'20px 20px'}}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        /><br></br>
        <button type="submit" style={{ margin:'20px 20px'}} className='btn btn-light'>Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default AdminLogin;
