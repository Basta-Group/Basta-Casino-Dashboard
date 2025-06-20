import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import type { AffiliateProps } from './types';

interface DetailItemProps {
  label: string;
  value: React.ReactNode;
}

/**
 * DetailItem component for displaying label-value pairs in a grid
 */
const DetailItem = ({ label, value }: DetailItemProps) => (
  <Grid item xs={12} sm={6}>
    <Typography variant="subtitle2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2">{value}</Typography>
  </Grid>
);

interface UserDetailDialogProps {
  open: boolean;
  onClose: () => void;
  user: AffiliateProps;
}

/**
 * AffiliateDialog component for displaying detailed affiliate information
 */
export function AffiliateDialog({ open, onClose, user }: UserDetailDialogProps) {
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Affiliate Details</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <DetailItem label="First Name" value={user.firstname} />
          <DetailItem label="Last Name" value={user.lastname} />
          <DetailItem label="Email" value={user.email} />
          <DetailItem label="Phone" value={user.phonenumber ? user.phonenumber : '-'} />
          <DetailItem
            label="Status"
            value={user.status === 1 ? 'Active' : user.status === 0 ? 'InActive' : 'Banned'}
          />

          <DetailItem label="Referral Code" value={user.referralCode} />
          <DetailItem label="Country" value={user.country} />
          <DetailItem
            label="Marketing Emails Opt-In"
            value={user.marketingEmailsOptIn ? 'True' : 'False'}
          />

          <DetailItem label="Hear About Us" value={user.hearAboutUs} />
          <DetailItem label="Created At" value={formatDate(user.createdAt)} />
          <DetailItem
            label="Promotion Method"
            value={user.promotionMethod.length ? user.promotionMethod.join(', ') : '-'}
          />
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
