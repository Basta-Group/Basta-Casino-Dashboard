import { DashboardContent } from 'src/layouts/dashboard';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import { Icon } from '@iconify/react';

import PlatformFeeConfig from '../sections/platform-fee/PlatformFeeConfig';
import FeeCalculator from '../sections/platform-fee/FeeCalculator';
import FeeTransactionHistory from '../sections/platform-fee/FeeTransactionHistory';

export default function PlatformFeePage() {
  return (
    <DashboardContent>
      <Box sx={{ mb: 4 }}>
        <h2 style={{ marginBottom: 8 }}>Platform Fee Management</h2>
        <p style={{ color: '#6b7280', margin: 0 }}>
          Configure platform fees, estimate deductions, and review all fee-related transactions in
          one place.
        </p>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3, p: 2 }}>
            <CardHeader
              avatar={<Icon icon="mdi:percent" width={28} height={28} />}
              title="Platform Fee Configuration"
              subheader="Manage the platform fee settings for all transactions."
              sx={{ pb: 0 }}
            />
            <Divider sx={{ my: 2 }} />
            <PlatformFeeConfig />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3, p: 2 }}>
            <CardHeader
              avatar={<Icon icon="mdi:calculator" width={28} height={28} />}
              title="Fee Calculator"
              subheader="Estimate the platform fee for any amount."
              sx={{ pb: 0 }}
            />
            <Divider sx={{ my: 2 }} />
            <FeeCalculator />
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ p: 2 }}>
            <CardHeader
              avatar={<Icon icon="mdi:history" width={28} height={28} />}
              title="Platform Fee Transaction History"
              subheader="See all recent platform fee deductions."
              sx={{ pb: 0 }}
            />
            <Divider sx={{ my: 2 }} />
            <FeeTransactionHistory />
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
