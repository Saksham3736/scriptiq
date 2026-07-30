/* AppShell.tsx — authenticated app shell (Sidebar + children) */
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import Sidebar from './Sidebar';

import ToastContainer from '../ui/ToastContainer';

export default function AppShell() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--color-bg-app, #F6F8FA)', color: 'var(--color-ink-900)' }}>
      <Sidebar />
      <main style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  );
}
