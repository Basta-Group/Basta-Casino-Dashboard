import { env } from 'src/config/env.config';
import { useState, useCallback, useEffect } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { DashboardContent } from 'src/layouts/dashboard';
import { Box, CircularProgress } from '@mui/material';
import { Icon } from '@iconify/react';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';
import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site';
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';

export interface UserProps {
  id: string;
  username: string;
  fullname: string;
  patronymic: string;
  photo: string;
  dob: Date;
  gender: string;
  email: string;
  phone_number: string;
  registration_date: Date;
  last_login: Date;
  status: number;
  is_verified: number;
  is_2fa: number;
  currency: number;
  language: string;
  country: string;
  city: string;
  role_id: number;
  created_at: Date;
  updated_at: Date;
  balance: number;
  bonus_balance: number;
  total_deposits: number;
  total_withdrawals: number;
  last_deposit_date: Date;
  last_withdrawal_date: Date;
}

export function GamingAnalyticsView() {
  const [token, setToken] = useState(localStorage.getItem('accessToken'));

  const [users, setUsers] = useState<UserProps[]>([]);
  const [activePlayersData, setActivePlayersData] = useState<number[]>([0]);
  const [activePlayersRegionData, setActivePlayersRegionData] = useState([]);
  const [loading, setLoading] = useState(true);

  const activePlayersCount = users.filter((user) => user.status === 1).length;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const apiUrl = `${env.api.baseUrl}:${env.api.port}/api/auth/players`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log('data', { data });
        if (data.success) {
          setUsers(data.data.players);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    /* fetch players  stats */
    const fetchPlayerStats = async () => {
      try {
        const apiUrl = `${env.api.baseUrl}:${env.api.port}/api/auth/players/statistics`;
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        console.log('data', { data });

        if (data.success) {
          const stats = data.data.activePlayersPerMonth;

          const seriesData = stats.map((item: any) => item.activePlayers);

          setActivePlayersData(seriesData);
        }
      } catch (error) {
        console.error('Error fetching player stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerStats();
    /* Fetch players region stats */
    const fetchPlayerRegionStats = async () => {
      try {
        const apiUrl = `${env.api.baseUrl}:${env.api.port}/api/auth/players/region/statistics`;
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        console.log('player region data', { data });

        if (data.success) {
          setActivePlayersRegionData(data.data);
        }
      } catch (error) {
        console.error('Error fetching player Region stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayerRegionStats();
  }, [token]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Gaming Dashboard Overview
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Total Revenue"
            percent={2.6}
            total={714000}
            icon={<Icon icon="mdi:currency-usd" style={{ fontSize: '48px' }} />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [22, 8, 35, 50, 82, 84, 77, 12],
            }}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Active Players"
            percent={-0.1}
            total={activePlayersCount}
            color="secondary"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
            chart={{
              categories: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
              ],

              series: activePlayersData || [],
            }}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Game Sessions"
            percent={2.8}
            total={1723315}
            color="warning"
            icon={<Icon icon="mdi:gamepad-variant" style={{ fontSize: '48px' }} />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [40, 70, 50, 28, 70, 75, 7, 64],
            }}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Transactions"
            percent={3.6}
            total={234}
            color="success"
            icon={<Icon icon="mdi:cash-multiple" style={{ fontSize: '48px' }} />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 30, 23, 54, 47, 40, 62, 73],
            }}
          />
        </Grid>
        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentVisits
            title="Players by Region"
            chart={{
              series: activePlayersRegionData,
              //  [
              //   { label: 'USD Players', value: 3500 },
              //   { label: 'INR Players', value: 2500 },
              //   { label: 'GBP Players', value: 1500 },
              // ],
            }}
          />
        </Grid>
        <Grid xs={12} md={6} lg={8}>
          <AnalyticsWebsiteVisits
            title="Gaming Activity"
            subheader="(+43%) than last month"
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
              series: [
                { name: 'Active Sessions', data: [43, 33, 22, 37, 67, 68, 37, 24, 55] },
                { name: 'Transactions', data: [51, 70, 47, 67, 40, 37, 24, 70, 24] },
              ],
            }}
          />
        </Grid>
        <Grid xs={12} md={6} lg={8}>
          <AnalyticsConversionRates
            title="Game Performance"
            subheader="Top performing games"
            chart={{
              categories: ['Poker', 'Slots', 'Roulette', 'Blackjack', 'Baccarat'],
              series: [
                { name: 'Sessions', data: [44, 55, 41, 64, 22] },
                { name: 'Revenue', data: [53, 32, 33, 52, 13] },
              ],
            }}
          />
        </Grid>
        <Grid xs={12} md={6} lg={4}>
          <AnalyticsTrafficBySite
            title="Payment Methods"
            list={[
              { value: 'credit', label: 'Credit Card', total: 323234 },
              { value: 'debit', label: 'Debit Card', total: 341212 },
              { value: 'wallet', label: 'E-Wallet', total: 411213 },
              { value: 'crypto', label: 'Crypto', total: 443232 },
            ]}
          />
        </Grid>
        <Grid xs={12} md={6} lg={4}>
          <AnalyticsOrderTimeline
            title="Recent Transactions"
            list={[
              { id: '1', title: 'Deposit', time: '2 hours ago', type: 'deposit' },
              { id: '2', title: 'Withdrawal', time: '4 hours ago', type: 'withdrawal' },
              { id: '3', title: 'Game Purchase', time: '6 hours ago', type: 'purchase' },
            ]}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
