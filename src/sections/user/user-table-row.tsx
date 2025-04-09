import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import {UserProps} from './types'
import { UserDetailDialog } from './user-detail-dialog';


type UserTableRowProps = {
  row: UserProps;
  selected: boolean;
  onSelectRow: () => void;
  onUpdateStatus: (userId: string, newStatus: number) => void;
  onDeleteUser: (userId: string) => void;
};

export function UserTableRow({ row, selected, onSelectRow, onUpdateStatus, onDeleteUser }: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleOpenDialog = useCallback(() => {
    handleClosePopover();
    setOpenDialog(true);
  }, [handleClosePopover]);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const handleStatusChange = useCallback(() => {
    const newStatus = row.status === 1 ? 0 : 1;
    onUpdateStatus(row.id, newStatus);
    handleClosePopover();
  }, [row.status, row.id, onUpdateStatus, handleClosePopover]);

  const handleDeleteUser = useCallback(() => {
    onDeleteUser(row.id);
    handleClosePopover();
  }, [row.id, onDeleteUser, handleClosePopover]);

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            <Avatar alt={row.username} src={row.photo} />
            {row.username || '-'}
          </Box>
        </TableCell>

        <TableCell>{row.fullname || '-'}</TableCell>
        <TableCell>{row.email || '-'}</TableCell>
        <TableCell>{row.phone_number || '-'}</TableCell>

        <TableCell>{row.referredByName || 'N/A'}</TableCell>

        <TableCell align="center">
          <Label color={row.is_verified === 1 ? 'success' : 'error'}>
            {row.is_verified === 1 ? 'Verified' : 'Unverified'}
          </Label>
        </TableCell>

        <TableCell>
          <Label color={row.status === 0 ? 'error' : 'success'}>
            {row.status === 1 ? 'Active' : 'Inactive'}
          </Label>
        </TableCell>

        <TableCell>
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 160,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={handleOpenDialog}>
            <Iconify icon="solar:eye-bold" />
            View Details
          </MenuItem>

          <MenuItem onClick={handleStatusChange}>
            <Iconify icon="solar:user-block-bold" />
            {row.status === 1 ? 'Deactivate' : 'Activate'}
          </MenuItem>

          <MenuItem onClick={handleDeleteUser} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>

      <UserDetailDialog 
        open={openDialog}
        onClose={handleCloseDialog}
        user={row}
      />
    </>
  );
}