import axios from 'axios';
import React, { useState, useEffect } from 'react';

import { styled } from '@mui/material/styles';
import {
  Box,
  Card,
  Table,
  Paper,
  Alert,
  Avatar,
  Button,
  Dialog,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Typography,
  Pagination,
  CardContent,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  CircularProgress,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

// Styled components
const PayoutsHeader = styled(Box)(({ theme }) => ({
  background: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(4),
  boxShadow: theme.shadows[1],
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
      ? 'rgba(0, 200, 83, 0.1)'
      : status === 'pending'
        ? 'rgba(255, 171, 0, 0.1)'
        : status === 'approved'
          ? 'rgba(0, 150, 136, 0.1)'
          : 'rgba(255, 82, 82, 0.1)',
  color:
    status === 'paid'
      ? '#00C853'
      : status === 'pending'
        ? '#FFAB00'
        : status === 'approved'
          ? '#009688'
          : '#FF5252',
}));

interface PayoutRequest {
  payoutId: string;
  affiliate: {
    id: string;
    email: string;
    name: string;
  };
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  paymentMethodId?: string;
  requestedAt: string;
  adminNotes?: string;
  transactionId?: string;
}

const AdminPayoutPageView = () => {
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<PayoutRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [processingAction, setProcessingAction] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchPayoutRequests = async (pageNum: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}:${
        import.meta.env.VITE_API_PORT
      }/api/auth/admin/affiliate/payouts?page=${pageNum}&limit=20`;

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { payouts, pagination } = response.data;
      setPayoutRequests(payouts);
      setTotalPages(pagination.totalPages);
      setPage(pagination.page);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayoutRequests();
  }, []);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    fetchPayoutRequests(value);
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

  const handleActionClick = (request: PayoutRequest) => {
    setSelectedRequest(request);
    setAdminNotes(request.adminNotes || '');
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRequest(null);
    setAdminNotes('');
  };

  const handleProcessRequest = async (action: 'approved' | 'rejected' | 'paid') => {
    if (!selectedRequest) return;

    setProcessingAction(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}:${
        import.meta.env.VITE_API_PORT
      }/api/auth/admin/affiliate/payouts/${selectedRequest.payoutId}`;

      await axios.patch(
        apiUrl,
        { status: action, adminNotes },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage(`Payout request ${action} successfully`);
      setShowSuccess(true);
      handleCloseDialog();
      fetchPayoutRequests(page); // Refresh the list

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to process request');
    } finally {
      setProcessingAction(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          p: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 4 }}>
      {/* Header */}
      <PayoutsHeader>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            sx={{ bgcolor: 'text.primary', color: 'background.paper', width: 48, height: 48 }}
          >
            <Iconify icon="solar:wallet-money-bold" width={24} />
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              Affiliate Payout Requests
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Manage and process affiliate payout requests
            </Typography>
          </Box>
        </Box>
      </PayoutsHeader>

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      <Card
        elevation={0}
        sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={3}>
            <Iconify icon="solar:clock-circle-bold" width={24} />
            <Typography variant="h6">Payout Requests</Typography>
          </Box>

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ border: '1px solid', borderColor: 'divider' }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'background.paper' }}>
                  <TableCell>
                    <Typography variant="subtitle2">Date</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">Affiliate</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">Amount</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">Method</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">Transaction ID</Typography>{' '}
                    {/* Add this column */}
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">Status</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">Actions</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payoutRequests.length > 0 ? (
                  payoutRequests.map((request) => (
                    <TableRow
                      key={request.payoutId}
                      sx={{
                        '&:hover': {
                          bgcolor: 'action.hover',
                          transition: 'background-color 0.2s',
                        },
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2">{formatDate(request.requestedAt)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{request.affiliate.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {request.affiliate.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {formatCurrency(request.amount, request.currency)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {request.paymentMethodId || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {request.transactionId || 'N/A'} {/* Display the transactionId */}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={request.status}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        {request.status === 'pending' && (
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              onClick={() => handleActionClick(request)}
                              startIcon={<Iconify icon="solar:check-circle-bold" width={16} />}
                            >
                              Approve
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              onClick={() => handleActionClick(request)}
                              startIcon={<Iconify icon="solar:close-circle-bold" width={16} />}
                            >
                              Reject
                            </Button>
                          </Box>
                        )}
                        {request.status === 'approved' && (
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            onClick={() => handleActionClick(request)}
                            startIcon={<Iconify icon="solar:wallet-money-bold" width={16} />}
                          >
                            Mark as Paid
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      {' '}
                      {/* Update colSpan to 7 to account for the new column */}
                      <Typography variant="body2" color="text.secondary">
                        No payout requests available
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {payoutRequests.length > 0 && (
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

      {/* Action Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Process Payout Request
          {selectedRequest && (
            <Typography variant="subtitle2" color="text.secondary">
              {selectedRequest.affiliate.name} -{' '}
              {formatCurrency(selectedRequest.amount, selectedRequest.currency)}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Admin Notes"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            margin="normal"
            placeholder="Add any notes about this payout request..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={processingAction}>
            Cancel
          </Button>
          {selectedRequest?.status === 'pending' && (
            <>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleProcessRequest('rejected')}
                disabled={processingAction}
                startIcon={
                  processingAction ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <Iconify icon="solar:close-circle-bold" width={20} />
                  )
                }
              >
                Reject
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleProcessRequest('approved')}
                disabled={processingAction}
                startIcon={
                  processingAction ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <Iconify icon="solar:check-circle-bold" width={20} />
                  )
                }
              >
                Approve
              </Button>
            </>
          )}
          {selectedRequest?.status === 'approved' && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleProcessRequest('paid')}
              disabled={processingAction}
              startIcon={
                processingAction ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <Iconify icon="solar:wallet-money-bold" width={20} />
                )
              }
            >
              Mark as Paid
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPayoutPageView;
