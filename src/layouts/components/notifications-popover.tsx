import {env} from 'src/config/env.config';
import type { IconButtonProps } from '@mui/material/IconButton';
import { useState, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import { fToNow } from 'src/utils/format-time';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

type NotificationItemProps = {
  id: string;
  type: string;
  title: string;
  isUnRead: boolean;
  description: string;
  avatarUrl: string | null;
  postedAt: string | number | null;
  metadata?: any;
  user_id?: {
    username: string;
    email: string;
    phone_number: string;
  } | null;
};

interface PaginationData {
  total: number;
  page: number;
  totalPages: number;
}

export type NotificationsPopoverProps = IconButtonProps & {
  data?: NotificationItemProps[];
};

interface NotificationsViewProps {
  open: boolean;
  onClose: () => void;
  notifications: NotificationItemProps[];
  pagination: PaginationData;
  onPageChange: (page: number) => void;
  loading: boolean;
  error: string | null;
  onMarkAsRead: (notificationId: string) => void;
}

function NotificationsViewDialog({
  open,
  onClose,
  notifications,
  pagination,
  onPageChange,
  loading,
  error,
  onMarkAsRead
}: NotificationsViewProps) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        All Notifications
        <IconButton onClick={onClose}>
          <Iconify icon="solar:close-circle-outline" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Scrollbar>
          {loading ? (
            <Typography sx={{ p: 2 }}>Loading...</Typography>
          ) : error ? (
            <Typography sx={{ p: 2, color: 'error.main' }}>{error}</Typography>
          ) : (
            <List disablePadding>
              {notifications.map((notification) => (
                <NotificationItem 
                  key={notification.id} 
                  notification={notification}
                  onClick={() => onMarkAsRead(notification.id)}
                />
              ))}
            </List>
          )}
        </Scrollbar>
        
        <Stack alignItems="center" sx={{ mt: 2 }}>
          <Pagination 
            count={pagination.totalPages}
            page={pagination.page}
            onChange={(_, page) => onPageChange(page)}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export function NotificationsPopover({ sx, ...other }: NotificationsPopoverProps) {
  const [notifications, setNotifications] = useState<NotificationItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    totalPages: 1
  });
  const [viewAllOpen, setViewAllOpen] = useState(false);
  const [allNotifications, setAllNotifications] = useState<NotificationItemProps[]>([]);
  const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const fetchNotifications = async (page: number = 1, isViewAll: boolean = false) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${env.api.baseUrl}:${env.api.port}/api/auth/notifications?page=${page}&limit=${isViewAll ? 10 : 5}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      const data = await response.json();
      
      const transformedNotifications = data.data.notifications.map((notification: any) => ({
        id: notification._id,
        type: notification.type,
        title: notification.user_id?.username || notification.metadata?.username || 'User',
        isUnRead: true,
        description: notification.message,
        avatarUrl: null,
        postedAt: notification.created_at,
        metadata: notification.metadata,
        user_id: notification.user_id ? {
          username: notification.user_id.username,
          email: notification.user_id.email,
          phone_number: notification.user_id.phone_number
        } : null
      }));

      if (isViewAll) {
        setAllNotifications(transformedNotifications);
      } else {
        setNotifications(transformedNotifications);
      }
      setPagination(data.data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (openPopover) {
      fetchNotifications(1, false);
    }
  }, [openPopover]);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      const response = await fetch(`${env.api.baseUrl}:${env.api.port}/api/auth/notifications/mark-all-read`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark notifications as read');
      }

      const updatedNotifications = notifications.map((notification) => ({
        ...notification,
        isUnRead: false,
      }));
      setNotifications(updatedNotifications);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark as read');
    }
  }, [notifications]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(
        `${env.api.baseUrl}:${env.api.port}/api/auth/notifications/${notificationId}/mark-read`,
        {
          method: 'POST',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      const updatedNotifications = notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isUnRead: false }
          : notification
      );
      setNotifications(updatedNotifications);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark as read');
    }
  };

  const handleViewAllOpen = () => {
    setViewAllOpen(true);
    fetchNotifications(1, true);
  };

  const handleViewAllClose = () => {
    setViewAllOpen(false);
  };

  const handlePageChange = (page: number) => {
    fetchNotifications(page, true);
  };

  return (
    <>
      <IconButton
        color={openPopover ? 'primary' : 'default'}
        onClick={handleOpenPopover}
        sx={sx}
        {...other}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify width={24} icon="solar:bell-bing-bold-duotone" />
        </Badge>
      </IconButton>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              width: 360,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            },
          },
        }}
      >
        <Box display="flex" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {totalUnRead} unread messages
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title="Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="solar:check-read-outline" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar fillContent sx={{ minHeight: 240, maxHeight: { xs: 360, sm: 'none' } }}>
          {loading ? (
            <Typography sx={{ p: 2 }}>Loading...</Typography>
          ) : error ? (
            <Typography sx={{ p: 2, color: 'error.main' }}>{error}</Typography>
          ) : (
            <>
              <List
                disablePadding
                subheader={
                  <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                    New
                  </ListSubheader>
                }
              >
                {notifications.slice(0, 2).map((notification) => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification}
                    onClick={() => handleMarkAsRead(notification.id)}
                  />
                ))}
              </List>

              <List
                disablePadding
                subheader={
                  <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                    Before that
                  </ListSubheader>
                }
              >
                {notifications.slice(2, 5).map((notification) => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification}
                    onClick={() => handleMarkAsRead(notification.id)}
                  />
                ))}
              </List>
            </>
          )}
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button 
            fullWidth 
            disableRipple 
            color="inherit"
            onClick={handleViewAllOpen}
          >
            View all
          </Button>
        </Box>
      </Popover>

      <NotificationsViewDialog
        open={viewAllOpen}
        onClose={handleViewAllClose}
        notifications={allNotifications}
        pagination={pagination}
        onPageChange={handlePageChange}
        loading={loading}
        error={error}
        onMarkAsRead={handleMarkAsRead}
      />
    </>
  );
}

function NotificationItem({ 
  notification, 
  onClick 
}: { 
  notification: NotificationItemProps;
  onClick?: () => void;
}) {
  const { avatarUrl, title } = renderContent(notification);

  return (
    <ListItemButton
      onClick={onClick}
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.isUnRead && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatarUrl}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              gap: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify width={14} icon="solar:clock-circle-outline" />
            {fToNow(notification.postedAt)}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

function renderContent(notification: NotificationItemProps) {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {notification.description}
      </Typography>
    </Typography>
  );

  let iconPath = '/assets/icons/notification/ic-notification-package.svg';
  
  switch (notification.type) {
    case 'USER_REGISTERED':
      iconPath = '/assets/icons/notification/ic-notification-user.svg';
      break;
    default:
      iconPath = '/assets/icons/notification/ic-notification-package.svg';
  }

  return {
    avatarUrl: <img alt={notification.title} src={iconPath} />,
    title,
  };
}