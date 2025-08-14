import DashboardURLs from '@/components/pages/urls';
import { useTitle } from '@/lib/hooks/useTitle';

export function Component() {
  useTitle('URLs');

  return <DashboardURLs />;
}

Component.displayName = 'Dashboard/URLs';
