import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Label } from 'src/components/label';
import { UserProps } from './types';

interface UserDetailDialogProps {
  open: boolean;
  onClose: () => void;
  user: UserProps;
}

export function UserDetailDialog({ open, onClose, user }: UserDetailDialogProps) {
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatBalance = (balance: number, currency: number) => {
    const currencySymbol = {
      0: '$', // USD
      1: '₹', // INR
      2: '£', // Pound
    }[currency] || '$';

    return `${currencySymbol}${balance.toFixed(2)}`;
  };

  const getCurrencyLabel = (currency: number) => {
    switch (currency) {
      case 0: return 'USD';
      case 1: return 'INR';
      case 2: return 'Pound';
      default: return '-';
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>User Details</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <DetailItem label="Username" value={user.username} />
          <DetailItem label="Full Name" value={user.fullname} />
          <DetailItem label="Email" value={user.email} />
          <DetailItem label="Phone" value={user.phone_number} />
          
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
          
          <DetailItem label="Language" value={user.language || '-'} />
          <DetailItem label="Country" value={user.country || '-'} />
          <DetailItem label="City" value={user.city || '-'} />
          <DetailItem label="Registration Date" value={formatDate(user.created_at)} />
          <DetailItem label="Last Login" value={formatDate(user.last_login)} />
          {/* <DetailItem label="Created At" value={formatDate(user.created_at)} /> */}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}