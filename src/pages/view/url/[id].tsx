import { config } from '@/lib/config';
import { verifyPassword } from '@/lib/crypto';
import { prisma } from '@/lib/db';
import { fetchApi } from '@/lib/fetchApi';
import { Anchor, Button, Modal, PasswordInput } from '@mantine/core';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function ViewUrlId({ url, password }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  const [passwordValue, setPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  useEffect(() => {
    if (!password) router.replace(url.destination!);
  }, []);

  return password ? (
    <Modal onClose={() => {}} opened={true} withCloseButton={false} centered title='Password required'>
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          const res = await fetch(`/api/user/urls/${url.id}/password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: passwordValue.trim() }),
          });

          if (res.ok) {
            router.reload();
          } else {
            setPasswordError('Invalid password');
          }
        }}
      >
        <PasswordInput
          description='This link is password protected, enter password to view it'
          required
          mb='sm'
          value={passwordValue}
          onChange={(event) => setPassword(event.currentTarget.value)}
          error={passwordError}
        />

        <Button
          fullWidth
          variant='outline'
          my='sm'
          type='submit'
          disabled={passwordValue.trim().length === 0}
        >
          Verify
        </Button>
      </form>
    </Modal>
  ) : (
    <p>
      Redirecting to <Anchor href={url.destination!}>{url.destination!}</Anchor>
    </p>
  );
}

export const getServerSideProps: GetServerSideProps<{
  url: { id: string; destination?: string };
  password?: boolean;
}> = async (context) => {
  const { id } = context.query as { id: string; pw: string };
  if (!id) return { notFound: true };

  const url = await prisma.url.findFirst({
    where: {
      OR: [{ vanity: id }, { code: id }, { id }],
    },
    select: {
      id: true,
      password: true,
      destination: true,
      maxViews: true,
      views: true,
      enabled: true,
    },
  });
  if (!url) return { notFound: true };

  if (!url.enabled) return { notFound: true };
  if (url.maxViews && url.views >= url.maxViews) {
    if (config.features.deleteOnMaxViews)
      await prisma.url.delete({
        where: {
          id: url.id,
        },
      });

    return {
      notFound: true,
    };
  }

  const configSend = { website: { theme: config.website.theme } };

  const pw = context.req.cookies[`url_pw_${url.id}`];

  if (pw && url.password) {
    const verified = await verifyPassword(pw, url.password!);
    // @ts-ignore
    delete url.password;

    if (!verified) {
      // @ts-ignore
      delete url.destination;

      return {
        props: {
          url,
          password: true,
        },
      };
    }

    return {
      redirect: {
        destination: url.destination,
        permanent: true,
        config: configSend,
      },
    };
  }

  const password = url.password ? true : false;
  // @ts-ignore
  delete url.password;

  await prisma.url.update({
    where: {
      id: url.id,
    },
    data: {
      views: {
        increment: 1,
      },
    },
  });

  return {
    props: {
      url,
      password,
      config: configSend,
    },
  };
};
