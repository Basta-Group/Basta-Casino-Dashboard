import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Avatar,
  TextField,
  Button,
  MenuItem,
  Pagination,
  Alert,
  Grid,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Iconify } from 'src/components/iconify';

// Styled components - updated colors to match earnings page
const PayoutsHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, #26A69A 0%, #4DB6AC 100%)`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  color: theme.palette.common.white,
  marginBottom: theme.spacing(4),
  boxShadow: theme.shadows[8],
}));

const RequestCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#F9FAFB',
  borderRadius: theme.shape.borderRadius * 2,
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(to right, #26A69A, #4DB6AC)`,
  },
}));

const StatusBadge = styled(Box)(({ status }: { status: string }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 8px',
  borderRadius: '12px',
  fontSize: '0.75rem',
  fontWeight: 600,
  backgroundColor:
    status === 'completed'
      ? 'rgba(76, 175, 80, 0.16)'
      : status === 'pending'
        ? 'rgba(255, 152, 0, 0.16)'
        : 'rgba(244, 67, 54, 0.16)',
  color: status === 'completed' ? '#4CAF50' : status === 'pending' ? '#FF9800' : '#F44336',
}));

interface Payout {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'rejected';
  paymentMethod: string;
  createdAt: string;
  notes?: string;
}

const AffiliatePayoutsPage = () => {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [requestLoading, setRequestLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    paymentMethod: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const currencies = ['USD', 'EUR', 'GBP', 'INR'];
  const paymentMethods = [
    { id: 'bank', label: 'Bank Transfer' },
    { id: 'paypal', label: 'PayPal' },
    { id: 'crypto', label: 'Cryptocurrency' },
  ];

  useEffect(() => {
    const fetchPayouts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mock data
        const mockPayouts: Payout[] = [
          {
            id: '1',
            amount: 1000,
            currency: 'USD',
            status: 'completed',
            paymentMethod: 'paypal',
            createdAt: '2024-04-15T10:30:00Z',
            notes: 'Paid via PayPal',
          },
          {
            id: '2',
            amount: 500,
            currency: 'EUR',
            status: 'pending',
            paymentMethod: 'bank',
            createdAt: '2024-04-14T15:45:00Z',
            notes: 'Processing bank transfer',
          },
          {
            id: '3',
            amount: 750,
            currency: 'GBP',
            status: 'rejected',
            paymentMethod: 'bank',
            createdAt: '2024-04-13T09:20:00Z',
            notes: 'Invalid payment details',
          },
        ];

        setPayouts(mockPayouts);
        setTotalPages(1);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPayouts();
  }, []);

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (Number(formData.amount) <= 0) {
        setErrorMessage('Amount must be greater than 0');
        setShowError(true);
        setShowSuccess(false);
      } else {
        // Add new payout to the list
        const newPayout: Payout = {
          id: String(payouts.length + 1),
          amount: Number(formData.amount),
          currency: formData.currency,
          status: 'pending',
          paymentMethod: formData.paymentMethod,
          createdAt: new Date().toISOString(),
          notes: 'Processing request',
        };

        setPayouts([newPayout, ...payouts]);
        setFormData({ amount: '', currency: 'USD', paymentMethod: '' });
        setShowSuccess(true);
        setShowError(false);
      }
      setRequestLoading(false);
    }, 1000);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#E0F2F1',
          p: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#E0F2F1',
          p: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Alert severity="error" sx={{ width: '100%', maxWidth: 600 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#E0F2F1', p: 4 }}>
      {/* Header */}
      <PayoutsHeader>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: '#FF7043', color: 'white', width: 48, height: 48 }}>
            <Iconify icon="solar:wallet-money-bold" width={24} />
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              Payouts
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Request payouts and view your payout history
            </Typography>
          </Box>
        </Box>
      </PayoutsHeader>

      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <RequestCard elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={3}>
                <Iconify icon="solar:card-transfer-bold" width={24} color="#26A69A" />
                <Typography variant="h6" color="#26A69A">
                  Request Payout
                </Typography>
              </Box>

              {showSuccess && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Payout request submitted successfully!
                </Alert>
              )}
              {showError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {errorMessage}
                </Alert>
              )}

              <form onSubmit={handleRequestPayout}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                        $
                      </Typography>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  select
                  label="Currency"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  margin="normal"
                  required
                >
                  {currencies.map((currency) => (
                    <MenuItem key={currency} value={currency}>
                      {currency}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  select
                  label="Payment Method"
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  margin="normal"
                  required
                >
                  {paymentMethods.map((method) => (
                    <MenuItem key={method.id} value={method.id}>
                      {method.label}
                    </MenuItem>
                  ))}
                </TextField>

                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={requestLoading}
                  sx={{ mt: 3, bgcolor: '#26A69A', '&:hover': { bgcolor: '#00897B' } }}
                  startIcon={
                    requestLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <Iconify icon="solar:card-send-bold" width={20} />
                    )
                  }
                >
                  {requestLoading ? 'Processing...' : 'Request Payout'}
                </Button>
              </form>
            </CardContent>
          </RequestCard>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card elevation={3} sx={{ bgcolor: '#F9FAFB' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={3}>
                <Iconify icon="solar:clock-circle-bold" width={24} color="#26A69A" />
                <Typography variant="h6" color="#26A69A">
                  Payout History
                </Typography>
              </Box>

              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#E0F2F1' }}>
                      <TableCell>
                        <Typography variant="subtitle2" color="#26A69A">
                          Date
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" color="#26A69A">
                          Amount
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" color="#26A69A">
                          Method
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" color="#26A69A">
                          Status
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payouts.length > 0 ? (
                      payouts.map((payout) => (
                        <TableRow
                          key={payout.id}
                          sx={{
                            '&:hover': {
                              bgcolor: '#ECEFF1',
                              transition: 'background-color 0.2s',
                            },
                          }}
                        >
                          <TableCell>
                            <Typography variant="body2" color="#37474F">
                              {formatDate(payout.createdAt)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600} color="#FF7043">
                              {formatCurrency(payout.amount, payout.currency)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="#78909C">
                              {paymentMethods.find((m) => m.id === payout.paymentMethod)?.label ||
                                'Unknown'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={payout.status}>
                              {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                            </StatusBadge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography variant="body2" color="#78909C">
                            No payout history available
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {payouts.length > 0 && (
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AffiliatePayoutsPage;
