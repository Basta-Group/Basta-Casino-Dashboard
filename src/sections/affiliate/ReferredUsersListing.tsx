import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Label } from 'src/components/label';
import { DashboardContent } from 'src/layouts/dashboard';
import { Box } from '@mui/material';
import { Iconify } from 'src/components/iconify';

export function ReferredUsersListing() {
  const navigate = useNavigate();

  const user = {
    username: 'johndoe',
    fullname: 'John Doe',
    email: 'john@example.com',
    phone_number: '+1234567890',
    referredByName: 'janedoe',
    status: 1,
    is_verified: 1,
    is_2fa: 0,
    currency: 1,
    balance: 1500.75,
    bonus_balance: 300.5,
    total_deposits: 5000.0,
    total_withdrawals: 2000.0,
    language: 'English',
    country: 'India',
    city: 'Mumbai',
    created_at: new Date(),
    last_login: new Date(),
    last_deposit_date: new Date(),
    last_withdrawal_date: new Date(),
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatBalance = (balance: number, currency: number) => {
    const currencySymbol = { 0: '$', 1: '₹', 2: '£' }[currency] || '$';
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

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Referred User table - {user.username}
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
          <DetailItem label="Full Name" value={user.fullname} />
          <DetailItem label="Email" value={user.email} />
          <DetailItem label="Phone" value={user.phone_number} />
          <DetailItem label="Referred By" value={user.referredByName} />
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
          <DetailItem label="Language" value={user.language} />
          <DetailItem label="Country" value={user.country} />
          <DetailItem label="City" value={user.city} />
          <DetailItem label="Registration Date" value={formatDate(user.created_at)} />
          <DetailItem label="Last Login" value={formatDate(user.last_login)} />
          <DetailItem label="Last Deposit" value={formatDate(user.last_deposit_date)} />
          <DetailItem label="Last Withdrawal" value={formatDate(user.last_withdrawal_date)} />
        </Grid>
      </Container>
    </DashboardContent>
  );
}
