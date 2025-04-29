/**
 * The Tale of the Affiliate's Payout Portal:
 * This component is the gateway for affiliates to manage their earnings.
 * It fetches payout history from /api/auth/affiliate/payouts, displaying past requests in a table with date, amount, method, and status.
 * It retrieves payment methods from /api/auth/payment-methods, populating a dropdown for new payout requests.
 * Affiliates can submit requests via /api/auth/affiliate/payouts/request, specifying amount, currency (USD, INR, POUND), and payment method.
 * With JWT authentication, Material-UI styling, Axios for API calls, and infinite scrolling, it ensures a seamless quest to claim rewards.
 */
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
  Avatar,
  TextField,
  Button,
  MenuItem,
  Alert,
  Grid,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { Iconify } from 'src/components/iconify';
import InfiniteScroll from 'react-infinite-scroll-component';

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
    status === 'paid'
      ? 'rgba(76, 175, 80, 0.16)'
      : status === 'approved'
        ? 'rgba(33, 150, 243, 0.16)'
        : status === 'pending'
          ? 'rgba(255, 152, 0, 0.16)'
          : 'rgba(244, 67, 54, 0.16)',
  color:
    status === 'paid'
      ? '#4CAF50'
      : status === 'approved'
        ? '#2196F3'
        : status === 'pending'
          ? '#FF9800'
          : '#F44336',
}));

interface Payout {
  _id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  paymentMethodId?: string;
  createdAt: string;
  adminNotes?: string;
}

interface PaymentMethod {
  _id: string;
  label: string;
  method_type: string;
  last4?: string;
  brand?: string;
}

const apiUrl = `${import.meta.env.VITE_API_BASE_URL}:${import.meta.env.VITE_API_PORT}/api/auth`;

const AffiliatePayoutsPage = () => {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [requestLoading, setRequestLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    paymentMethodId: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const currencies = ['USD', 'INR', 'POUND'];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('affiliateToken');
        if (!token) {
          throw new Error('Authentication required');
        }

        const payoutsResponse = await axios.get(`${apiUrl}/affiliate/payouts`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: 1, limit: 20 },
        });

        const { payouts: fetchedPayouts, pagination } = payoutsResponse.data;
        setPayouts(fetchedPayouts);
        setHasMore(pagination.currentPage < pagination.totalPages);

        const paymentMethodsResponse = await axios.get(`${apiUrl}/payment-methods`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 50 },
        });
        // console.log('paymentMethodsResponse :>> ', paymentMethodsResponse);

        const fetchedMethods = paymentMethodsResponse.data.paymentMethods || [];
        const formattedMethods = fetchedMethods.map((method: any) => ({
          _id: method.id,
          label:
            method.method_type === 'credit_card' && method.last4 && method.brand
              ? `${method.brand.toUpperCase()} ****${method.last4}`
              : method.method_type.replace('_', ' ').toUpperCase(),
          method_type: method.method_type,
          last4: method.last4,
          brand: method.brand,
        }));
        setPaymentMethods(formattedMethods);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchMorePayouts = async () => {
    try {
      const token = localStorage.getItem('affiliateToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const nextPage = page + 1;
      const response = await axios.get(`${apiUrl}/affiliate/payouts`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: nextPage, limit: 20 },
      });

      const { payouts: newPayouts, pagination } = response.data;
      setPayouts((prev) => [...prev, ...newPayouts]);
      setPage(nextPage);
      setHasMore(pagination.currentPage < pagination.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more payouts');
    }
  };

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestLoading(true);
    setShowSuccess(false);
    setShowError(false);

    try {
      const token = localStorage.getItem('affiliateToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      if (Number(formData.amount) <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      const response = await axios.post(
        `${apiUrl}/affiliate/payouts/request`,
        {
          amount: Number(formData.amount),
          currency: formData.currency,
          paymentMethodId: formData.paymentMethodId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newPayout: Payout = {
        _id: response.data.payoutId,
        amount: response.data.amount,
        currency: formData.currency,
        status: response.data.status,
        paymentMethodId: formData.paymentMethodId,
        createdAt: response.data.requestedAt,
      };

      setPayouts([newPayout, ...payouts]);
      setFormData({ amount: '', currency: 'USD', paymentMethodId: '' });
      setShowSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || err.message || 'Failed to request payout');
      setShowError(true);
    } finally {
      setRequestLoading(false);
    }
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
                  value={formData.paymentMethodId}
                  onChange={(e) => setFormData({ ...formData, paymentMethodId: e.target.value })}
                  margin="normal"
                  required
                  disabled={paymentMethods.length === 0}
                >
                  {paymentMethods.length > 0 ? (
                    paymentMethods.map((method) => (
                      <MenuItem key={method._id} value={method._id}>
                        {method.label}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      No payment methods available
                    </MenuItem>
                  )}
                </TextField>

                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={requestLoading || paymentMethods.length === 0}
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

              <InfiniteScroll
                dataLength={payouts.length}
                next={fetchMorePayouts}
                hasMore={hasMore}
                loader={
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <CircularProgress size={24} color="primary" />
                  </Box>
                }
                endMessage={
                  <Typography variant="body2" color="#78909C" align="center" sx={{ py: 2 }}>
                    No more payouts to display
                  </Typography>
                }
              >
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
                            key={payout._id}
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
                                {paymentMethods.find((m) => m._id === payout.paymentMethodId)
                                  ?.label || 'Unknown'}
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
              </InfiniteScroll>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AffiliatePayoutsPage;
