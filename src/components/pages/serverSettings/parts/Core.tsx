import { Response } from '@/lib/api/response';
import { Button, LoadingOverlay, Stack, Switch, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { settingsOnSubmit } from '../settingsOnSubmit';

export default function Core({
  swr: { data, isLoading },
}: {
  swr: { data: Response['/api/server/settings'] | undefined; isLoading: boolean };
}) {
  const navigate = useNavigate();

  const form = useForm<{
    coreReturnHttpsUrls: boolean;
    coreDefaultDomain: string | null | undefined;
    coreTempDirectory: string;
    coreTrustProxy: boolean;
  }>({
    initialValues: {
      coreReturnHttpsUrls: false,
      coreDefaultDomain: '',
      coreTempDirectory: '/tmp/zipline',
      coreTrustProxy: false,
    },
    enhanceGetInputProps: (payload) => ({
      disabled: data?.tampered?.includes(payload.field) || false,
    }),
  });

  const onSubmit = async (values: typeof form.values) => {
    if (values.coreDefaultDomain?.trim() === '' || !values.coreDefaultDomain) {
      values.coreDefaultDomain = null;
    } else {
      values.coreDefaultDomain = values.coreDefaultDomain.trim();
    }

    return settingsOnSubmit(navigate, form)(values);
  };

  useEffect(() => {
    if (!data) return;

    form.setValues({
      coreReturnHttpsUrls: data.settings.coreReturnHttpsUrls ?? false,
      coreDefaultDomain: data.settings.coreDefaultDomain ?? '',
      coreTempDirectory: data.settings.coreTempDirectory ?? '/tmp/zipline',
      coreTrustProxy: data.settings.coreTrustProxy ?? false,
    });
  }, [data]);

  return (
    <>
      <LoadingOverlay visible={isLoading} />

      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap='lg'>
          <Switch
            mt='md'
            label='Return HTTPS URLs'
            description='Return URLs with HTTPS protocol.'
            {...form.getInputProps('coreReturnHttpsUrls', { type: 'checkbox' })}
          />

          <Switch
            label='Trust Proxies'
            description='Trust the X-Forwarded-* headers set by proxies. Only enable this if you are behind a trusted proxy (nginx, caddy, etc.). Requires a server restart.'
            {...form.getInputProps('coreTrustProxy', { type: 'checkbox' })}
          />

          <TextInput
            label='Default Domain'
            description='The domain to use when generating URLs. This value should not include the protocol.'
            placeholder='example.com'
            {...form.getInputProps('coreDefaultDomain')}
          />

          <TextInput
            label='Temporary Directory'
            description='The directory to store temporary files. If the path is invalid, certain functions may break. Requires a server restart.'
            placeholder='/tmp/zipline'
            {...form.getInputProps('coreTempDirectory')}
          />
        </Stack>

        <Button type='submit' mt='md' loading={isLoading} leftSection={<IconDeviceFloppy size='1rem' />}>
          Save
        </Button>
      </form>
    </>
  );
}
