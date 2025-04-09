import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Avatar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Iconify } from 'src/components/iconify'; 

// Styled components
const EarningsHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, #26A69A 0%, #4DB6AC 100%)`, // Teal gradient
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  color: theme.palette.common.white,
  marginBottom: theme.spacing(4),
  boxShadow: theme.shadows[8],
}));

const TotalCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#F9FAFB', // Light gray-blue
  color: theme.palette.text.primary,
  borderRadius: theme.shape.borderRadius * 2,
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(to right, #FF7043, #F06292)`, // Coral to pink gradient
  },
}));

const AffiliateEarningPage = () => {
  // Sample earnings data (replace with API data in production)
  const earningsData = [
    {
      id: 1,
      username: 'john_doe',
      email: 'john@example.com',
      earnings: 1500,
      date: '2025-04-01',
    },
    {
      id: 2,
      username: 'jane_smith',
      email: 'jane@example.com',
      earnings: 2000,
      date: '2025-04-02',
    },
    {
      id: 3,
      username: 'bob_jones',
      email: 'bob@example.com',
      earnings: 800,
      date: '2025-04-03',
    },
  ];

  // Calculate total earnings
  const totalEarnings = earningsData.reduce((sum, user) => sum + user.earnings, 0);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#E0F2F1', p: 4 }}>
      {' '}
      {/* Light teal background */}
      {/* Header */}
      <EarningsHeader>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: '#FF8A65', color: 'white', width: 48, height: 48 }}>
            {' '}
            {/* Coral avatar */}
            <Iconify icon="solar:wallet-bold" width={24} />
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              Earnings Details
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Detailed breakdown of your affiliate earnings
            </Typography>
          </Box>
        </Box>
      </EarningsHeader>
      {/* Earnings Table */}
      <TableContainer component={Paper} elevation={3} sx={{ bgcolor: '#F9FAFB' }}>
        {' '}
        {/* Light gray-blue */}
        <Table sx={{ minWidth: 650 }} aria-label="earnings table">
          <TableHead>
            <TableRow sx={{ bgcolor: '#E0F2F1' }}>
              {' '}
              {/* Light teal header */}
              <TableCell>
                <Typography variant="subtitle2" color="#26A69A">
                  {' '}
                  {/* Teal */}
                  User
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" color="#26A69A">
                  {' '}
                  {/* Teal */}
                  Email
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" color="#26A69A">
                  {' '}
                  {/* Teal */}
                  Earnings
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" color="#26A69A">
                  {' '}
                  {/* Teal */}
                  Date
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {earningsData.map((user) => (
              <TableRow
                key={user.id}
                sx={{
                  '&:hover': {
                    bgcolor: '#ECEFF1', // Slightly darker gray on hover
                    transition: 'background-color 0.2s',
                  },
                }}
              >
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#FF7043' }}>
                      {' '}
                      {/* Coral avatar */}
                      {user.username[0].toUpperCase()}
                    </Avatar>
                    <Typography variant="body2" color="#37474F">
                      {' '}
                      {/* Dark gray */}
                      {user.username}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="#37474F">
                    {' '}
                    {/* Dark gray */}
                    {user.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="#FF7043">
                    {' '}
                    {/* Coral */}₹{user.earnings.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="#78909C">
                    {' '}
                    {/* Muted gray */}
                    {user.date}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Total Earnings */}
      <Box mt={4}>
        <Divider
          sx={{
            my: 3,
            '&::before, &::after': { borderTopStyle: 'dashed', borderColor: '#B0BEC5' },
          }}
        />
        <TotalCard elevation={3}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={2}>
                <Iconify icon="solar:card-bold" width={32} color="#FF7043" /> {/* Coral icon */}
                <Typography variant="h6" color="#26A69A">
                  {' '}
                  {/* Teal */}
                  Total Earnings
                </Typography>
              </Box>
              <Typography variant="h4" color="#FF7043">
                {' '}
                {/* Coral */}₹{totalEarnings.toLocaleString()}
              </Typography>
            </Box>
          </CardContent>
        </TotalCard>
      </Box>
    </Box>
  );
};

export default AffiliateEarningPage;
