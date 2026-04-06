import { Response } from '@/lib/api/response';
import { Button, LoadingOverlay, NumberInput, Stack, Switch } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { settingsOnSubmit } from '../settingsOnSubmit';

export default function Invites({
  swr: { data, isLoading },
}: {
  swr: { data: Response['/api/server/settings'] | undefined; isLoading: boolean };
}) {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      invitesEnabled: true,
      invitesLength: 6,
    },
    enhanceGetInputProps: (payload: any): object => ({
      disabled:
        data?.tampered?.includes(payload.field) ||
        (payload.field !== 'invitesEnabled' && !form.values.invitesEnabled) ||
        false,
    }),
  });

  const onSubmit = settingsOnSubmit(navigate, form);

  useEffect(() => {
    if (!data) return;

    form.setValues({
      invitesEnabled: data.settings.invitesEnabled ?? true,
      invitesLength: data.settings.invitesLength ?? 6,
    });
  }, [data]);

  return (
    <>
      <LoadingOverlay visible={isLoading} />

      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap='lg'>
          <Switch
            label='Enable Invites'
            description='Enable the use of invite links to register new users.'
            {...form.getInputProps('invitesEnabled', { type: 'checkbox' })}
          />

          <NumberInput
            label='Length'
            description='The length of the invite code.'
            placeholder='6'
            min={1}
            max={64}
            {...form.getInputProps('invitesLength')}
          />
        </Stack>

        <Button type='submit' mt='md' loading={isLoading} leftSection={<IconDeviceFloppy size='1rem' />}>
          Save
        </Button>
      </form>
    </>
  );
}
