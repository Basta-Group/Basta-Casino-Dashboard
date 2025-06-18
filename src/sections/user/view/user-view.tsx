import 'react-toastify/dist/ReactToastify.css';

import { toast } from 'react-toastify';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { useTable } from 'src/hooks/use-table';
import { useBoolean } from 'src/hooks/use-boolean';

import { env } from 'src/config/env.config';
import { DashboardContent } from 'src/layouts/dashboard';

import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserKYCReview } from './user-kyc-review';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { UserProps } from '../types';

export function UserView() {
  const table = useTable();
  const [users, setUsers] = useState<UserProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCurrency, setFilterCurrency] = useState('all');
  const [filter2FA, setFilter2FA] = useState('all');
  const [filterSumsubStatus, setFilterSumsubStatus] = useState('all');
  const [filterAdminStatus, setFilterAdminStatus] = useState('all');
  const [token, setToken] = useState(localStorage.getItem('accessToken') || '');
  const openKYCDialog = useBoolean();
  const openKYCReviewDialog = useBoolean();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedSumsubId, setSelectedSumsubId] = useState<string | null>(null);
  const [kycAction, setKycAction] = useState<'approved' | 'rejected' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) {
        console.error('No access token found');
        setLoading(false);
        return;
      }

      try {
        const apiUrl = `${env.api.baseUrl}:${env.api.port}/api/auth/players`;
        const response = await fetch(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) {
          const nonAdminUsers = data.data.players.filter((user: UserProps) => user.role_id !== 1);
          setUsers(nonAdminUsers);
        } else {
          setFetchError(data.message || 'Failed to fetch users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setFetchError('Error fetching users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const updateUserStatus = async (userId: string, newStatus: number) => {
    try {
      const apiUrl = `${env.api.baseUrl}:${env.api.port}/api/auth/players/${userId}/status`;
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (data.success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === userId ? { ...user, status: newStatus } : user))
        );
        toast.success('User status updated successfully!');
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (statusError) {
      console.error('Error updating user status:', statusError);
      toast.error('Error updating user status');
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const apiUrl = `${env.api.baseUrl}:${env.api.port}/api/auth/players/${userId}`;
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        toast.success('User deleted successfully!');
      } else {
        toast.error(data.message || 'Failed to delete user');
      }
    } catch (deleteError) {
      console.error('Error deleting user:', deleteError);
      toast.error('Error deleting user');
    }
  };

  const handleKYCStatusUpdate = (userId: string, newStatus: 'approved' | 'rejected') => {
    setSelectedUserId(userId);
    setKycAction(newStatus);
    openKYCDialog.onTrue();
  };

  const confirmKYCStatus = async () => {
    if (!selectedUserId || !kycAction) return;

    try {
      const user = users.find((u) => u.id === selectedUserId);
      if (!user || !user.sumsub_id) {
        toast.error('Sumsub ID not found for this user');
        return;
      }

      const action = kycAction === 'approved' ? 'approve' : 'reject';
      const apiUrl = `${env.api.baseUrl}:${env.api.port}/api/sumsub/${action}/${selectedUserId}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(kycAction === 'rejected' ? { adminNotes: rejectionReason } : {}),
      });

      const data = await response.json();
      if (data.success) {
        setUsers((prevUsers) =>
          prevUsers.map((prevUser) =>
            prevUser.id === selectedUserId
              ? {
                  ...prevUser,
                  admin_status: kycAction,
                  admin_notes: kycAction === 'rejected' ? rejectionReason : 'Approved by admin',
                  is_verified: kycAction === 'approved' ? 1 : 0,
                }
              : prevUser
          )
        );
        toast.success(`KYC ${kycAction} successfully`);
      } else {
        toast.error(data.message || `Failed to ${kycAction} KYC`);
      }
    } catch (kycError) {
      console.error('Error confirming KYC status:', kycError);
      toast.error('Failed to update KYC status');
    } finally {
      openKYCDialog.onFalse();
      setRejectionReason('');
      setSelectedUserId(null);
      setKycAction(null);
    }
  };

  const viewDocuments = (sumsubId: string, userId: string) => {
    setSelectedSumsubId(sumsubId);
    setSelectedUserId(userId);
    openKYCReviewDialog.onTrue();
  };

  const handleKYCStatusUpdateFromReview = useCallback(
    (status: 'approved' | 'rejected', reason?: string) => {
      if (selectedUserId) {
        setKycAction(status);
        setRejectionReason(reason || '');
        openKYCDialog.onTrue();
        openKYCReviewDialog.onFalse();
      }
    },
    [selectedUserId, openKYCDialog, openKYCReviewDialog]
  );

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
    filterStatus,
    filterCurrency,
    filter2FA,
    filterSumsubStatus: filterSumsubStatus === 'all' ? 'all' : filterSumsubStatus,
    adminStatus: filterAdminStatus,
  });

  const notFound = !dataFiltered.length && !!filterName;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Players
        </Typography>
      </Box>

      {fetchError && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setFetchError(null)}>
          {fetchError}
        </Alert>
      )}

      <Card>
        <Stack direction="row" spacing={2} sx={{ p: 2 }}>
          <TextField
            select
            label="Status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            sx={{ width: 200 }}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="1">Active</MenuItem>
            <MenuItem value="0">Inactive</MenuItem>
          </TextField>

          <TextField
            select
            label="Sumsub Status"
            value={filterSumsubStatus}
            onChange={(e) => setFilterSumsubStatus(e.target.value)}
            sx={{ width: 200 }}
          >
            <MenuItem value="all">All Sumsub Status</MenuItem>
            <MenuItem value="not_started">Not Started</MenuItem>
            <MenuItem value="in_review">In Review</MenuItem>
            <MenuItem value="approved_sumsub">Approved (Sumsub)</MenuItem>
            <MenuItem value="rejected_sumsub">Rejected (Sumsub)</MenuItem>
            <MenuItem value="approved">Approved (Admin)</MenuItem>
            <MenuItem value="rejected">Rejected (Admin)</MenuItem>
          </TextField>

          <TextField
            select
            label="Admin Status"
            value={filterAdminStatus}
            onChange={(e) => setFilterAdminStatus(e.target.value)}
            sx={{ width: 200 }}
          >
            <MenuItem value="all">All Admin Status</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </TextField>

          <TextField
            select
            label="Currency"
            value={filterCurrency}
            onChange={(e) => setFilterCurrency(e.target.value)}
            sx={{ width: 200 }}
          >
            <MenuItem value="all">All Currencies</MenuItem>
            <MenuItem value="USD">USD</MenuItem>
            <MenuItem value="EUR">EUR</MenuItem>
            <MenuItem value="INR">INR</MenuItem>
          </TextField>

          <TextField
            select
            label="2FA Status"
            value={filter2FA}
            onChange={(e) => setFilter2FA(e.target.value)}
            sx={{ width: 200 }}
          >
            <MenuItem value="all">All 2FA Status</MenuItem>
            <MenuItem value="1">Enabled</MenuItem>
            <MenuItem value="0">Disabled</MenuItem>
          </TextField>
        </Stack>

        <UserTableToolbar
          filterName={filterName}
          onFilterName={(event) => setFilterName(event.target.value)}
        />

        <TableContainer sx={{ overflow: 'unset' }}>
          <Scrollbar>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                onSort={table.onSort}
                headLabel={[
                  { id: 'username', label: 'Username' },
                  { id: 'fullname', label: 'Full Name' },
                  { id: 'email', label: 'Email' },
                  { id: 'phone_number', label: 'Phone' },
                  { id: 'referredByName', label: 'Referred By' },
                  { id: 'sumsub_status', label: 'Sumsub Status' },
                  { id: 'admin_status', label: 'Final KYC Status' },
                  { id: 'is_verified', label: 'Email Verified' },
                  { id: 'status', label: 'Status' },
                  { id: 'action', label: 'Actions', align: 'right' },
                ]}
              />

              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onUpdateStatus={updateUserStatus}
                      onDeleteUser={deleteUser}
                      onKYCStatusUpdate={handleKYCStatusUpdate}
                      onViewDocuments={(sumsubId) => viewDocuments(sumsubId, row.id)}
                      token={token}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, users.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePagination
          page={table.page}
          component="div"
          count={dataFiltered.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      <Dialog open={openKYCDialog.value} onClose={openKYCDialog.onFalse}>
        <DialogTitle>Confirm KYC Status Change</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            You are about to change the KYC status to <strong>{kycAction}</strong> for user{' '}
            <strong>{users.find((u) => u.id === selectedUserId)?.username || 'Unknown'}</strong> (
            {users.find((u) => u.id === selectedUserId)?.fullname || 'No name provided'}).
          </Typography>
          {kycAction === 'rejected' && (
            <TextField
              fullWidth
              label="Reason for Rejection"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              multiline
              rows={4}
              margin="normal"
              placeholder="Please provide a detailed reason for rejection."
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={openKYCDialog.onFalse} color="inherit">
            Cancel
          </Button>
          <Button onClick={confirmKYCStatus} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {selectedSumsubId && selectedUserId && (
        <UserKYCReview
          open={openKYCReviewDialog.value}
          onClose={openKYCReviewDialog.onFalse}
          sumsubId={selectedSumsubId}
          userId={selectedUserId}
          sumsubStatus={users.find((u) => u.id === selectedUserId)?.sumsub_status || null}
          token={token}
          onStatusUpdate={handleKYCStatusUpdateFromReview}
          userData={users.find((u) => u.id === selectedUserId)}
        />
      )}
    </DashboardContent>
  );
}
