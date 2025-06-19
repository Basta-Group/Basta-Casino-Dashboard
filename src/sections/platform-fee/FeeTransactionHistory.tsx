import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, CircularProgress, Alert } from '@mui/material';
import { env } from 'src/config/env.config';

export default function FeeTransactionHistory() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${env.api.baseUrl}:${env.api.port}/api/auth/transactions?type=platform_fee`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setTransactions(data.data.transactions);
        else setError(data.error || 'Failed to fetch transactions');
      } catch (e) {
        setError('Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [token]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Platform Fee Transaction History</Typography>
        {loading ? <CircularProgress /> : error ? <Alert severity="error">{error}</Alert> : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Player</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Fee</TableCell>
                  <TableCell>Net</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map(tx => (
                  <TableRow key={tx._id || tx.id}>
                    <TableCell>{new Date(tx.created_at).toLocaleString()}</TableCell>
                    <TableCell>{tx.player_id?.username || tx.player_id || '-'}</TableCell>
                    <TableCell>{tx.metadata?.original_amount ?? '-'}</TableCell>
                    <TableCell>{tx.metadata?.fee_amount ?? '-'}</TableCell>
                    <TableCell>{tx.metadata?.net_amount ?? '-'}</TableCell>
                    <TableCell>{tx.description || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
} 