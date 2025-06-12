import type { SetStateAction} from 'react';
import type {
  ChipProps} from '@mui/material';

import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import {
  Box,
  Card,
  Chip,
  Table,
  Paper,
  Stack,
  TableRow,
  Container,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
  TablePagination // Import ChipProps for the color type
} from '@mui/material';

import { CONFIG } from 'src/config-global';

// Define the status type
type TransactionStatus = 'Completed' | 'Pending' | 'Failed';

// Sample transaction data with typed status
const transactions: {
  id: string;
  date: string;
  amount: number;
  type: string;
  status: TransactionStatus;
}[] = [
  { id: '1', date: '2025-03-27', amount: 150.0, type: 'Payment', status: 'Completed' },
  { id: '2', date: '2025-03-26', amount: 75.5, type: 'Refund', status: 'Pending' },
  { id: '3', date: '2025-03-25', amount: 200.0, type: 'Payment', status: 'Completed' },
];

// Status color mapping with typed values matching Chip's color prop
const statusColors: Record<TransactionStatus, ChipProps['color']> = {
  Completed: 'success',
  Pending: 'warning',
  Failed: 'error',
};

// ----------------------------------------------------------------------

export default function TransactionView() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: any, newPage: SetStateAction<number>) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Helmet>
        <title>{`Transactions - ${CONFIG.appName}`}</title>
      </Helmet>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" component="h1">
            Transaction History
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {transactions.length} transactions found
          </Typography>
        </Stack>

        <Card elevation={3} sx={{ borderRadius: 2 }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="transactions table">
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((transaction) => (
                    <TableRow
                      key={transaction.id}
                      sx={{
                        '&:hover': { bgcolor: 'grey.50' },
                        transition: 'background-color 0.2s',
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {transaction.id}
                      </TableCell>
                      <TableCell>
                        {new Date(transaction.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </TableCell>
                      <TableCell>
                        <Typography
                          color={transaction.type === 'Refund' ? 'error.main' : 'success.main'}
                          variant="subtitle2"
                        >
                          {transaction.type === 'Refund' ? '-' : '+'}$
                          {transaction.amount.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>
                        <Chip
                          label={transaction.status}
                          color={statusColors[transaction.status] || 'default'}
                          size="small"
                          sx={{ minWidth: 80 }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                {transactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Box sx={{ py: 4, textAlign: 'center' }}>
                        <Typography variant="h6" color="text.secondary">
                          No transactions found
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={transactions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ bgcolor: 'grey.50' }}
          />
        </Card>
      </Container>
    </>
  );
}
