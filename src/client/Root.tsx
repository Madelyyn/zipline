import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { Outlet } from 'react-router-dom';
import { SWRConfig } from 'swr';
import ThemeProvider from '@/components/ThemeProvider';
import { type ZiplineTheme } from '@/lib/theme';
import { type Config } from '@/lib/config/validate';

export default function Root({
  themes,
  defaultTheme,
}: {
  themes?: ZiplineTheme[];
  defaultTheme?: Config['website']['theme'];
}) {
  return (
    <SWRConfig
      value={{
        fetcher: async (url: RequestInfo | URL) => {
          const res = await fetch(url);

          if (!res.ok) {
            const json = await res.json();

            throw new Error(json.message);
          }

          return res.json();
        },
      }}
    >
      <ThemeProvider ssrThemes={themes} ssrDefaultTheme={defaultTheme}>
        <ModalsProvider
          modalProps={{
            overlayProps: {
              blur: 6,
            },
            centered: true,
          }}
        >
          <Notifications zIndex={10000000} />
          <Outlet />
        </ModalsProvider>
      </ThemeProvider>
    </SWRConfig>
  );
}
