// src/affiliate/pages/dashboard.tsx
import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Divider,
  Button,
  Avatar,
  LinearProgress,
  Link,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'src/routes/hooks'; // Assuming you have this hook
import { Iconify } from 'src/components/iconify'; // Assuming you have this component

// Styled components for custom styling
const StatCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[6],
  },
}));

const DashboardHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  color: theme.palette.common.white,
  marginBottom: theme.spacing(4),
}));

export default function AffiliateDashboardPage() {
  const router = useRouter();

  // Sample data (replace with real data from API)
  const stats = {
    referrals: 12,
    earnings: 2500,
    pendingPayouts: 800,
    conversionRate: 65, // Percentage for progress bar
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100', p: 4 }}>
      {/* Header Section */}
      <DashboardHeader>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: 'white', color: 'primary.main', width: 48, height: 48 }}>
              <Iconify icon="solar:user-bold" width={24} />
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1">
                Welcome, Affiliate!
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Here&apos;s your affiliate dashboard overview
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Iconify icon="solar:wallet-bold" />}
            onClick={() => router.push('/affiliate/payouts')}
            sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
          >
            Request Payout
          </Button>
        </Box>
      </DashboardHeader>

      {/* Stats Section */}
      <Grid container spacing={3}>
        {/* Referrals Card */}
        <Grid item xs={12} sm={6} md={4}>
          <StatCard elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Iconify icon="solar:users-group-rounded-bold" width={32} color="primary.main" />
                <Box>
                  <Typography variant="h6" color="text.secondary">
                    Referrals
                  </Typography>
                  <Typography variant="h4" color="primary.main">
                    {stats.referrals}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </StatCard>
        </Grid>

        {/* Earnings Card */}
        <Grid item xs={12} sm={6} md={4}>
          <StatCard elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Iconify icon="solar:card-bold" width={32} color="success.main" />
                <Box>
                  <Typography variant="h6" color="text.secondary">
                    Earnings
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    ₹{stats.earnings.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </StatCard>
        </Grid>

        {/* Pending Payouts Card */}
        <Grid item xs={12} sm={6} md={4}>
          <StatCard elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Iconify icon="solar:clock-circle-bold" width={32} color="warning.main" />
                <Box>
                  <Typography variant="h6" color="text.secondary">
                    Pending Payouts
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    ₹{stats.pendingPayouts.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </StatCard>
        </Grid>

        {/* Conversion Rate */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Conversion Rate
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Box flexGrow={1}>
                <LinearProgress
                  variant="determinate"
                  value={stats.conversionRate}
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>
              <Typography variant="h6" color="primary.main">
                {stats.conversionRate}%
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Additional Actions */}
      <Box mt={4} textAlign="center">
        <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }} />
        <Typography variant="body2" color="text.secondary">
          Need help?{' '}
          <Link variant="body2" sx={{ cursor: 'pointer' }}>
            Contact Support
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
