import { Container, Paper, Stack, Text, Title } from '@mantine/core';

export default function GenericError({
  title,
  message,
  details,
}: {
  title?: string;
  message?: string;
  details?: Record<string, any>;
}) {
  return (
    <Container my='lg'>
      <Stack gap='xs'>
        <Title order={5}>{title || 'An error occurred'}</Title>
        <Text c='dimmed'>
          {message || 'Something went wrong. Please try again later, or report this issue if it persists.'}
        </Text>
        {details && (
          <Paper withBorder px={3} py={3}>
            <pre style={{ margin: 0 }}>{JSON.stringify(details, null, 2)}</pre>
          </Paper>
        )}
      </Stack>
    </Container>
  );
}
