import React, { useState, useEffect } from 'react';
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
  TextField,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import axios from 'axios';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

const StatCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#F9FAFB',
  transition: 'transform 0.2s, box-shadow 0.2s',
  borderRadius: theme.shape.borderRadius * 2,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[6],
  },
}));

const DashboardHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, #26A69A 0%, #4DB6AC 100%)`,
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

interface DashboardData {
  clicks: number;
  signups: number;
  conversions: number;
  conversionRate: string;
  totalEarnings: number;
  pendingEarnings: number;
  currency: string;
  recentActivity: {
    type: string;
    message: string;
    created_at: string;
  }[];
}

const emptyDashboardData: DashboardData = {
  clicks: 0,
  signups: 0,
  conversions: 0,
  conversionRate: '0',
  totalEarnings: 0,
  pendingEarnings: 0,
  currency: 'USD',
  recentActivity: [],
};

export default function AffiliateDashboardPage() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData>(emptyDashboardData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);

  const fetchDashboardData = async (start?: dayjs.Dayjs, end?: dayjs.Dayjs) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('affiliateToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}:${
        import.meta.env.VITE_API_PORT
      }/api/auth/affiliate/dashboard`;

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          startDate: start ? start.toISOString() : undefined,
          endDate: end ? end.toISOString() : undefined,
        },
      });

      const data: DashboardData = response.data || emptyDashboardData;
      setDashboardData(data);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      let errorMessage = 'Failed to fetch dashboard data';

      if (err.response) {
        if (err.response.status === 401 || err.response.status === 403) {
          localStorage.removeItem('affiliateToken');
          router.push('/affiliate/login');
          errorMessage = 'Session expired. Please log in again.';
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setLoading(false);
      setDashboardData(emptyDashboardData);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApplyFilters = () => {
    fetchDashboardData(startDate || undefined, endDate || undefined);
  };

  const handleClearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    fetchDashboardData();
  };

  // Render loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress color="primary" />
        <Typography ml={2} variant="h6" color="textSecondary">
          Loading dashboard data...
        </Typography>
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Typography variant="h5" color="error" gutterBottom>
          Error: {error}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => fetchDashboardData()}
          startIcon={<Iconify icon="solar:refresh-bold" />}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#E0F2F1', p: 4 }}>
        {/* Header Section */}
        <DashboardHeader>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: '#FF8A65', color: 'white', width: 48, height: 48 }}>
                <Iconify icon="solar:user-bold" width={24} />
              </Avatar>
              <Box>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                  Welcome, Affiliate!
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Here's your affiliate dashboard overview
                </Typography>
              </Box>
            </Box>
            <ActionButton
              variant="contained"
              startIcon={<Iconify icon="solar:wallet-bold" />}
              onClick={() => router.push('/affiliate/payouts')}
              sx={{ bgcolor: '#FF7043', color: 'white', '&:hover': { bgcolor: '#F06292' } }}
            >
              Request Payout
            </ActionButton>
          </Box>
        </DashboardHeader>

        {/* Date Range Filter */}
        <Paper sx={{ p: 3, mb: 4, bgcolor: '#F9FAFB' }}>
          <Typography variant="h6" gutterBottom color="#26A69A">
            Filter by Date Range
          </Typography>
          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              slotProps={{ textField: { size: 'small' } }}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              slotProps={{ textField: { size: 'small' } }}
            />
            <ActionButton
              variant="contained"
              onClick={handleApplyFilters}
              sx={{ bgcolor: '#26A69A', color: 'white' }}
            >
              Apply
            </ActionButton>
            <ActionButton
              variant="outlined"
              onClick={handleClearFilters}
              sx={{ borderColor: '#FF7043', color: '#FF7043' }}
            >
              Clear
            </ActionButton>
          </Box>
        </Paper>

        {/* Stats Section */}
        <Grid container spacing={3}>
          {/* Clicks Card */}
          <Grid item xs={12} sm={6} md={4}>
            <StatCard elevation={3}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Iconify icon="solar:mouse-bold" width={32} color="#26A69A" />
                  <Box>
                    <Typography variant="h6" color="#78909C">
                      Clicks
                    </Typography>
                    <Typography variant="h4" color="#26A69A">
                      {dashboardData.clicks.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </StatCard>
          </Grid>

          {/* Signups Card */}
          <Grid item xs={12} sm={6} md={4}>
            <StatCard elevation={3}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Iconify icon="solar:users-group-rounded-bold" width={32} color="#26A69A" />
                  <Box>
                    <Typography variant="h6" color="#78909C">
                      Signups
                    </Typography>
                    <Typography variant="h4" color="#26A69A">
                      {dashboardData.signups.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </StatCard>
          </Grid>

          {/* Conversions Card */}
          <Grid item xs={12} sm={6} md={4}>
            <StatCard elevation={3}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Iconify icon="solar:check-circle-bold" width={32} color="#FF7043" />
                  <Box>
                    <Typography variant="h6" color="#78909C">
                      Conversions
                    </Typography>
                    <Typography variant="h4" color="#FF7043">
                      {dashboardData.conversions.toLocaleString()}
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
                  <Iconify icon="solar:card-bold" width={32} color="#FF7043" />
                  <Box>
                    <Typography variant="h6" color="#78909C">
                      Earnings
                    </Typography>
                    <Typography variant="h4" color="#FF7043">
                      {dashboardData.currency}{' '}
                      {dashboardData.totalEarnings.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </StatCard>
          </Grid>

          {/* Pending Earnings Card */}
          <Grid item xs={12} sm={6} md={4}>
            <StatCard elevation={3}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Iconify icon="solar:clock-circle-bold" width={32} color="#F06292" />
                  <Box>
                    <Typography variant="h6" color="#78909C">
                      Pending Earnings
                    </Typography>
                    <Typography variant="h4" color="#F06292">
                      {dashboardData.currency}{' '}
                      {dashboardData.pendingEarnings.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </StatCard>
          </Grid>

          {/* Conversion Rate */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, bgcolor: '#F9FAFB' }}>
              <Typography variant="h6" gutterBottom color="#26A69A">
                Conversion Rate
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <Box flexGrow={1}>
                  <LinearProgress
                    variant="determinate"
                    value={parseFloat(dashboardData.conversionRate || '0')}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: '#B0BEC5',
                      '& .MuiLinearProgress-bar': { bgcolor: '#26A69A' },
                    }}
                  />
                </Box>
                <Typography variant="h6" color="#26A69A">
                  {dashboardData.conversionRate}%
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, bgcolor: '#F9FAFB' }}>
              <Typography variant="h6" gutterBottom color="#26A69A">
                Recent Activity
              </Typography>
              <List>
                {dashboardData.recentActivity && dashboardData.recentActivity.length > 0 ? (
                  dashboardData.recentActivity.map((activity, index) => (
                    <ListItem key={index} divider>
                      <ListItemText
                        primary={activity.message}
                        secondary={new Date(activity.created_at).toLocaleString()}
                        primaryTypographyProps={{ color: '#26A69A' }}
                        secondaryTypographyProps={{ color: '#78909C' }}
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography color="#78909C">No recent activity</Typography>
                )}
              </List>
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
            Need help?{' '}
            <Link variant="body2" sx={{ cursor: 'pointer', color: '#FF7043' }}>
              Contact Support
            </Link>
          </Typography>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
