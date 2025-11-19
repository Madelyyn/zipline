import { Export4, validateExport } from '@/lib/import/version4/validateExport';
import { Button, FileButton, Modal, Pill } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconDatabaseImport, IconDatabaseOff, IconUpload, IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

export default function ImportV4Button() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [export4, setExport4] = useState<Export4 | null>(null);

  const onContent = (content: string) => {
    if (!content) return console.error('no content');
    try {
      const data = JSON.parse(content);
      onJson(data);
    } catch (error) {
      console.error('failed to parse file content', error);
    }
  };

  const onJson = (data: unknown) => {
    const validated = validateExport(data);
    if (!validated.success) {
      console.error('Failed to validate import data', validated);
      showNotification({
        title: 'There were errors with the import',
        message:
          "Zipline couldn't validate the import data. Are you sure it's a valid export from Zipline v4? For more details about the error, check the browser console.",
        color: 'red',
        icon: <IconDatabaseOff size='1rem' />,
        autoClose: 10000,
      });
      setOpen(false);
      setFile(null);
      return;
    }
    setExport4(validated.data);
  };

  useEffect(() => {
    if (!open) return;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      onContent(content as string);
    };
    reader.readAsText(file);
  }, [file]);

  return (
    <>
      <Modal opened={open} onClose={() => setOpen(false)} title='Import V4 Data' size='xl'>
        {export4 ? (
          <Button
            onClick={() => {
              setFile(null);
              setExport4(null);
            }}
            color='red'
            variant='filled'
            aria-label='Clear'
            mb='xs'
            leftSection={<IconX size='1rem' />}
            fullWidth
          >
            Clear Import
          </Button>
        ) : (
          <FileButton onChange={setFile} accept='application/json'>
            {(props) => (
              <>
                <Button
                  {...props}
                  disabled={!!file}
                  mb='xs'
                  leftSection={<IconUpload size='1rem' />}
                  fullWidth
                >
                  Upload Export (JSON)
                </Button>
              </>
            )}
          </FileButton>
        )}

        {file && export4 && (
          <>
            <pre>{JSON.stringify(export4, null, 2)}</pre>
          </>
        )}

        {export4 && (
          <Button fullWidth leftSection={<IconDatabaseImport size='1rem' />} mt='xs'>
            Import Data
          </Button>
        )}
      </Modal>

      <Button size='xl' rightSection={<Pill>V4</Pill>} onClick={() => setOpen(true)}>
        Import
      </Button>
    </>
  );
}
