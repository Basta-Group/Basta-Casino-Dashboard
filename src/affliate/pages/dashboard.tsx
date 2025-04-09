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
  backgroundColor: '#F9FAFB', // Light gray-blue
  transition: 'transform 0.2s, box-shadow 0.2s',
  borderRadius: theme.shape.borderRadius * 2,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[6],
  },
}));

const DashboardHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, #26A69A 0%, #4DB6AC 100%)`, // Teal gradient
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  color: theme.palette.common.white,
  marginBottom: theme.spacing(4),
  boxShadow: theme.shadows[8],
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1, 3),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[4],
  },
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
    <Box sx={{ minHeight: '100vh', bgcolor: '#E0F2F1', p: 4 }}>
      {' '}
      {/* Light teal background */}
      {/* Header Section */}
      <DashboardHeader>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: '#FF8A65', color: 'white', width: 48, height: 48 }}>
              {' '}
              {/* Coral avatar */}
              <Iconify icon="solar:user-bold" width={24} />
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                Welcome, Affiliate!
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Here&apos;s your affiliate dashboard overview
              </Typography>
            </Box>
          </Box>
          <ActionButton
            variant="contained"
            startIcon={<Iconify icon="solar:wallet-bold" />}
            onClick={() => router.push('/affiliate/payouts')}
            sx={{ bgcolor: '#FF7043', color: 'white', '&:hover': { bgcolor: '#F06292' } }} // Coral button
          >
            Request Payout
          </ActionButton>
        </Box>
      </DashboardHeader>
      {/* Stats Section */}
      <Grid container spacing={3}>
        {/* Referrals Card */}
        <Grid item xs={12} sm={6} md={4}>
          <StatCard elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Iconify icon="solar:users-group-rounded-bold" width={32} color="#26A69A" />{' '}
                {/* Teal icon */}
                <Box>
                  <Typography variant="h6" color="#78909C">
                    {' '}
                    {/* Muted gray */}
                    Referrals
                  </Typography>
                  <Typography variant="h4" color="#26A69A">
                    {' '}
                    {/* Teal */}
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
                <Iconify icon="solar:card-bold" width={32} color="#FF7043" /> {/* Coral icon */}
                <Box>
                  <Typography variant="h6" color="#78909C">
                    {' '}
                    {/* Muted gray */}
                    Earnings
                  </Typography>
                  <Typography variant="h4" color="#FF7043">
                    {' '}
                    {/* Coral */}₹{stats.earnings.toLocaleString()}
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
                <Iconify icon="solar:clock-circle-bold" width={32} color="#F06292" />{' '}
                {/* Pink icon */}
                <Box>
                  <Typography variant="h6" color="#78909C">
                    {' '}
                    {/* Muted gray */}
                    Pending Payouts
                  </Typography>
                  <Typography variant="h4" color="#F06292">
                    {' '}
                    {/* Pink */}₹{stats.pendingPayouts.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </StatCard>
        </Grid>

        {/* Conversion Rate */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, bgcolor: '#F9FAFB' }}>
            {' '}
            {/* Light gray-blue */}
            <Typography variant="h6" gutterBottom color="#26A69A">
              {' '}
              {/* Teal */}
              Conversion Rate
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Box flexGrow={1}>
                <LinearProgress
                  variant="determinate"
                  value={stats.conversionRate}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    bgcolor: '#B0BEC5', // Light gray
                    '& .MuiLinearProgress-bar': { bgcolor: '#26A69A' }, // Teal bar
                  }}
                />
              </Box>
              <Typography variant="h6" color="#26A69A">
                {' '}
                {/* Teal */}
                {stats.conversionRate}%
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      {/* Additional Actions */}
      <Box mt={4} textAlign="center">
        <Divider
          sx={{
            my: 3,
            '&::before, &::after': { borderTopStyle: 'dashed', borderColor: '#B0BEC5' },
          }}
        />
        <Typography variant="body2" color="#78909C">
          {' '}
          {/* Muted gray */}
          Need help?{' '}
          <Link variant="body2" sx={{ cursor: 'pointer', color: '#FF7043' }}>
            {' '}
            {/* Coral link */}
            Contact Support
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
