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
import { AffiliateProps } from './types';

export function AffiliateDetailPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<AffiliateProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;

      try {
        const apiUrl = `${env.api.baseUrl}:${env.api.port}/api/auth/affiliate-users/${userId}`;
        const response = await fetch(apiUrl, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch affiliate data');
        }

        const data = await response.json();

        if (data.success) {
          setUser(data.data.affiliateUser);
        } else {
          setError('Affiliate data not found');
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
          Affilate Details
        </Typography>
        <Typography color="error">{error || 'Affiliate not found'}</Typography>
        <Button variant="contained" onClick={() => navigate('/affiliateListing')} sx={{ mt: 2 }}>
          Back to Affilates
        </Button>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Affilate Details -{user.firstname}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/affiliateListing')}
          startIcon={<Iconify icon="eva:arrow-back-fill" />}
        >
          Back to Affilates
        </Button>
      </Box>

      <Container>
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
          <DetailItem label="Total Earnings" value={user.totalEarnings ? user.totalEarnings : 0} />
          <DetailItem label="Paid Earnings" value={user.paidEarnings ? user.paidEarnings : 0} />
          <DetailItem
            label="Commission Rate"
            value={user.commissionRate ? user.commissionRate : 0}
          />
          <DetailItem
            label="Pending Earnings"
            value={user.pendingEarnings ? user.pendingEarnings : 0}
          />
          <DetailItem label="Total Clicks" value={user.totalClicks ? user.totalClicks : 0} />
          <DetailItem label="Total Signups" value={user.totalSignups ? user.totalSignups : 0} />
        </Grid>
      </Container>
    </DashboardContent>
  );
}
