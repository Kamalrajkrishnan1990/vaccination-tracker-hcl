"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [patientsData, setPatientsData] = useState([]);

  const fetchPatientData = async () => {
    try {
      const response = await axios.get('/api/patient-data');
      if (response.data.success) {
        setPatientsData(response.data.patientInfo)
        // Use response.data.patientInfo
        // Use response.data.vaccineRecords
        // Use response.data.summary
      }
    } catch (error) {
      alert(error.response.data.message)
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      router.push("/login");
    } else {
      const userInfo = JSON.parse(atob(token.split('.')[1]));
      setUser(userInfo);
    }

    fetchPatientData()
  }, []);

  console.log("\n\n patientsData: ", patientsData);
  

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome {user.email}</h1>
      <p>You are logged in!</p>
    </div>
  );
}
