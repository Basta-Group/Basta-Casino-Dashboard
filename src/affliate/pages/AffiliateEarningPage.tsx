import React, { useEffect, useState } from 'react';
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
  background: `linear-gradient(135deg, #26A69A 0%, #4DB6AC 100%)`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  color: theme.palette.common.white,
  marginBottom: theme.spacing(4),
  boxShadow: theme.shadows[8],
}));

const TotalCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#F9FAFB',
  color: theme.palette.text.primary,
  borderRadius: theme.shape.borderRadius * 2,
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(to right, #FF7043, #F06292)`,
  },
}));

interface EarningData {
  phone_number: number;
  id: string;
  username: string;
  email: string;
  earnings: number;
  date: string;
}

interface EarningsResponse {
  success: boolean;
  message: string;
  data: {
    earnings: EarningData[];
    totalEarnings: number;
  };
  error?: string;
}

const AffiliateEarningPage = () => {
  const [earningsData, setEarningsData] = useState<EarningData[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEarnings = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('affiliateToken');
        if (!token) {
          throw new Error('No affiliate token found. Please log in.');
        }

        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}:${
          import.meta.env.VITE_API_PORT
        }/api/auth/affiliate/earnings`;
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data: EarningsResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to fetch earnings');
        }

        setEarningsData(data.data.earnings);
        setTotalEarnings(data.data.totalEarnings);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#E0F2F1',
          p: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6">Loading earnings...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#E0F2F1',
          p: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#E0F2F1', p: 4 }}>
      {/* Header */}
      <EarningsHeader>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: '#FF8A65', color: 'white', width: 48, height: 48 }}>
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
        <Table sx={{ minWidth: 650 }} aria-label="earnings table">
          <TableHead>
            <TableRow sx={{ bgcolor: '#E0F2F1' }}>
              <TableCell>
                <Typography variant="subtitle2" color="#26A69A">
                  User
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" color="#26A69A">
                  Email
                </Typography>
              </TableCell>  
              <TableCell>
                <Typography variant="subtitle2" color="#26A69A">
                  Phone Number
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" color="#26A69A">
                  Earnings
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" color="#26A69A">
                  Date
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {earningsData.length > 0 ? (
              earningsData.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{
                    '&:hover': {
                      bgcolor: '#ECEFF1',
                      transition: 'background-color 0.2s',
                    },
                  }}
                >
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#FF7043' }}>
                        {user.username[0].toUpperCase()}
                      </Avatar>
                      <Typography variant="body2" color="#37474F">
                        {user.username}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="#37474F">
                      {user.email}
                    </Typography>
                  </TableCell> 
                  <TableCell>
                    <Typography variant="body2" color="#37474F">
                      {user.phone_number}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="#FF7043">
                      ₹{user.earnings.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="#78909C">
                      {user.date}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body2" color="#78909C">
                    No earnings data available
                  </Typography>
                </TableCell>
              </TableRow>
            )}
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
                <Iconify icon="solar:card-bold" width={32} color="#FF7043" />
                <Typography variant="h6" color="#26A69A">
                  Total Earnings
                </Typography>
              </Box>
              <Typography variant="h4" color="#FF7043">
                ₹{totalEarnings.toLocaleString()}
              </Typography>
            </Box>
          </CardContent>
        </TotalCard>
      </Box>
    </Box>
  );
};

export default AffiliateEarningPage;
