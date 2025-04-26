"use client"
import React, { useState } from 'react';
import './register.styles.css'; // Import the CSS file
import Link from 'next/link';
import axios from 'axios';

function RegisterPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: '',
        role: 'patient',
        fullName: '',
        phone: '',
        // Additional fields conditionally shown based on role
        allergies: [],
        medicalHistory: '',
        licenseNumber: '',
        specialization: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        handleSignup(e)
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
    
        try {
            // const res = await fetch("http://localhost:5000/register", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ email: formData.email, password: formData.password }),
            // });

            const res = await axios.post('http://localhost:5000/register', {
                email: formData.email, password: formData.password
              });
    
            const data = await res.json();
    
            if (res.ok) {
                localStorage.setItem("token", data.token);
                router.push("/dashboard");
            } else {
                setError(data.message || "Login failed");
            }
        } catch (err) {
            console.log(JSON.stringify(err.message));
            setError("Something went wrong: " + JSON.stringify(err.message));
        }
    };    

    return (
        <div className="login-container">
            <h2>Register</h2>
            <form onSubmit={handleChange}>
                <select name="role" value={formData.role} onChange={handleChange} required>
                    <option value="patient">Patient</option>
                    <option value="provider">Healthcare Provider</option>
                </select>
                <div className="input-group">
                    <label>Email:</label><br />
                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        name='email'
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="input-group">
                    <label>Password:</label><br />
                    <input
                        type="password"
                        placeholder="Password"
                        name='password'
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="input-group">
                    <label>Phone Number:</label><br />
                    <input
                        type="text"
                        placeholder="Phone Number"
                        name='phone'
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>

                {formData.role === 'patient' && (
                    <>
                        <input
                            type="text"
                            name="allergies"
                            placeholder="Allergies (comma separated)"
                            value={formData.allergies}
                            onChange={handleChange}
                        />
                        <textarea
                            name="medicalHistory"
                            placeholder="Medical History"
                            value={formData.medicalHistory}
                            onChange={handleChange}
                        />
                    </>
                )}

                {formData.role === 'provider' && (
                    <>
                        <input
                            type="text"
                            name="licenseNumber"
                            placeholder="License Number"
                            value={formData.licenseNumber}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="specialization"
                            placeholder="Specialization"
                            value={formData.specialization}
                            onChange={handleChange}
                        />
                    </>
                )}

                <button type="submit" className="login-button">
                    Register
                </button>
            </form>

            <div className="extra-links">
                <p><a href="#">Forgot Password?</a></p>
                <p><Link href="/login">Already a User? Login Here</Link></p>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default RegisterPage;