import { env } from 'src/config/env.config';
import { useState, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { DashboardContent } from 'src/layouts/dashboard';

import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../../user/table-no-data';
import { AffiliateTableRow } from '../affiliate-table-row';
import { AffiliateTableHead } from '../affiliate-table-head';
import { TableEmptyRows } from '../../user/table-empty-rows';
import { AffiliateTableToolbar } from '../affiliate-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

export interface AffiliateProps {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phonenumber: string;
  status: number;
  referralCode: string;
  country: string;
  marketingEmailsOptIn: boolean;
  hearAboutUs: string;
  createdAt: Date;
  promotionMethod: string[];
}

export function AdminAffiliateView() {
  const table = useTable();
  const [users, setUsers] = useState<AffiliateProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCurrency, setFilterCurrency] = useState('all');
  const [filter2FA, setFilter2FA] = useState('all');

  const [token, setToken] = useState(localStorage.getItem('accessToken'));

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const apiUrl = `${env.api.baseUrl}:${env.api.port}/api/auth/affiliate-users`;
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.data && Array.isArray(data.data.data)) {
        const transformedUsers: AffiliateProps[] = data.data.data.map((item: any) => ({
          id: item._id,
          firstname: item.firstname ?? '',
          lastname: item.lastname ?? '',
          email: item.email,
          phonenumber: item.phonenumber ?? '',
          referralCode: item.referralCode ?? '',
          status: item.status,
          country: item.country ?? '',
          marketingEmailsOptIn: item.marketingEmailsOptIn ?? false,
          hearAboutUs: item.hearAboutUs ?? '',
          createdAt: item.createdAt ?? '',
          promotionMethod: item.promotionMethod ?? [],
        }));

        setUsers(transformedUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUserStatus = async (userId: string, newStatus: number) => {
    try {
      const apiUrl = `${env.api.baseUrl}:${env.api.port}/api/auth/affiliate-users/status/${userId}?status=${newStatus}`;

      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Status updated successfully:', result);

      fetchUsers(); // will still work because it’s memoized
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      console.log('delete');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
    filterStatus,
    filterCurrency,
    filter2FA,
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
          Affiliate
        </Typography>
      </Box>

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
            <MenuItem value="2">Banned</MenuItem>
          </TextField>
        </Stack>
        <AffiliateTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <AffiliateTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={users.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    users.map((user) => user.id)
                  )
                }
                headLabel={[
                  { id: 'firstname', label: 'First Name' },
                  { id: 'lastname', label: 'Last Name' },
                  { id: 'revenue', label: 'Revenue' },
                  { id: 'email', label: 'Email' },
                  { id: 'phone_number', label: 'Phone Number' },
                  { id: 'referralCode', label: 'Referral Code' },
                  { id: 'status', label: 'Status' },
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
                    <AffiliateTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onUpdateStatus={updateUserStatus}
                      // onDeleteUser={deleteUser}
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
          count={users.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('firstname');
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

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    setSelected(checked ? newSelecteds : []);
  }, []);

  const onSelectRow = useCallback(
    (id: string) => {
      const selectedIndex = selected.indexOf(id);
      let newSelected: string[] = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        );
      }
      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  return {
    page,
    order,
    orderBy,
    selected,
    rowsPerPage,
    onSort,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
