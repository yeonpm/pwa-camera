import { Box, Container, Stack, Typography } from "@mui/material";

export default function OfflinePage() {
  return (
    <Box sx={{ py: 4 }}>
      <Container>
        <Stack spacing={1}>
          <Typography variant="h6" fontWeight={800}>
            오프라인 상태입니다
          </Typography>
          <Typography variant="body2" color="text.secondary">
            네트워크가 복구되면 다시 시도해주세요.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

