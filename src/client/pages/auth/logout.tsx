import { useTitle } from '@/lib/hooks/useTitle';
import { useUserStore } from '@/lib/store/user';
import { LoadingOverlay } from '@mantine/core';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mutate } from 'swr';

export default function Logout() {
  useTitle('Log out');

  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const userRes = await fetch('/api/user');

      if (userRes.ok) {
        const res = await fetch('/api/auth/logout');

        if (res.ok) {
          setUser(null);
          mutate('/api/user', null);
          navigate('/auth/login');
        } else {
          navigate('/dashboard');
        }
      } else {
        navigate('/dashboard');
      }
    })();
  }, []);

  return <LoadingOverlay visible />;
}
