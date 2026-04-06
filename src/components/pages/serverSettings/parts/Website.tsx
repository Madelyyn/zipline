import { Response } from '@/lib/api/response';
import { Button, JsonInput, LoadingOverlay, Stack, Switch, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { settingsOnSubmit } from '../settingsOnSubmit';

const defaultExternalLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/diced/zipline',
  },
  {
    name: 'Documentation',
    url: 'https://zipline.diced.tech',
  },
];

export default function Website({
  swr: { data, isLoading },
}: {
  swr: { data: Response['/api/server/settings'] | undefined; isLoading: boolean };
}) {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      websiteTitle: 'Zipline',
      websiteTitleLogo: '',
      websiteExternalLinks: JSON.stringify(defaultExternalLinks),
      websiteLoginBackground: '',
      websiteLoginBackgroundBlur: true,
      websiteDefaultAvatar: '',
      websiteTos: '',

      websiteThemeDefault: 'system',
      websiteThemeDark: 'builtin:dark_gray',
      websiteThemeLight: 'builtin:light_gray',
    },
    enhanceGetInputProps: (payload) => ({
      disabled: data?.tampered?.includes(payload.field) || false,
    }),
  });

  const onSubmit = async (values: typeof form.values) => {
    const sendValues: Record<string, any> = {};

    if (values.websiteExternalLinks?.trim() === '' || !values.websiteExternalLinks) {
      // @ts-ignore
      sendValues.websiteExternalLinks = [];
    } else {
      // @ts-ignore
      try {
        sendValues.websiteExternalLinks = JSON.parse(values.websiteExternalLinks);
      } catch {
        form.setFieldError('websiteExternalLinks', 'Invalid JSON');
      }
    }

    sendValues.websiteTitleLogo =
      values.websiteTitleLogo.trim() === '' ? null : values.websiteTitleLogo.trim();
    sendValues.websiteLoginBackground =
      values.websiteLoginBackground.trim() === '' ? null : values.websiteLoginBackground.trim();
    sendValues.websiteDefaultAvatar =
      values.websiteDefaultAvatar.trim() === '' ? null : values.websiteDefaultAvatar.trim();
    sendValues.websiteTos = values.websiteTos.trim() === '' ? null : values.websiteTos.trim();

    sendValues.websiteThemeDefault = values.websiteThemeDefault.trim();
    sendValues.websiteThemeDark = values.websiteThemeDark.trim();
    sendValues.websiteThemeLight = values.websiteThemeLight.trim();
    sendValues.websiteTitle = values.websiteTitle.trim();

    sendValues.websiteLoginBackgroundBlur = values.websiteLoginBackgroundBlur;

    return settingsOnSubmit(navigate, form)(sendValues);
  };

  useEffect(() => {
    if (!data) return;

    form.setValues({
      websiteTitle: data.settings.websiteTitle ?? 'Zipline',
      websiteTitleLogo: data.settings.websiteTitleLogo ?? '',
      websiteExternalLinks: JSON.stringify(
        data.settings.websiteExternalLinks ?? defaultExternalLinks,
        null,
        2,
      ),
      websiteLoginBackground: data.settings.websiteLoginBackground ?? '',
      websiteLoginBackgroundBlur: data.settings.websiteLoginBackgroundBlur ?? true,
      websiteDefaultAvatar: data.settings.websiteDefaultAvatar ?? '',
      websiteTos: data.settings.websiteTos ?? '',
      websiteThemeDefault: data.settings.websiteThemeDefault ?? 'system',
      websiteThemeDark: data.settings.websiteThemeDark ?? 'builtin:dark_gray',
      websiteThemeLight: data.settings.websiteThemeLight ?? 'builtin:light_gray',
    });
  }, [data]);

  return (
    <>
      <LoadingOverlay visible={isLoading} />

      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap='lg'>
          <TextInput
            label='Title'
            description='The title of the website in browser tabs and at the top.'
            placeholder='Zipline'
            {...form.getInputProps('websiteTitle')}
          />

          <TextInput
            label='Title Logo'
            description='The URL to use for the title logo. This is placed to the left of the title.'
            placeholder='https://example.com/logo.png'
            {...form.getInputProps('websiteTitleLogo')}
          />

          <JsonInput
            label='External Links'
            description='The external links to show in the footer. This must be valid JSON.'
            formatOnBlur
            minRows={1}
            maxRows={7}
            autosize
            placeholder={JSON.stringify(defaultExternalLinks, null, 2)}
            {...form.getInputProps('websiteExternalLinks')}
          />

          <TextInput
            label='Login Background'
            description='The URL to use for the login background.'
            placeholder='https://example.com/background.png'
            {...form.getInputProps('websiteLoginBackground')}
          />

          <Switch
            label='Login Background Blur'
            description='Whether to blur the login background.'
            {...form.getInputProps('websiteLoginBackgroundBlur', { type: 'checkbox' })}
          />

          <TextInput
            label='Default Avatar'
            description='The path to use for the default avatar. This must be a path to an image, not a URL.'
            placeholder='/zipline/avatar.png'
            {...form.getInputProps('websiteDefaultAvatar')}
          />

          <TextInput
            label='Terms of Service'
            description='Path to a Markdown (.md) file to use for the terms of service.'
            placeholder='/zipline/TOS.md'
            {...form.getInputProps('websiteTos')}
          />

          <TextInput
            label='Default Theme'
            description='The default theme to use for the website.'
            placeholder='system'
            {...form.getInputProps('websiteThemeDefault')}
          />

          <TextInput
            label='Dark Theme'
            description='The dark theme to use for the website when the default theme is "system".'
            placeholder='builtin:dark_gray'
            {...form.getInputProps('websiteThemeDark')}
          />

          <TextInput
            label='Light Theme'
            description='The light theme to use for the website when the default theme is "system".'
            placeholder='builtin:light_gray'
            {...form.getInputProps('websiteThemeLight')}
          />
        </Stack>
        <Button type='submit' mt='md' loading={isLoading} leftSection={<IconDeviceFloppy size='1rem' />}>
          Save
        </Button>
      </form>
    </>
  );
}
