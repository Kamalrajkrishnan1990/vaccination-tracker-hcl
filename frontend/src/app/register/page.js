"use client"
import React, { useState } from 'react';
import './register.styles.css'; // Import the CSS file
import Link from 'next/link';

function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        console.log('Logging in with', email, password, name);
        // You can add your login logic here
    };

    return (
        <div className="login-container">
            <h2>Register</h2>
            <form onSubmit={handleLogin}>
                <div className="input-group">
                    <label>Email:</label><br />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="input-group">
                    <label>Password:</label><br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="input-group">
                    <label>Full Name:</label><br />
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="login-button">
                    Register
                </button>
            </form>

            <div className="extra-links">
                <p><a href="#">Forgot Password?</a></p>
                <p><Link href="/login">Already a User? Login Here</Link></p>
            </div>
        </div>
    );
}

export default RegisterPage;