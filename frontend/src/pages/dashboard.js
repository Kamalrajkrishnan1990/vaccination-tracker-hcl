"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      router.push("/login");
    } else {
      // Optionally: decode token to show user info
      const userInfo = JSON.parse(atob(token.split('.')[1]));
      setUser(userInfo);
    }
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome {user.email}</h1>
      <p>You are logged in!</p>
    </div>
  );
}
