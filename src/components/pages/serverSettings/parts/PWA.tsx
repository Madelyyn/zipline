import { Response } from '@/lib/api/response';
import {
  Button,
  ColorInput,
  Group,
  LoadingOverlay,
  Paper,
  SimpleGrid,
  Switch,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconDeviceFloppy, IconRefresh } from '@tabler/icons-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { settingsOnSubmit } from '../settingsOnSubmit';

export default function PWA({
  swr: { data, isLoading },
}: {
  swr: { data: Response['/api/server/settings'] | undefined; isLoading: boolean };
}) {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      pwaEnabled: false,
      pwaTitle: '',
      pwaShortName: '',
      pwaDescription: '',
      pwaThemeColor: '',
      pwaBackgroundColor: '',
    },
    enhanceGetInputProps: (payload: any): object => ({
      disabled:
        data?.tampered?.includes(payload.field) ||
        (payload.field !== 'pwaEnabled' && !form.values.pwaEnabled) ||
        false,
    }),
  });

  const onSubmit = async (values: typeof form.values) => {
    const sendValues: Record<string, any> = {};

    sendValues.pwaTitle = values.pwaTitle.trim() === '' ? null : values.pwaTitle.trim();
    sendValues.pwaShortName = values.pwaShortName.trim() === '' ? null : values.pwaShortName.trim();
    sendValues.pwaDescription = values.pwaDescription.trim() === '' ? null : values.pwaDescription.trim();

    return settingsOnSubmit(
      navigate,
      form,
    )({
      ...sendValues,
      pwaEnabled: values.pwaEnabled,
      pwaThemeColor: values.pwaThemeColor,
      pwaBackgroundColor: values.pwaBackgroundColor,
    });
  };

  useEffect(() => {
    if (!data) return;

    form.setValues({
      pwaEnabled: data.settings.pwaEnabled ?? false,
      pwaTitle: data.settings.pwaTitle ?? '',
      pwaShortName: data.settings.pwaShortName ?? '',
      pwaDescription: data.settings.pwaDescription ?? '',
      pwaThemeColor: data.settings.pwaThemeColor ?? '',
      pwaBackgroundColor: data.settings.pwaBackgroundColor ?? '',
    });
  }, [data]);

  return (
    <Paper withBorder p='sm' pos='relative' h='100%'>
      <LoadingOverlay visible={isLoading} />

      <Title order={2}>PWA</Title>

      <Text size='sm' c='dimmed'>
        Refresh the page after enabling PWA to see any changes.
      </Text>

      <form onSubmit={form.onSubmit(onSubmit)}>
        <Switch
          mt='md'
          label='PWA Enabled'
          description='Allow users to install the Zipline PWA on their devices.'
          {...form.getInputProps('pwaEnabled', { type: 'checkbox' })}
        />

        <SimpleGrid mt='md' cols={{ base: 1, md: 2 }} spacing='lg'>
          <TextInput
            label='Title'
            description='The title for the PWA'
            placeholder='Zipline'
            {...form.getInputProps('pwaTitle')}
          />

          <TextInput
            label='Short Name'
            description='The short name for the PWA'
            placeholder='Zipline'
            {...form.getInputProps('pwaShortName')}
          />

          <TextInput
            label='Description'
            description='The description for the PWA'
            placeholder='Zipline'
            {...form.getInputProps('pwaDescription')}
          />

          <ColorInput
            label='Theme Color'
            description='The theme color for the PWA'
            placeholder='#000000'
            {...form.getInputProps('pwaThemeColor')}
          />

          <ColorInput
            label='Background Color'
            description='The background color for the PWA'
            placeholder='#ffffff'
            {...form.getInputProps('pwaBackgroundColor')}
          />
        </SimpleGrid>

        <Group mt='md'>
          <Button type='submit' loading={isLoading} leftSection={<IconDeviceFloppy size='1rem' />}>
            Save
          </Button>
          <Button onClick={() => window.location.reload()} leftSection={<IconRefresh size='1rem' />}>
            Refresh
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
