import 'react-toastify/dist/ReactToastify.css';

import type { UserProps } from 'src/sections/user/types';

import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
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

import { TableNoData } from 'src/sections/user/table-no-data';
import { UserTableRow } from 'src/sections/user/user-table-row';
import { UserTableHead } from 'src/sections/user/user-table-head';
import { TableEmptyRows } from 'src/sections/user/table-empty-rows';
import { UserKYCReview } from 'src/sections/user/view/user-kyc-review';
import { UserTableToolbar } from 'src/sections/user/user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from 'src/sections/user/utils';

/**
 * PendingKYCView component for managing users with pending KYC verification.
 * Provides functionality to view, filter, and manage these users including KYC verification.
 */
export function PendingKYCView() {
  const table = useTable();
  const [users, setUsers] = useState<UserProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterName, setFilterName] = useState('');
  const [token] = useState(localStorage.getItem('accessToken') || '');
  const openKYCDialog = useBoolean();
  const openKYCReviewDialog = useBoolean();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedSumsubId, setSelectedSumsubId] = useState<string | null>(null);
  const [kycAction, setKycAction] = useState<'approved' | 'rejected' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const apiUrl = `${env.api.baseUrl}:${env.api.port}/api/sumsub/pending-kycs?page=${table.page + 1}&limit=${table.rowsPerPage}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.success) {
          setUsers(data.data.players);
          setTotalUsers(data.data.pagination.total);
        } else {
          setFetchError(data.message || 'Failed to fetch pending KYCs');
        }
      } catch (error) {
        console.error('Error fetching pending KYCs:', error);
        setFetchError('Error fetching pending KYCs');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [table.page, table.rowsPerPage]);

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
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
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
      const sumsubId = user.sumsub_id;

      const action = kycAction === 'approved' ? 'approve' : 'reject';
      const apiUrl = `${env.api.baseUrl}:${env.api.port}/api/sumsub/${action}/${sumsubId}`;

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
        setUsers((prevUsers) => prevUsers.filter((prevUser) => prevUser.id !== selectedUserId));
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

  const handleKYCStatusUpdateFromReview = (status: 'approved' | 'rejected', reason?: string) => {
    if (selectedUserId) {
      setKycAction(status);
      setRejectionReason(reason || '');
      setUsers((prevUsers) => prevUsers.filter((prevUser) => prevUser.id !== selectedUserId));
      openKYCDialog.onTrue();
      openKYCReviewDialog.onFalse();
    }
  };

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
    filterStatus: 'all',
    filterCurrency: 'all',
    filter2FA: 'all',
    filterSumsubStatus: 'all',
    adminStatus: 'all',
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
          Pending KYC Users
        </Typography>
      </Box>

      {fetchError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {fetchError}
        </Alert>
      )}

      <Card>
        <UserTableToolbar
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                onSort={table.onSort}
                headLabel={[
                  { id: 'username', label: 'Username' },
                  { id: 'email', label: 'Email' },
                  { id: 'phone_number', label: 'Phone Number' },
                  { id: 'sumsub_status', label: 'Sumsub Status' },
                  { id: 'sumsub_verification_date', label: 'Verification Date' },
                  { id: 'actions', label: 'Actions' },
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
                      selected={false}
                      onSelectRow={() => {}}
                      onUpdateStatus={updateUserStatus}
                      onDeleteUser={deleteUser}
                      onKYCStatusUpdate={handleKYCStatusUpdate}
                      onViewDocuments={viewDocuments}
                      token={token}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, users.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={totalUsers}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      <Dialog open={openKYCDialog.value} onClose={openKYCDialog.onFalse}>
        <DialogTitle>{kycAction === 'approved' ? 'Approve KYC' : 'Reject KYC'}</DialogTitle>
        <DialogContent>
          {kycAction === 'rejected' && (
            <TextField
              fullWidth
              label="Rejection Reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={openKYCDialog.onFalse}>Cancel</Button>
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
