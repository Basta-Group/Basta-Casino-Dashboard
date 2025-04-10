import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import { Label } from 'src/components/label';
import { env } from 'src/config/env.config';
import { DashboardContent } from 'src/layouts/dashboard';
import { Box } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { UserProps } from './types';

export function UserDetailPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;

      try {
        const apiUrl = `${env.api.baseUrl}:${env.api.port}/api/auth/players/${userId}`;
        const response = await fetch(apiUrl, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        if (data.success) {
          setUser(data.data.player);
        } else {
          setError('User data not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, token]);

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatBalance = (balance: number, currency: number) => {
    const currencySymbol =
      {
        0: '$', // USD
        1: '₹', // INR
        2: '£', // Pound
      }[currency] || '$';
    return `${currencySymbol}${balance.toFixed(2)}`;
  };

  const getCurrencyLabel = (currency: number) => {
    switch (currency) {
      case 0:
        return 'USD';
      case 1:
        return 'INR';
      case 2:
        return 'Pound';
      default:
        return '-';
    }
  };

  const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <Grid item xs={12} sm={6}>
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Grid>
  );

  if (loading) {
    return (
      <DashboardContent>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  if (error || !user) {
    return (
      <DashboardContent>
        <Typography variant="h4" sx={{ mb: 5 }}>
          User Details
        </Typography>
        <Typography color="error">{error || 'User not found'}</Typography>
        <Button variant="contained" onClick={() => navigate('/user')} sx={{ mt: 2 }}>
          Back to Users
        </Button>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          User Details - {user.username}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/user')}
          startIcon={<Iconify icon="eva:arrow-back-fill" />}
        >
          Back to Users
        </Button>
      </Box>

      <Container>
        <Grid container spacing={3}>
          <DetailItem label="Username" value={user.username} />
          <DetailItem label="Full Name" value={user.fullname || '-'} />
          <DetailItem label="Email" value={user.email || '-'} />
          <DetailItem label="Phone" value={user.phone_number || '-'} />
          <DetailItem label="Affiliate" value={user.referredByName || 'N/A'} />
          <DetailItem
            label="Status"
            value={
              <Label color={user.status === 0 ? 'error' : 'success'}>
                {user.status === 1 ? 'Active' : 'Inactive'}
              </Label>
            }
          />
          <DetailItem
            label="Verification"
            value={
              <Label color={user.is_verified === 1 ? 'success' : 'error'}>
                {user.is_verified === 1 ? 'Verified' : 'Unverified'}
              </Label>
            }
          />
          <DetailItem
            label="2FA Status"
            value={
              <Label color={user.is_2fa === 1 ? 'success' : 'warning'}>
                {user.is_2fa === 1 ? 'Enabled' : 'Disabled'}
              </Label>
            }
          />
          <DetailItem label="Currency" value={getCurrencyLabel(user.currency)} />
          <DetailItem
            label="Balance"
            value={
              <Label color={user.balance > 0 ? 'success' : 'warning'}>
                {formatBalance(user.balance, user.currency)}
              </Label>
            }
          />
          <DetailItem
            label="Bonus Balance"
            value={
              <Label color={user.bonus_balance > 0 ? 'success' : 'warning'}>
                {formatBalance(user.bonus_balance, user.currency)}
              </Label>
            }
          />
          <DetailItem
            label="Total Deposits"
            value={formatBalance(user.total_deposits, user.currency)}
          />
          <DetailItem
            label="Total Withdrawals"
            value={formatBalance(user.total_withdrawals, user.currency)}
          />
          <DetailItem label="Language" value={user.language || '-'} />
          <DetailItem label="Country" value={user.country || '-'} />
          <DetailItem label="City" value={user.city || '-'} />
          <DetailItem label="Registration Date" value={formatDate(user.created_at)} />
          <DetailItem label="Last Login" value={formatDate(user.last_login)} />
          <DetailItem label="Last Deposit" value={formatDate(user.last_deposit_date)} />
          <DetailItem label="Last Withdrawal" value={formatDate(user.last_withdrawal_date)} />
        </Grid>
      </Container>
    </DashboardContent>
  );
}
