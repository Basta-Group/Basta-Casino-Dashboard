import { useParams } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';

import { styled } from '@mui/material/styles';
import {
  Box,
  Table,
  Paper,
  Stack,
  Avatar,
  TableRow,
  Checkbox,
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';

import { env } from 'src/config/env.config';

import { Iconify } from 'src/components/iconify';

import type { ReferredUser } from './types';

// Styled components
const EarningsHeader = styled(Box)(({ theme }) => ({
  background: `#f0f0f0`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  color: theme.palette.common.white,
  marginBottom: theme.spacing(4),
  boxShadow: theme.shadows[8],
}));

interface Props {
  userId: string | undefined;
}

const ReferredUsersListingView: React.FC<Props> = ({ userId }) => {
  const { id } = useParams();
  const [token, setToken] = useState(localStorage.getItem('accessToken'));
  const [referredPlayers, setReferredPlayers] = useState<ReferredUser[]>([]);
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterVerified, setFilterVerified] = useState('all');
  const table = useTable();

  // Filter function
  const applyFilter = ({
    inputData,
    nameFilter,
    statusFilter,
    verifiedFilter,
  }: {
    inputData: ReferredUser[];
    nameFilter: string;
    statusFilter: string;
    verifiedFilter: string;
  }) =>
    inputData.filter((user) => {
      const matchesName =
        user.username?.toLowerCase().includes(nameFilter.toLowerCase()) ||
        user.fullname?.toLowerCase().includes(nameFilter.toLowerCase()) ||
        user.email?.toLowerCase().includes(nameFilter.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && user.status === 1) ||
        (statusFilter === 'inactive' && user.status === 0);

      const matchesVerified =
        verifiedFilter === 'all' ||
        (verifiedFilter === 'verified' && user.is_verified) ||
        (verifiedFilter === 'unverified' && !user.is_verified);

      return matchesName && matchesStatus && matchesVerified;
    });

  // Apply filters to data
  const dataFiltered = applyFilter({
    inputData: referredPlayers,
    nameFilter: filterName,
    statusFilter: filterStatus,
    verifiedFilter: filterVerified,
  });

  // Get paginated data
  const paginatedUsers = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const selectedAll = table.selected.length === paginatedUsers.length && paginatedUsers.length > 0;
  const someSelected = table.selected.length > 0 && !selectedAll;
  const allIdsOnPage = paginatedUsers.map((user) => user._id);

  useEffect(() => {
    const fetchReferredPlayers = async () => {
      try {
        const apiUrl = `${env.api.baseUrl}:${env.api.port}/api/auth/affiliate-users/${userId}`;

        const res = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.success && data.data?.referredPlayers) {
          setReferredPlayers(data.data.referredPlayers);
        }
      } catch (error) {
        console.error('Error fetching referred players:', error);
      }
    };

    if (userId) fetchReferredPlayers();
  }, [token, userId]);

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

      {/* Filters */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <TextField
          label="Search"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          sx={{ width: 200 }}
        />
        <TextField
          select
          label="Status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          sx={{ width: 200 }}
        >
          <MenuItem value="all">All Status</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </TextField>
        <TextField
          select
          label="Verification"
          value={filterVerified}
          onChange={(e) => setFilterVerified(e.target.value)}
          sx={{ width: 200 }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="verified">Verified</MenuItem>
          <MenuItem value="unverified">Unverified</MenuItem>
        </TextField>
      </Stack>

      {/* Users Table */}
      <TableContainer component={Paper} elevation={3} sx={{ bgcolor: '#F9FAFB' }}>
        <Table sx={{ minWidth: 650 }} aria-label="referred users table">
          <TableHead>
            <TableRow sx={{ bgcolor: '#E0F2F1' }}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={someSelected}
                  onChange={(e) => table.onSelectAll(e.target.checked, allIdsOnPage)}
                />
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2">Username</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2">Full Name</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2">Email</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2">Phone Number</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2">Referred By</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2">Verified</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2">Status</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => {
              const isSelected = table.selected.includes(user._id);

              return (
                <TableRow
                  key={user._id}
                  selected={isSelected}
                  sx={{
                    '&:hover': {
                      bgcolor: '#ECEFF1',
                      transition: 'background-color 0.2s',
                    },
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox checked={isSelected} onChange={() => table.onSelectRow(user._id)} />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#FF7043' }}>
                        {user.username?.[0]?.toUpperCase() || '-'}
                      </Avatar>
                      <Typography variant="body2" color="#37474F">
                        {user.username || '-'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{user.fullname || '-'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{user.email || '-'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{user.phone_number || '-'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{user.referredByName || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color={user.is_verified ? 'success' : 'error'}>
                      {user.is_verified ? 'Verified' : 'Unverified'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color={user.status === 0 ? 'error' : 'success'}>
                      {user.status === 1 ? 'Active' : 'Inactive'}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {dataFiltered.length > 0 && (
        <TablePagination
          component="div"
          page={table.page}
          count={dataFiltered.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      )}
    </Box>
  );
};

function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('username');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onChangePage = useCallback((_: any, newPage: number) => setPage(newPage), []);
  const onChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const onSelectAll = useCallback((checked: boolean, allIds: string[]) => {
    setSelected(checked ? allIds : []);
  }, []);

  const onSelectRow = useCallback((id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }, []);

  return {
    page,
    order,
    orderBy,
    selected,
    rowsPerPage,
    onSort,
    onChangePage,
    onChangeRowsPerPage,
    onSelectAll,
    onSelectRow,
  };
}

export default ReferredUsersListingView;
