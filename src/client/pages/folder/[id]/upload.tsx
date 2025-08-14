import ConfigProvider from '@/components/ConfigProvider';
import UploadFile from '@/components/pages/upload/File';
import { type Response } from '@/lib/api/response';
import { SafeConfig } from '@/lib/config/safe';
import { Anchor, Center, Container, Text } from '@mantine/core';
import { Link, Params, useLoaderData } from 'react-router-dom';
import useSWR from 'swr';

export async function loader({ params }: { params: Params<string> }) {
  const res = await fetch(`/api/server/folder/${params.id}?upload=true`);
  if (!res.ok) {
    throw new Response('Folder not found', { status: 404 });
  }
  return {
    folder: (await res.json()) as Response['/api/server/folder/[id]'],
  };
}

export function Component() {
  const { folder } = useLoaderData<typeof loader>();

  const { data: config } = useSWR<Response['/api/server/public']>('/api/server/public', {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshWhenHidden: false,
    revalidateIfStale: false,
  });

  return (
    <>
      <Container my='lg'>
        <ConfigProvider data={{ config: config as unknown as SafeConfig, codeMap: [] }}>
          <UploadFile title={`Upload files to ${folder.name}`} folder={folder.id} />
          <Center>
            <Text c='dimmed' ta='center'>
              {folder.public ? (
                <>
                  This folder is{' '}
                  <Anchor component={Link} to={`/folder/${folder.id}`}>
                    public
                  </Anchor>
                  . Anyone with the link can view its contents and upload files.
                </>
              ) : (
                "Only the owner can view this folder's contents. However, anyone can upload files, and they can still access their uploaded files if they have the link to the specific file."
              )}
            </Text>
          </Center>
        </ConfigProvider>
      </Container>
    </>
  );
}

Component.displayName = 'ViewFolderIdUpload';
