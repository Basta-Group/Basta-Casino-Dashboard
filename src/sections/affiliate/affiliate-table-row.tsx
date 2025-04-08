import { useState, useCallback } from 'react';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { AffiliateProps } from './types';
import { AffiliateDialog } from './affiliate-detail-dialog';

type AffialiteTableRowProps = {
  row: AffiliateProps;
  selected: boolean;
  onSelectRow: () => void;
  onUpdateStatus: (userId: string, newStatus: string) => void;
  // onDeleteUser: (userId: string) => void;
};

export function UserTableRow({
  row,
  selected,
  onSelectRow,
  onUpdateStatus,
  // onDeleteUser,
}: AffialiteTableRowProps) {
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

  const handleStatusChange = useCallback(
    () => {
      const newStatus = row.status === 'Active' ? 'Banned' : 'Active';
      onUpdateStatus(row.id, newStatus);
      handleClosePopover();
    },
    [row.status, row.id, onUpdateStatus, handleClosePopover]
  );

  // const handleDeleteUser = useCallback(() => {
  //   onDeleteUser(row.id);
  //   handleClosePopover();
  // }, [row.id, onDeleteUser, handleClosePopover]);

  return (
    <>
      <TableRow hover tabIndex={-1} >
        <TableCell>{row.firstname || '-'}</TableCell>
        <TableCell>{row.lastname || '-'}</TableCell>
        <TableCell>{row.email || '-'}</TableCell>
        <TableCell>{row.phonenumber || '-'}</TableCell>
        <TableCell>{row.referralCode || '-'}</TableCell>

        <TableCell>
          <Label>{row.status}</Label>
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
            {row.status === "Active"? 'Banned' : 'Active'}
          </MenuItem>

          {/* <MenuItem onClick={handleDeleteUser} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem> */}
        </MenuList>
      </Popover>

      <AffiliateDialog open={openDialog} onClose={handleCloseDialog} user={row} />
    </>
  );
}
