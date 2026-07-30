/* RequireRole.tsx — Role-Based Access Control (RBAC) Route Guard Component */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore, type UserRole } from '@/store/authStore';
import { ShieldAlert } from 'lucide-react';

interface RequireRoleProps {
  allowedRoles: UserRole[];
  children?: React.ReactNode;
}

export default function RequireRole({ allowedRoles, children }: RequireRoleProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  if (!isAuthenticated) {
    const targetLogin = allowedRoles.includes('patient') ? '/patient/login' : '/login';
    return <Navigate to={targetLogin} replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          padding: '40px',
          textAlign: 'center',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#FDF2F2',
            color: '#E15554',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
          }}
        >
          <ShieldAlert size={32} />
        </div>
        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '22px', color: '#101A2E', margin: '0 0 8px 0' }}>
          Access Denied
        </h2>
        <p style={{ fontSize: '14px', color: '#5B6B82', maxWidth: '400px', margin: '0 0 24px 0', lineHeight: 1.5 }}>
          Your role (<strong style={{ color: '#101A2E' }}>{user.role}</strong>) does not have permission to access this page. Required role: {allowedRoles.join(' or ')}.
        </p>
        <a
          href="/dashboard"
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            background: '#12897F',
            color: '#fff',
            textDecoration: 'none',
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 600,
            fontSize: '13px',
          }}
        >
          Return to Dashboard
        </a>
      </div>
    );
  }

  return children ? <>{children}</> : <Outlet />;
}
