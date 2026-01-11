import RelativeDate from '@/components/RelativeDate';
import { Response } from '@/lib/api/response';
import { Folder } from '@/lib/db/models/folder';
import { ActionIcon, Anchor, Box, Checkbox, Group, Tooltip } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import {
  IconCopy,
  IconFiles,
  IconLock,
  IconLockOpen,
  IconPencil,
  IconShare,
  IconShareOff,
  IconTrashFilled,
  IconZip,
} from '@tabler/icons-react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { copyFolderUrl, deleteFolder, editFolderUploads, editFolderVisibility } from '../actions';
import EditFolderNameModal from '../EditFolderNameModal';
import ViewFilesModal from '../ViewFilesModal';

export default function FolderTableView() {
  const clipboard = useClipboard();

  const { data, isLoading } = useSWR<Extract<Response['/api/user/folders'], Folder[]>>('/api/user/folders');

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'createdAt',
    direction: 'desc',
  });
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [editNameOpen, setEditNameOpen] = useState<Folder | null>(null);

  const sorted = useMemo<Folder[]>(() => {
    if (!data) return [];

    const { columnAccessor, direction } = sortStatus;
    const key = columnAccessor as keyof Folder;

    return [...data].sort((a, b) => {
      const av = a[key]!;
      const bv = b[key]!;

      if (av === bv) return 0;
      return direction === 'asc' ? (av > bv ? 1 : -1) : av < bv ? 1 : -1;
    });
  }, [data, sortStatus]);

  return (
    <>
      <ViewFilesModal
        opened={!!selectedFolder}
        onClose={() => setSelectedFolder(null)}
        folder={selectedFolder}
      />

      <EditFolderNameModal
        opened={!!editNameOpen}
        folder={editNameOpen}
        onClose={() => setEditNameOpen(null)}
      />

      <Box my='sm'>
        <DataTable
          borderRadius='sm'
          withTableBorder
          minHeight={200}
          records={sorted ?? []}
          columns={[
            {
              accessor: 'name',
              sortable: true,
              render: (folder) =>
                folder.public ? (
                  <Anchor href={`/folder/${folder.id}`} target='_blank'>
                    {folder.name}
                  </Anchor>
                ) : (
                  folder.name
                ),
            },
            {
              accessor: 'public',
              sortable: true,
              render: (folder) => <Checkbox checked={folder.public} />,
            },
            {
              accessor: 'allowUploads',
              title: 'Uploads?',
              sortable: true,
              render: (folder) => <Checkbox checked={folder.allowUploads} />,
            },
            {
              accessor: 'createdAt',
              title: 'Created',
              sortable: true,
              render: (folder) => <RelativeDate date={folder.createdAt} />,
            },
            {
              accessor: 'updatedAt',
              title: 'Last update at',
              sortable: true,
              render: (folder) => <RelativeDate date={folder.updatedAt} />,
            },
            {
              accessor: 'actions',
              textAlign: 'right',
              render: (folder) => (
                <Group gap='sm' justify='right' wrap='nowrap'>
                  <Tooltip label='View files'>
                    <ActionIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFolder(folder);
                      }}
                    >
                      <IconFiles size='1rem' />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label='Copy folder link'>
                    <ActionIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        copyFolderUrl(folder, clipboard);
                      }}
                      disabled={!folder.public}
                    >
                      <IconCopy size='1rem' />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label={folder.public ? 'Make private' : 'Make public'}>
                    <ActionIcon
                      color={folder.public ? 'blue' : 'gray'}
                      onClick={(e) => {
                        e.stopPropagation();
                        editFolderVisibility(folder, !folder.public);
                      }}
                    >
                      {folder.public ? <IconLockOpen size='1rem' /> : <IconLock size='1rem' />}
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip
                    label={folder.allowUploads ? 'Disable anonymous uploads' : 'Allow anonymous uploads'}
                  >
                    <ActionIcon
                      color={folder.allowUploads ? 'blue' : 'gray'}
                      onClick={(e) => {
                        e.stopPropagation();
                        editFolderUploads(folder, !folder.allowUploads);
                      }}
                    >
                      {folder.allowUploads ? <IconShareOff size='1rem' /> : <IconShare size='1rem' />}
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label='Edit Folder Name'>
                    <ActionIcon
                      color='blue'
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditNameOpen(folder);
                      }}
                    >
                      <IconPencil size='1rem' />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label='Export folder as ZIP'>
                    <ActionIcon
                      color='blue'
                      onClick={() => window.open(`/api/user/folders/${folder.id}/export`, '_blank')}
                    >
                      <IconZip size='1rem' />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label='Delete Folder'>
                    <ActionIcon
                      color='red'
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFolder(folder);
                      }}
                    >
                      <IconTrashFilled size='1rem' />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              ),
            },
          ]}
          fetching={isLoading}
          sortStatus={sortStatus}
          onSortStatusChange={(s) => setSortStatus(s as unknown as any)}
        />
      </Box>
    </>
  );
}
