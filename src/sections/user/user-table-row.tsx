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
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
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
  onViewDocuments: (sumsubId: string, userId: string) => void;
  token: string;
};

export function UserTableRow({
  row,
  selected,
  onSelectRow,
  onUpdateStatus,
  onDeleteUser,
  onKYCStatusUpdate,
  onViewDocuments,
  token,
}: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState<'status' | 'delete' | null>(null);
  const [openKYCReview, setOpenKYCReview] = useState(false);
  const [selectedSumsubId, setSelectedSumsubId] = useState<string | null>(null);
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
    if (!row.username && !row.fullname && !row.email && !row.phone_number) {
      toast.error('Cannot perform action: User data is incomplete');
      handleClosePopover();
      return;
    }
    setOpenConfirmDialog('status');
    handleClosePopover();
  }, [handleClosePopover, row]);

  const handleOpenDeleteDialog = useCallback(() => {
    if (!row.username && !row.fullname && !row.email && !row.phone_number) {
      toast.error('Cannot perform action: User data is incomplete');
      handleClosePopover();
      return;
    }
    setOpenConfirmDialog('delete');
    handleClosePopover();
  }, [handleClosePopover, row]);

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
      setSelectedSumsubId(row.sumsub_id);
      setOpenKYCReview(true);
      handleClosePopover();
    }
  }, [row.sumsub_id, handleClosePopover]);

  const handleCloseKYCReview = useCallback(() => {
    setOpenKYCReview(false);
    setSelectedSumsubId(null);
  }, []);

  const handleReviewStatusUpdate = useCallback(
    (status: 'approved' | 'rejected', reason?: string) => {
      onKYCStatusUpdate(row.id, status);
      handleCloseKYCReview();
    },
    [row.id, onKYCStatusUpdate, handleCloseKYCReview]
  );

  const handleViewDocuments = useCallback(
    (sumsubId: string, userId: string) => {
      onViewDocuments(sumsubId, userId);
      handleClosePopover();
    },
    [onViewDocuments, handleClosePopover]
  );

  const getVerificationStatusColor = (status: string | null | undefined) => {
    switch (status) {
      case 'not_started':
        return 'warning';
      case 'in_review':
        return 'info';
      case 'approved_sumsub':
        return 'success';
      case 'rejected_sumsub':
        return 'error';
      default:
        return 'default';
    }
  };

  const getVerificationStatusLabel = (status: string | null | undefined) => {
    switch (status) {
      case 'not_started':
        return 'Not Started';
      case 'in_review':
        return 'In Review';
      case 'approved_sumsub':
        return 'Approved by Sumsub';
      case 'rejected_sumsub':
        return 'Rejected by Sumsub';
      case 'approved':
        return 'Approved by Admin';
      case 'rejected':
        return 'Rejected by Admin';
      default:
        return 'Unknown';
    }
  };

  const getAdminStatusColor = (status: string | null | undefined) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getAdminStatusLabel = (status: string | null | undefined) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return 'N/A';
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            <Avatar
              alt={row.username}
              src={
                row.photo ||
                `/assets/images/avatar/avatar-${Math.floor(Math.random() * 24) + 1}.webp`
              }
              sx={{ width: 40, height: 40, bgcolor: !row.photo ? 'primary.main' : 'transparent' }}
            >
              {!row.photo && row.username?.[0]?.toUpperCase()}
            </Avatar>
            {row.username || '-'}
          </Box>
        </TableCell>
        <TableCell>{row.fullname || '-'}</TableCell>
        <TableCell>{row.email || '-'}</TableCell>
        <TableCell>{row.phone_number || '-'}</TableCell>
        <TableCell>{row.referredByName || 'N/A'}</TableCell>
        <TableCell align="center">
          <Label color={getVerificationStatusColor(row.sumsub_status)}>
            {getVerificationStatusLabel(row.sumsub_status)}
          </Label>
        </TableCell>
        <TableCell align="center">
          <Label color={getAdminStatusColor(row.admin_status)}>
            {getAdminStatusLabel(row.admin_status)}
          </Label>
        </TableCell>
        <TableCell align="center">
          <Label color={row.is_verified === 1 ? 'success' : 'error'}>
            {row.is_verified === 1 ? 'Verified' : 'Unverified'}
          </Label>
        </TableCell>
        <TableCell align="center">
          <Label color={row.status === 1 ? 'success' : 'error'}>
            {row.status === 1 ? 'Active' : 'Inactive'}
          </Label>
        </TableCell>
        <TableCell align="right">
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
        PaperProps={{
          sx: {
            p: 0.5,
            width: 180,
            '& .MuiMenuItem-root': {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              typography: 'body2',
              '&:hover': { bgcolor: 'action.selected' },
            },
          },
        }}
      >
        <MenuList>
          <MenuItem onClick={handleViewDetails}>
            <Iconify icon="eva:eye-fill" />
            View Details
          </MenuItem>
          <MenuItem onClick={handleOpenStatusDialog}>
            <Iconify icon={row.status === 1 ? 'eva:slash-fill' : 'eva:checkmark-fill'} />
            {row.status === 1 ? 'Deactivate' : 'Activate'}
          </MenuItem>
          {row.sumsub_id && (
            <MenuItem onClick={handleOpenKYCReview}>
              <Iconify icon="eva:file-text-fill" />
              Review Documents
            </MenuItem>
          )}
          <MenuItem onClick={handleOpenDeleteDialog} sx={{ color: 'error.main' }}>
            <Iconify icon="eva:trash-2-outline" />
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
                &ldquo;
                {row.username || row.fullname || row.email || row.phone_number || 'Unknown User'}
                &rdquo;
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
                &ldquo;
                {row.username || row.fullname || row.email || row.phone_number || 'Unknown User'}
                &rdquo;
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

      {selectedSumsubId && (
        <UserKYCReview
          userId={row.id}
          sumsubId={selectedSumsubId}
          sumsubStatus={row.sumsub_status}
          onClose={handleCloseKYCReview}
          onStatusUpdate={handleReviewStatusUpdate}
          token={token}
        />
      )}
    </>
  );
}
