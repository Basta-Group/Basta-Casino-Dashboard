import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { AffiliateDialog } from './affiliate-detail-dialog';

import type { AffiliateProps } from './types';

type AffiliateTableRowProps = {
  row: AffiliateProps;
  onUpdateStatus: (userId: string, newStatus: number) => void;
};

/**
 * AffiliateTableRow component for displaying affiliate information in a table row
 * Provides actions to view details and update affiliate status
 */
export function AffiliateTableRow({ row, onUpdateStatus }: AffiliateTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

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
    const newStatus = row.status === 1 ? 2 : 1;
    onUpdateStatus(row.id, newStatus);
    handleClosePopover();
  }, [row.status, row.id, onUpdateStatus, handleClosePopover]);

  const handleViewDetails = useCallback(() => {
    navigate(`/affilateDetails/${row.id}`);
    handleClosePopover();
  }, [navigate, row.id, handleClosePopover]);

  const handleOpenUsers = () => {
    navigate(`/referredUserListing/${row.id}`);
  };

  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell>{row.firstname || '-'}</TableCell>
        <TableCell>{row.lastname || '-'}</TableCell>
        <TableCell>{}</TableCell>
        <TableCell>{row.email || '-'}</TableCell>
        <TableCell>{row.phonenumber || '-'}</TableCell>
        <TableCell>{row.referralCode || '-'}</TableCell>

        <TableCell align="center">
          <Label color={row.status === 1 ? 'success' : row.status === 2 ? 'error' : 'warning'}>
            {row.status === 1 ? 'Active' : row.status === 2 ? 'Banned' : 'InActive'}
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
          <MenuItem onClick={handleViewDetails}>
            <Iconify icon="solar:eye-bold" />
            View Details
          </MenuItem>

          <MenuItem onClick={handleStatusChange}>
            <Iconify icon="solar:user-block-bold" />
            {row.status === 1 ? 'Banned' : 'Active'}
          </MenuItem>
        </MenuList>
      </Popover>

      <AffiliateDialog open={openDialog} onClose={handleCloseDialog} user={row} />
    </>
  );
}
