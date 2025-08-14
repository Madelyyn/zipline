import { Response } from '@/lib/api/response';
import { Button, LoadingOverlay, NumberInput, Paper, SimpleGrid, TextInput, Title } from '@mantine/core';
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
    <Paper withBorder p='sm' pos='relative'>
      <LoadingOverlay visible={isLoading} />

      <Title order={2}>URL Shortener</Title>

      <form onSubmit={form.onSubmit(onSubmit)}>
        <SimpleGrid mt='md' cols={{ base: 1, md: 2 }} spacing='lg'>
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
        </SimpleGrid>

        <Button type='submit' mt='md' loading={isLoading} leftSection={<IconDeviceFloppy size='1rem' />}>
          Save
        </Button>
      </form>
    </Paper>
  );
}
