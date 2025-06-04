import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import { Typography } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { UserProps } from './types';
import { UserKYCReview } from './view/user-kyc-review';

type UserTableRowProps = {
  row: UserProps;
  selected: boolean;
  onSelectRow: () => void;
  onUpdateStatus: (userId: string, newStatus: number) => void;
  onDeleteUser: (userId: string) => void;
  onKYCStatusUpdate: (userId: string, newStatus: 'approved' | 'rejected') => void;
};

export function UserTableRow({
  row,
  selected,
  onSelectRow,
  onUpdateStatus,
  onDeleteUser,
  onKYCStatusUpdate,
}: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState<'status' | 'delete' | null>(null);
  const [openKYCReview, setOpenKYCReview] = useState(false);
  const navigate = useNavigate();

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleViewDetails = useCallback(() => {
    navigate(`/playerDetails/${row.id}`);
    handleClosePopover();
  }, [navigate, row.id, handleClosePopover]);

  const handleOpenStatusDialog = useCallback(() => {
    setOpenConfirmDialog('status');
    handleClosePopover();
  }, [handleClosePopover]);

  const handleOpenDeleteDialog = useCallback(() => {
    setOpenConfirmDialog('delete');
    handleClosePopover();
  }, [handleClosePopover]);

  const handleCloseDialog = useCallback(() => {
    setOpenConfirmDialog(null);
  }, []);

  const handleStatusChange = useCallback(() => {
    const newStatus = row.status === 1 ? 0 : 1;
    onUpdateStatus(row.id, newStatus);
    handleCloseDialog();
  }, [row.status, row.id, onUpdateStatus, handleCloseDialog]);

  const handleDeleteUser = useCallback(() => {
    onDeleteUser(row.id);
    handleCloseDialog();
  }, [row.id, onDeleteUser, handleCloseDialog]);

  const handleOpenKYCReview = useCallback(() => {
    if (row.sumsub_id) {
      setOpenKYCReview(true);
      handleClosePopover();
    }
  }, [row.sumsub_id, handleClosePopover]);

  const handleCloseKYCReview = useCallback(() => {
    setOpenKYCReview(false);
  }, []);

  const handleReviewStatusUpdate = useCallback(
    (status: 'approved' | 'rejected') => {
      onKYCStatusUpdate(row.id, status);
    },
    [row.id, onKYCStatusUpdate]
  );

  const getVerificationStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getVerificationStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'pending':
        return 'Pending';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Not Started';
    }
  };

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
          <Label color={getVerificationStatusColor(row.verification_status)}>
            {getVerificationStatusLabel(row.verification_status)}
          </Label>
          {row.verification_status === 'pending' && row.sumsub_id && (
            <Button size="small" variant="outlined" onClick={handleOpenKYCReview} sx={{ ml: 1 }}>
              Review
            </Button>
          )}
        </TableCell>

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
          <MenuItem onClick={handleViewDetails}>
            <Iconify icon="solar:eye-bold" />
            View Details
          </MenuItem>

          <MenuItem onClick={handleOpenStatusDialog}>
            <Iconify icon="solar:user-block-bold" />
            {row.status === 1 ? 'Deactivate' : 'Activate'}
          </MenuItem>

          <MenuItem onClick={handleOpenDeleteDialog} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>

      <Dialog
        open={openConfirmDialog === 'status'}
        onClose={handleCloseDialog}
        aria-labelledby="status-confirm-dialog-title"
        aria-describedby="status-confirm-dialog-description"
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            minWidth: 300,
            maxWidth: 400,
          },
        }}
      >
        <DialogTitle
          id="status-confirm-dialog-title"
          sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}
        >
          <Iconify
            icon={row.status === 1 ? 'solar:user-block-bold' : 'solar:user-check-bold'}
            sx={{ color: row.status === 1 ? 'error.main' : 'success.main' }}
          />
          {row.status === 1 ? 'Deactivate User' : 'Activate User'}
        </DialogTitle>
        <DialogContent sx={{ py: 2, textAlign: 'center' }}>
          <DialogContentText id="status-confirm-dialog-description">
            <Typography variant="body1" color="#000">
              Are you sure you want to {row.status === 1 ? 'deactivate' : 'activate'} the user{' '}
              <strong>
                &quot;{row.fullname || row.email || row.phone_number || 'this user'}&quot;
              </strong>
              ?
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'center' }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            color="inherit"
            sx={{ borderRadius: 1, mx: 1 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleStatusChange}
            variant="contained"
            color={row.status === 1 ? 'error' : 'success'}
            autoFocus
            sx={{ borderRadius: 1, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', mx: 1 }}
          >
            {row.status === 1 ? 'Deactivate' : 'Activate'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Delete */}
      <Dialog
        open={openConfirmDialog === 'delete'}
        onClose={handleCloseDialog}
        aria-labelledby="delete-confirm-dialog-title"
        aria-describedby="delete-confirm-dialog-description"
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            minWidth: 300,
            maxWidth: 400,
          },
        }}
      >
        <DialogTitle
          id="delete-confirm-dialog-title"
          sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" sx={{ color: 'error.main' }} />
          Delete User
        </DialogTitle>
        <DialogContent sx={{ py: 2, textAlign: 'center' }}>
          <DialogContentText id="delete-confirm-dialog-description">
            <Typography variant="body1" color="#000">
              Are you sure you want to delete the user{' '}
              <strong>
                &quot;{row.fullname || row.email || row.phone_number || 'this user'}&quot;
              </strong>
              ?
              <Typography component="span" color="error.main">
                {' '}
                <br />
                This action cannot be undone.
              </Typography>
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'center' }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            color="inherit"
            sx={{ borderRadius: 1, mx: 1 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteUser}
            variant="contained"
            color="error"
            autoFocus
            sx={{ borderRadius: 1, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', mx: 1 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {openKYCReview && row.sumsub_id && (
        <UserKYCReview
          userId={row.id}
          sumsubId={row.sumsub_id}
          onClose={handleCloseKYCReview}
          onStatusUpdate={handleReviewStatusUpdate}
        />
      )}
    </>
  );
}
