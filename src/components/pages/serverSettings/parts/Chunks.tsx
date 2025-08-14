import { Response } from '@/lib/api/response';
import { Button, LoadingOverlay, Paper, SimpleGrid, Switch, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { settingsOnSubmit } from '../settingsOnSubmit';

export default function Chunks({
  swr: { data, isLoading },
}: {
  swr: { data: Response['/api/server/settings'] | undefined; isLoading: boolean };
}) {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      chunksEnabled: true,
      chunksMax: '95mb',
      chunksSize: '25mb',
    },
    enhanceGetInputProps: (payload: any): object => ({
      disabled:
        data?.tampered?.includes(payload.field) ||
        (payload.field !== 'chunksEnabled' && !form.values.chunksEnabled) ||
        false,
    }),
  });

  const onSubmit = settingsOnSubmit(navigate, form);

  useEffect(() => {
    if (!data) return;

    form.setValues({
      chunksEnabled: data.settings.chunksEnabled ?? true,
      chunksMax: data.settings.chunksMax ?? '',
      chunksSize: data.settings.chunksSize ?? '',
    });
  }, [data]);

  return (
    <Paper withBorder p='sm' pos='relative'>
      <LoadingOverlay visible={isLoading} />

      <Title order={2}>Chunks</Title>

      <form onSubmit={form.onSubmit(onSubmit)}>
        <Switch
          mt='md'
          label='Enable Chunks'
          description='Enable chunked uploads.'
          {...form.getInputProps('chunksEnabled', { type: 'checkbox' })}
        />

        <SimpleGrid mt='md' cols={{ base: 1, md: 2 }} spacing='lg'>
          <TextInput
            label='Max Chunk Size'
            description='Maximum size of an upload before it is split into chunks.'
            placeholder='95mb'
            disabled={!form.values.chunksEnabled}
            {...form.getInputProps('chunksMax')}
          />

          <TextInput
            label='Chunk Size'
            description='Size of each chunk.'
            placeholder='25mb'
            disabled={!form.values.chunksEnabled}
            {...form.getInputProps('chunksSize')}
          />
        </SimpleGrid>

        <Button type='submit' mt='md' loading={isLoading} leftSection={<IconDeviceFloppy size='1rem' />}>
          Save
        </Button>
      </form>
    </Paper>
  );
}
