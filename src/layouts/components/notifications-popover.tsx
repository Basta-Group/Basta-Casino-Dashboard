import type { IconButtonProps } from '@mui/material/IconButton';

import { Icon } from '@iconify/react';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Pagination from '@mui/material/Pagination';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DialogContent from '@mui/material/DialogContent';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Checkbox from '@mui/material/Checkbox';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';

import { fToNow } from 'src/utils/format-time';

import { env } from 'src/config/env.config';

import { Scrollbar } from 'src/components/scrollbar';

import { toast } from 'react-hot-toast';

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
  onMarkAsRead,
}: NotificationsViewProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Icon icon="solar:bell-bing-bold-duotone" width={24} />
          <Typography variant="h6">All Notifications</Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
          <Icon icon="solar:close-circle-outline" width={24} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Scrollbar>
          {loading ? (
            <Box sx={{ p: 2 }}>
              {[...Array(5)].map((_, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Skeleton variant="rectangular" width="100%" height={80} />
                </Box>
              ))}
            </Box>
          ) : error ? (
            <Box
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Icon icon="solar:danger-circle-bold-duotone" width={48} color="error.main" />
              <Typography sx={{ mt: 2, color: 'error.main' }}>{error}</Typography>
            </Box>
          ) : notifications.length === 0 ? (
            <Box
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Icon icon="solar:bell-off-broken" width={48} color="text.disabled" />
              <Typography sx={{ mt: 2, color: 'text.disabled' }}>
                No notifications available
              </Typography>
            </Box>
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

        {!loading && !error && notifications.length > 0 && (
          <Stack alignItems="center" sx={{ mt: 2 }}>
            <Pagination
              count={pagination.totalPages}
              page={pagination.page}
              onChange={(_, page) => onPageChange(page)}
              shape="rounded"
              color="primary"
            />
          </Stack>
        )}
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
    totalPages: 1,
  });
  const [viewAllOpen, setViewAllOpen] = useState(false);
  const [allNotifications, setAllNotifications] = useState<NotificationItemProps[]>([]);
  const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [detailsNotification, setDetailsNotification] = useState<NotificationItemProps | null>(
    null
  );

  const fetchNotifications = useCallback(
    async (page: number = 1, isViewAll: boolean = false) => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: page.toString(),
          limit: (isViewAll ? 10 : 5).toString(),
        });
        if (filterType !== 'all') {
          params.append('type', filterType);
        }

        const response = await fetch(
          `${env.api.baseUrl}:${env.api.port}/api/auth/notifications?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
        const data = await response.json();
        if (data.success) {
          const transformedNotifications = data.data.notifications.map((notification: any) => ({
            id: notification._id,
            type: notification.type,
            title: notification.user_id?.username || notification.metadata?.username || 'User',
            isUnRead: true,
            description: notification.message,
            avatarUrl: null,
            postedAt: notification.created_at,
            metadata: notification.metadata,
            user_id: notification.user_id
              ? {
                  username: notification.user_id.username,
                  email: notification.user_id.email,
                  phone_number: notification.user_id.phone_number,
                }
              : null,
          }));

          if (isViewAll) {
            setAllNotifications(transformedNotifications);
          } else {
            setNotifications(transformedNotifications);
          }
          setPagination(data.data.pagination);
        } else {
          setError(data.error || 'Failed to fetch notifications');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    },
    [filterType, setLoading, setError, setNotifications, setAllNotifications, setPagination]
  );

  useEffect(() => {
    if (openPopover) {
      fetchNotifications(1, false);
    }
  }, [openPopover, fetchNotifications]);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      const response = await fetch(
        `${env.api.baseUrl}:${env.api.port}/api/auth/notifications/mark-all-read`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

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
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      const updatedNotifications = notifications.map((notification) =>
        notification.id === notificationId ? { ...notification, isUnRead: false } : notification
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

  // Filtering notifications by type
  const filteredNotifications =
    filterType === 'all' ? notifications : notifications.filter((n) => n.type === filterType);

  // Bulk select logic
  const handleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };
  const handleSelectAll = () => {
    if (selectedIds.length === filteredNotifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map((n) => n.id));
    }
  };
  const handleBulkMarkRead = async () => {
    try {
      const response = await fetch(
        `${env.api.baseUrl}:${env.api.port}/api/auth/notifications/mark-bulk-read`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify({ notificationIds: selectedIds }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to mark notifications as read');
      }

      setNotifications((prev) =>
        prev.map((notification) =>
          selectedIds.includes(notification.id)
            ? { ...notification, isUnRead: false }
            : notification
        )
      );
      setAllNotifications((prev) =>
        prev.map((notification) =>
          selectedIds.includes(notification.id)
            ? { ...notification, isUnRead: false }
            : notification
        )
      );
      setSelectedIds([]);
      toast.success('Selected notifications marked as read');
      fetchNotifications(pagination.page, true); // Re-fetch to update counts
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to mark notifications as read');
    }
  };
  const handleBulkDelete = async () => {
    try {
      const response = await fetch(
        `${env.api.baseUrl}:${env.api.port}/api/auth/notifications/bulk-delete`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify({ notificationIds: selectedIds }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete notifications');
      }

      setNotifications((prev) =>
        prev.filter((notification) => !selectedIds.includes(notification.id))
      );
      setAllNotifications((prev) =>
        prev.filter((notification) => !selectedIds.includes(notification.id))
      );
      setSelectedIds([]);
      toast.success('Selected notifications deleted');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to delete notifications');
    }
  };
  const onToggleRead = async (id: string, markUnread: boolean) => {
    try {
      const endpoint = markUnread ? `mark-unread` : `mark-read`;
      const response = await fetch(
        `${env.api.baseUrl}:${env.api.port}/api/auth/notifications/${id}/${endpoint}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to mark as ${markUnread ? 'unread' : 'read'}`);
      }

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id ? { ...notification, isUnRead: markUnread } : notification
        )
      );
      setAllNotifications((prevAllNotifications) =>
        prevAllNotifications.map((notification) =>
          notification.id === id ? { ...notification, isUnRead: markUnread } : notification
        )
      );
      toast.success(`Notification marked as ${markUnread ? 'unread' : 'read'}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error(`Failed to mark as ${markUnread ? 'unread' : 'read'}`);
    }
  };

  return (
    <>
      <IconButton
        color={openPopover ? 'primary' : 'default'}
        onClick={handleOpenPopover}
        sx={{
          position: 'relative',
          ...sx,
        }}
        {...other}
      >
        <Badge badgeContent={totalUnRead} color="error" max={9}>
          <Icon icon="solar:bell-bing-bold-duotone" width={24} />
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
              width: 400,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.1)',
              borderRadius: 2,
            },
          },
        }}
      >
        <Box display="flex" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Notifications
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {totalUnRead === 0
                ? 'No unread messages'
                : `${totalUnRead} unread message${totalUnRead > 1 ? 's' : ''}`}
            </Typography>
          </Box>
          {totalUnRead > 0 && (
            <Tooltip title="Mark all as read">
              <IconButton
                color="primary"
                onClick={handleMarkAllAsRead}
                sx={{ '&:hover': { backgroundColor: 'primary.lighter' } }}
                aria-label="Mark all as read"
              >
                <Icon icon="solar:check-read-outline" width={20} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <Tabs
          value={filterType}
          onChange={(_, v) => setFilterType(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="All" value="all" />
          <Tab label="System" value="SYSTEM_NOTIFICATION" />
          <Tab label="KYC" value="KYC" />
          <Tab label="Payments" value="PAYMENT_RECEIVED" />
        </Tabs>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <Scrollbar fillContent sx={{ minHeight: 240, maxHeight: { xs: 360, sm: '60vh' } }}>
          {loading ? (
            <Box sx={{ p: 2 }}>
              {[...Array(3)].map((_, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Skeleton variant="rectangular" width="100%" height={80} />
                </Box>
              ))}
            </Box>
          ) : error ? (
            <Box
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Icon icon="solar:danger-circle-bold-duotone" width={48} color="error.main" />
              <Typography sx={{ mt: 2, color: 'error.main' }}>{error}</Typography>
            </Box>
          ) : filteredNotifications.length === 0 ? (
            <Box
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Icon icon="solar:bell-off-broken" width={48} color="text.disabled" />
              <Typography sx={{ mt: 2, color: 'text.disabled' }}>
                No notifications available
              </Typography>
            </Box>
          ) : (
            <>
              <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  checked={
                    selectedIds.length === filteredNotifications.length &&
                    filteredNotifications.length > 0
                  }
                  indeterminate={
                    selectedIds.length > 0 && selectedIds.length < filteredNotifications.length
                  }
                  onChange={handleSelectAll}
                  inputProps={{ 'aria-label': 'Select all notifications' }}
                />
                <Button
                  size="small"
                  onClick={handleBulkMarkRead}
                  disabled={selectedIds.length === 0}
                  sx={{ ml: 1 }}
                >
                  Mark as Read
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={handleBulkDelete}
                  disabled={selectedIds.length === 0}
                  sx={{ ml: 1 }}
                >
                  Delete
                </Button>
              </Box>
              <List disablePadding>
                {filteredNotifications.map((notification) => (
                  <ListItemButton
                    key={notification.id}
                    onClick={() => setDetailsNotification(notification)}
                    sx={{
                      py: 1.5,
                      px: 2.5,
                      mt: '1px',
                      gap: 2,
                      ...(notification.isUnRead && {
                        bgcolor: 'action.selected',
                      }),
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <Checkbox
                      checked={selectedIds.includes(notification.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelect(notification.id);
                      }}
                      inputProps={{ 'aria-label': 'Select notification' }}
                      sx={{ mr: 1 }}
                    />
                    <Avatar
                      sx={{
                        bgcolor: 'background.neutral',
                        color: 'primary.main',
                        width: 40,
                        height: 40,
                      }}
                    >
                      {renderContent(notification).avatarIcon}
                    </Avatar>
                    <ListItemText
                      primary={renderContent(notification).title}
                      primaryTypographyProps={{
                        variant: 'subtitle2',
                        sx: {
                          fontWeight: notification.isUnRead ? 'fontWeightBold' : 'fontWeightMedium',
                        },
                      }}
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
                          <Icon icon="solar:clock-circle-outline" width={14} />
                          {fToNow(notification.postedAt)}
                        </Typography>
                      }
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleRead(notification.id, !notification.isUnRead);
                      }}
                      aria-label={notification.isUnRead ? 'Mark as read' : 'Mark as unread'}
                    >
                      <Icon
                        icon={
                          notification.isUnRead
                            ? 'solar:check-read-outline'
                            : 'solar:mail-unread-outline'
                        }
                      />
                    </IconButton>
                  </ListItemButton>
                ))}
              </List>
            </>
          )}
        </Scrollbar>

        {filteredNotifications.length > 0 && (
          <>
            <Divider sx={{ borderStyle: 'dashed' }} />
            <Box sx={{ p: 1 }}>
              <Button
                fullWidth
                disableRipple
                color="inherit"
                onClick={handleViewAllOpen}
                endIcon={<Icon icon="solar:arrow-right-outline" width={16} />}
                sx={{
                  justifyContent: 'space-between',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: 'primary.main',
                  },
                }}
              >
                View all notifications
              </Button>
            </Box>
          </>
        )}
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

      {/* Notification Details Modal */}
      <Dialog
        open={!!detailsNotification}
        onClose={() => setDetailsNotification(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Notification Details</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1">{detailsNotification?.title}</Typography>
          <TextField
            id="notification-description-field"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={detailsNotification?.description || ''}
            InputProps={{ readOnly: true }}
            sx={{ mb: 2, mt: 1 }}
          />
          <Typography variant="caption" color="text.secondary">
            {detailsNotification?.postedAt ? fToNow(detailsNotification.postedAt) : ''}
          </Typography>
          {/* You can add more metadata/details here if `detailsNotification.metadata` has more fields */}
          {detailsNotification?.metadata &&
            Object.keys(detailsNotification.metadata).length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2">Metadata:</Typography>
                {Object.entries(detailsNotification.metadata).map(([key, value]) => (
                  <Typography key={key} variant="body2">{`${key}: ${String(value)}`}</Typography>
                ))}
              </Box>
            )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsNotification(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function NotificationItem({
  notification,
  onClick,
}: {
  notification: NotificationItemProps;
  onClick?: () => void;
}) {
  const { avatarIcon, title } = renderContent(notification);

  return (
    <ListItemButton
      onClick={onClick}
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        gap: 2,
        ...(notification.isUnRead && {
          bgcolor: 'action.selected',
        }),
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
    >
      <ListItemAvatar>
        <Avatar
          sx={{
            bgcolor: 'background.neutral',
            color: 'primary.main',
            width: 40,
            height: 40,
          }}
        >
          {avatarIcon}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        primaryTypographyProps={{
          variant: 'subtitle2',
          sx: {
            fontWeight: notification.isUnRead ? 'fontWeightBold' : 'fontWeightMedium',
          },
        }}
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
            <Icon icon="solar:clock-circle-outline" width={14} />
            {fToNow(notification.postedAt)}
          </Typography>
        }
      />
      {notification.isUnRead && (
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            flexShrink: 0,
          }}
        />
      )}
    </ListItemButton>
  );
}

function renderContent(notification: NotificationItemProps) {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}{' '}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        {notification.description}
      </Typography>
    </Typography>
  );

  let icon = 'solar:user-bold-duotone';

  switch (notification.type) {
    case 'USER_REGISTERED':
      icon = 'solar:user-bold-duotone';
      break;
    case 'ORDER_CREATED':
      icon = 'solar:cart-bold-duotone';
      break;
    case 'PAYMENT_RECEIVED':
      icon = 'solar:wallet-bold-duotone';
      break;
    case 'SYSTEM_NOTIFICATION':
      icon = 'solar:info-circle-bold-duotone';
      break;
    default:
      icon = 'solar:bell-bing-bold-duotone';
  }

  return {
    avatarIcon: <Icon icon={icon} width={20} />,
    title,
  };
}
