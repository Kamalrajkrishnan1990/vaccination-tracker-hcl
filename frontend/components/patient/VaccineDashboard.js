"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import './VaccineDashboard.styles.css'
import { useRouter } from 'next/navigation';

export default function VaccineDashboard() {
    const router = useRouter();
    const [vaccines, setVaccines] = useState([]);

    useEffect(() => {
        const fetchVaccines = async () => {
            try {
                const res = await axios.get('https://jsonplaceholder.typicode.com/todos');
                setVaccines(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchVaccines();
    }, []);

    const handleLoginClick = () => {
        router.naigate("/login")
    }

    return (
        <div>
           
            <div className="vaccine-list">
                {vaccines.map(vaccine => (
                    <div key={vaccine._id} className={`vaccine-card`}>
                        <h3>{vaccine.title}</h3>
                        <p>Status: {vaccine.completed}</p>
                    </div>
                ))}
            </div>

            <div>
                {/* Top Title */}
                <div className="header">
                    <h1>Bayer Healthcare</h1>
                    <nav>
                        <a href="#">Home</a>
                        <a href="#">Health Topics</a>
                        <a href="#">Resources</a>
                        <a href="#">About Us</a>
                        <a href="#">Contact</a>
                        <button className="login-button" onClick={handleLoginClick}>Login</button>
                    </nav>
                </div>

                {/* Sub Header */}
                <div className="sub-header">
                    <h2>Your Health Our Priority</h2>
                    <p>Explore the latest resources</p>
                </div>

                {/* Featured Health Topics */}
                <div className="featured-container">
                    <h2>Featured Health Topics</h2>
                    <div className="tiles">
                        <div className="tile">
                            <h3>Heart Health</h3>
                            <p>Learn how to take care of your heart with simple steps and a healthy lifestyle.</p>
                            <button>Learn More</button>
                        </div>
                        <div className="tile">
                            <h3>Mental Wellness</h3>
                            <p>Discover ways to maintain mental health and improve emotional well-being.</p>
                            <button>Learn More</button>
                        </div>
                        <div className="tile">
                            <h3>Nutrition Tips</h3>
                            <p>Understand the basics of good nutrition for a strong and energetic body.</p>
                            <button>Learn More</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}