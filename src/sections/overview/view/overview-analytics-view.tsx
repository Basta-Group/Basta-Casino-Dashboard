import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { DashboardContent } from 'src/layouts/dashboard';

import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';
import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site';
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';

export function GamingAnalyticsView() {
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
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-money.svg" />}
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
            total={1352831}
            color="secondary"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Game Sessions"
            percent={2.8}
            total={1723315}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-game.svg" />}
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
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-transaction.svg" />}
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
              series: [
                { label: 'USD Players', value: 3500 },
                { label: 'INR Players', value: 2500 },
                { label: 'GBP Players', value: 1500 },
              ],
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