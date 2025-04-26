// frontend/components/ProtectedRoute.js
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user && requiredRole && user.role !== requiredRole) {
      router.push('/unauthorized');
    }
  }, [user, loading, router, requiredRole]);

  if (loading || !user || (requiredRole && user.role !== requiredRole)) {
    return <div>Loading...</div>;
  }

  return children;
}