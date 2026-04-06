import { Response } from '@/lib/api/response';
import { Button, LoadingOverlay, NumberInput, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { settingsOnSubmit } from '../settingsOnSubmit';

export default function Urls({
  swr: { data, isLoading },
}: {
  swr: { data: Response['/api/server/settings'] | undefined; isLoading: boolean };
}) {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      urlsRoute: '/go',
      urlsLength: 6,
    },
    enhanceGetInputProps: (payload) => ({
      disabled: data?.tampered?.includes(payload.field) || false,
    }),
  });

  const onSubmit = settingsOnSubmit(navigate, form);

  useEffect(() => {
    if (!data) return;

    form.setValues({
      urlsRoute: data.settings.urlsRoute ?? '/go',
      urlsLength: data.settings.urlsLength ?? 6,
    });
  }, [data]);

  return (
    <>
      <LoadingOverlay visible={isLoading} />

      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap='lg'>
          <TextInput
            label='Route'
            description='The route to use for short URLs. Requires a server restart.'
            placeholder='/go'
            {...form.getInputProps('urlsRoute')}
          />

          <NumberInput
            label='Length'
            description='The length of the short URL (for randomly generated names).'
            placeholder='6'
            min={1}
            max={64}
            {...form.getInputProps('urlsLength')}
          />
        </Stack>

        <Button type='submit' mt='md' loading={isLoading} leftSection={<IconDeviceFloppy size='1rem' />}>
          Save
        </Button>
      </form>
    </>
  );
}
