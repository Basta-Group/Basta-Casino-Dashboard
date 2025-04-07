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
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { GamingAnalyticsView } from 'src/sections/overview/view/overview-analytics-view';

import { TableNoData } from '../../user/table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../../user/user-table-head';
import { TableEmptyRows } from '../../user/table-empty-rows';
import { UserTableToolbar } from '../../user/user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

export interface AffiliateProps {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phonenumber: string;
  status: string;
  referralCode: string;
}

export function AffiliateView() {
  const table = useTable();
  const [users, setUsers] = useState<AffiliateProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCurrency, setFilterCurrency] = useState('all');
  const [filter2FA, setFilter2FA] = useState('all');
  const [token, setToken] = useState(localStorage.getItem('accessToken'));

  useEffect(() => {
    const fetchUsers = async () => {
      try {
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
          }));

          setUsers(transformedUsers);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const updateUserStatus = async (userId: string, newStatus: number) => {
    try {
      console.log('update-status');
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
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
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
                    <UserTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onUpdateStatus={updateUserStatus}
                      onDeleteUser={deleteUser}
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
