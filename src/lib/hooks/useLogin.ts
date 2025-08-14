import { useEffect } from 'react';
import { redirect } from 'react-router-dom';
import useSWR from 'swr';
import { useShallow } from 'zustand/shallow';
import type { Response } from '../api/response';
import { isAdministrator } from '../role';
import { useUserStore } from '../store/user';

export default function useLogin(administratorOnly: boolean = false) {
  const { data, error, isLoading, mutate } = useSWR<Response['/api/user']>('/api/user', {
    fallbackData: { user: undefined },
  });

  const [user, setUser] = useUserStore(useShallow((state) => [state.user, state.setUser]));

  useEffect(() => {
    if (data?.user) {
      setUser(data.user);
    } else if (error) {
      redirect('/auth/login');
    }
  }, [data, error]);

  useEffect(() => {
    if (user && administratorOnly && !isAdministrator(user.role)) {
      redirect('/dashboard');
    }
  }, [user]);

  return { user, loading: isLoading || !user, mutate };
}
