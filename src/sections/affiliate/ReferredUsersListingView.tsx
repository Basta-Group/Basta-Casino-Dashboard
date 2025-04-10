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
  background: `#f0f0f0`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  color: theme.palette.common.white,
  marginBottom: theme.spacing(4),
  boxShadow: theme.shadows[8],
}));

const ReferredUsersListingView = () => {
  // Sample user data based on the image
  const userData = [
    {
      id: 1,
      username: 'QUser',
      fullName: 'QA',
      email: 'qa@yopmail.com',
      phoneNumber: '-',
      referredBy: 'N/A',
      verified: 'Unverified',
      status: 'Active',
    },
    {
      id: 2,
      username: 'QUser1',
      fullName: 'QA1',
      email: 'qa1@yopmail.com',
      phoneNumber: '-',
      referredBy: 'N/A',
      verified: 'Unverified',
      status: 'Active',
    },
    {
      id: 3,
      username: 'QUser2',
      fullName: 'QA1',
      email: 'qa2@yopmail.com',
      phoneNumber: '-',
      referredBy: 'N/A',
      verified: 'Unverified',
      status: 'Active',
    },
    {
      id: 4,
      username: 'QUser3',
      fullName: 'QA3',
      email: '-',
      phoneNumber: '-',
      referredBy: 'N/A',
      verified: 'Verified',
      status: 'Active',
    },
    {
      id: 5,
      username: 'QUser4',
      fullName: 'QA4',
      email: 'qa4@yopmail.com',
      phoneNumber: '-',
      referredBy: 'N/A',
      verified: 'Unverified',
      status: 'Active',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f0f0f0', p: 4 }}>
      {/* Header */}
      <EarningsHeader>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: '#FF8A65', color: 'white', width: 48, height: 48 }}>
            <Iconify icon="solar:user-bold" width={24} />
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#000' }}>
              Referred Users Listing
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, color: '#000' }}>
              Detailed breakdown of referred users
            </Typography>
          </Box>
        </Box>
      </EarningsHeader>
      {/* Users Table */}
      <TableContainer component={Paper} elevation={3} sx={{ bgcolor: '#F9FAFB' }}>
        <Table sx={{ minWidth: 650 }} aria-label="referred users table">
          <TableHead>
            <TableRow sx={{ bgcolor: '#E0F2F1' }}>
              <TableCell>
                <Typography variant="subtitle2" color="#26A69A">
                  Username
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" color="#26A69A">
                  Full Name
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
                  Referred By
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" color="#26A69A">
                  Verified
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" color="#26A69A">
                  Status
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" color="#26A69A">
                  Actions
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userData.map((user) => (
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
                      {user.username[0].toUpperCase()}
                    </Avatar>
                    <Typography variant="body2" color="#37474F">
                      {user.username}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="#37474F">
                    {user.fullName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="#37474F">
                    {user.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="#78909C">
                    {user.phoneNumber}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="#78909C">
                    {user.referredBy}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    color={user.verified === 'Verified' ? '#43A047' : '#D32F2F'}
                  >
                    {user.verified}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="#43A047">
                    {user.status}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="#78909C">
                    {/* Placeholder for actions (e.g., dots menu) */}
                    ...
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ReferredUsersListingView;
