import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';
import { useAuth } from '../../providers/AuthProvider';

function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setAuthUser } = useAuth();
  

  useEffect(() => {
    const redirect = searchParams.get('redirect');
    const role = searchParams.get('role');
    const name = searchParams.get('name');
    const email = searchParams.get('email');

    if (role) {
      setAuthUser({
          name : name
        })
      // JWT is already set as HttpOnly cookie by the backend redirect
      dispatch(setUser({ name: name || null, email: email || null, role }));
      navigate(redirect || '/user-dashboard', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate, dispatch]);

  return <div>...</div>;
}

export default AuthCallback;
