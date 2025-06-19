import { Icon } from '@iconify/react';

import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-analytics'),
    info: (
      <Label color="success" variant="inverted">
        Live
      </Label>
    ),
  },
  {
    title: 'Player Management',
    path: '/playerListing',
    icon: icon('ic-user'),
    children: [
      { title: 'Player List', path: '/playerListing' },
      { title: 'Player Balances', path: '/players/balances' },
    ],
  },
  {
    title: 'Pending KYC',
    path: '/pending-kyc',
    icon: icon('ic-lock'),
  },
  {
    title: 'Affiliate Management',
    path: '/affiliateListing',
    icon: icon('ic-user'),
    children: [{ title: 'Affiliate List', path: '/affiliateListing' }],
  },
  {
    title: 'Game Management',
    path: '/gameListing',
    icon: icon('ic-cart'),
    children: [
      { title: 'Game Catalog', path: '/games/catalog' },
      { title: 'Providers', path: '/games/providers' },
      { title: 'Active Sessions', path: '/games/sessions' },
    ],
  },
  {
    title: 'Transactions',
    path: '/transactionListing',
    icon: <Icon icon="mdi:account-balance" fontSize="22px" />,
    children: [
      { title: 'Transaction History', path: '/transactions/history' },
      { title: 'Payment Processing', path: '/transactions/processing' },
      { title: 'Refunds', path: '/transactions/refunds' },
    ],
  },
  {
    title: 'Affliate Commission Control',
    path: '/commissionControl',
    icon: <Icon icon="mdi:file-chart" fontSize="22px" />,
  },
  {
    title: 'System Settings',
    path: '/settings',
    icon: <Icon icon="mdi:cog" fontSize="22px" />,
    children: [
      { title: 'Currency Settings', path: '/settings/currency' },
      { title: 'Payment Methods', path: '/settings/payment' },
      { title: 'Language Settings', path: '/settings/language' },
      { title: 'Location Settings', path: '/settings/location' },
    ],
  },
  {
    title: 'Access Control',
    path: '/access',
    icon: icon('ic-lock'),
    children: [
      { title: 'User Roles', path: '/access/roles' },
      { title: 'Permissions', path: '/access/permissions' },
      { title: 'Admin Users', path: '/access/users' },
    ],
  },
  {
    title: 'Payment Management',
    path: '/paymentDetails',
    icon: <Icon icon="mdi:credit-card" fontSize="22px" />,
    children: [
      { title: 'Invoices', path: '/payments/invoices' },
      { title: 'Refunds', path: '/payments/refunds' },
    ],
  },
  {
    title: 'Banner Management',
    path: '/dashboardBanner',
    icon: <Icon icon="mdi:credit-card" fontSize="22px" />,
  },
  {
    title: 'Payout-Approval',
    path: '/adminPayout',
    icon: <Icon icon="mdi:credit-card" fontSize="22px" />,
  },
  {
    title: 'Platform Fee',
    path: '/platform-fee',
    icon: <Icon icon="mdi:percent" />,
  },
];

export type NavItem = {
  title: string;
  path: string;
  icon?: React.ReactNode;
  info?: React.ReactNode;
  children?: Omit<NavItem, 'icon' | 'info'>[];
};

export type NavData = NavItem[];
