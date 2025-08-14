import { type loader } from '@/client/pages/dashboard/admin/users/[id]/files';
import GridTableSwitcher from '@/components/GridTableSwitcher';
import { useViewStore } from '@/lib/store/view';
import { ActionIcon, Group, Title, Tooltip } from '@mantine/core';
import { IconArrowBackUp } from '@tabler/icons-react';
import { Link, useLoaderData } from 'react-router-dom';
import FileTable from '../files/views/FileTable';
import Files from '../files/views/Files';

export default function ViewUserFiles() {
  const data = useLoaderData<typeof loader>();
  if (!data) return null;

  const { user } = data;
  if (!user) return null;

  const view = useViewStore((state) => state.files);

  return (
    <>
      <Group>
        <Title>{user.username}&apos;s files</Title>
        <Tooltip label='Back to users'>
          <ActionIcon variant='outline' component={Link} to='/dashboard/admin/users'>
            <IconArrowBackUp size='1rem' />
          </ActionIcon>
        </Tooltip>

        <GridTableSwitcher type='files' />
      </Group>

      {view === 'grid' ? <Files id={user.id} /> : <FileTable id={user.id} />}
    </>
  );
}
