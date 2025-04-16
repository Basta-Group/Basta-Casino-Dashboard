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
  Button,
  Pagination,
  Alert,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Iconify } from 'src/components/iconify';

// Styled components - updated for white and black theme
const PayoutsHeader = styled(Box)(({ theme }) => ({
  background: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(4),
  boxShadow: theme.shadows[1],
}));

const RequestCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${theme.palette.divider}`,
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: theme.palette.text.primary,
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
      ? 'rgba(0, 200, 83, 0.1)'
      : status === 'pending'
        ? 'rgba(255, 171, 0, 0.1)'
        : 'rgba(255, 82, 82, 0.1)',
  color: status === 'completed' ? '#00C853' : status === 'pending' ? '#FFAB00' : '#FF5252',
}));

interface PayoutRequest {
  id: string;
  affiliateId: string;
  affiliateName: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'rejected';
  paymentMethod: string;
  createdAt: string;
  notes?: string;
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

  useEffect(() => {
    const fetchPayoutRequests = async () => {
      setLoading(true);
      setError(null);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mock data
        const mockRequests: PayoutRequest[] = [
          {
            id: '1',
            affiliateId: 'AFF001',
            affiliateName: 'John Doe',
            amount: 1000,
            currency: 'USD',
            status: 'pending',
            paymentMethod: 'paypal',
            createdAt: '2024-04-15T10:30:00Z',
            notes: 'Requesting payout for March earnings',
          },
          {
            id: '2',
            affiliateId: 'AFF002',
            affiliateName: 'Jane Smith',
            amount: 500,
            currency: 'EUR',
            status: 'pending',
            paymentMethod: 'bank',
            createdAt: '2024-04-14T15:45:00Z',
            notes: 'Monthly payout request',
          },
          {
            id: '3',
            affiliateId: 'AFF003',
            affiliateName: 'Mike Johnson',
            amount: 750,
            currency: 'GBP',
            status: 'completed',
            paymentMethod: 'bank',
            createdAt: '2024-04-13T09:20:00Z',
            notes: 'Processed successfully',
          },
        ];

        setPayoutRequests(mockRequests);
        setTotalPages(1);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPayoutRequests();
  }, []);

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

  const handleActionClick = (request: PayoutRequest) => {
    setSelectedRequest(request);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRequest(null);
    setAdminNotes('');
  };

  const handleProcessRequest = async (action: 'completed' | 'rejected') => {
    if (!selectedRequest) return;

    setProcessingAction(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update the request status
      const updatedRequests = payoutRequests.map((request) =>
        request.id === selectedRequest.id
          ? {
              ...request,
              status: action,
              notes: adminNotes || request.notes,
            }
          : request
      );

      setPayoutRequests(updatedRequests);
      setSuccessMessage(`Payout request ${action} successfully`);
      setShowSuccess(true);
      handleCloseDialog();

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process request');
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
                      key={request.id}
                      sx={{
                        '&:hover': {
                          bgcolor: 'action.hover',
                          transition: 'background-color 0.2s',
                        },
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2">{formatDate(request.createdAt)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{request.affiliateName}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {request.affiliateId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {formatCurrency(request.amount, request.currency)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {request.paymentMethod.toUpperCase()}
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
                              Accept
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
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
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
              {selectedRequest.affiliateName} -{' '}
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
            onClick={() => handleProcessRequest('completed')}
            disabled={processingAction}
            startIcon={
              processingAction ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Iconify icon="solar:check-circle-bold" width={20} />
              )
            }
          >
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPayoutPageView;
