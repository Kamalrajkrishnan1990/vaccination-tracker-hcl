"use client"
import React, { useState } from 'react';
import './login.styles.css'; // Import the CSS file
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState("");

    // const handleLogin = (e) => {
    //     e.preventDefault();
    //     console.log('Logging in with', email, password);
    //     // You can add your login logic here
    // };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                // Save the JWT token
                localStorage.setItem("token", data.token);

                // Redirect to dashboard
                router.push("/dashboard");
            } else {
                setError(data.message || "Login failed");
            }
        } catch (err) {
            setError("Something went wrong");
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
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

                <button type="submit" className="login-button">
                    Login
                </button>
            </form>

            <div className="extra-links">
                <p><a href="#">Forgot Password?</a></p>
                <p><Link href="/register">New User? Register Here</Link></p>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default LoginPage;