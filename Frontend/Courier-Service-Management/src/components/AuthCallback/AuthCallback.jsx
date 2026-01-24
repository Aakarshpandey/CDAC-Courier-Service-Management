import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const redirect = searchParams.get('redirect');
    const role = searchParams.get('role');

    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      navigate(redirect || '/user-dashboard', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate]);

  // Minimal spinner - users will barely see this
  return <div>...</div>;
}

export default AuthCallback;