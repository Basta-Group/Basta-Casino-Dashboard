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
    path: '/user',
    icon: icon('ic-user'),
    children: [
      { title: 'Player List', path: '/players/list' },
      { title: 'Verification Queue', path: '/players/verification' },
      { title: 'Player Balances', path: '/players/balances' },
    ],
  },
  {
    title: 'Game Management',
    path: '/products',
    icon: icon('ic-cart'),
    children: [
      { title: 'Game Catalog', path: '/games/catalog' },
      { title: 'Providers', path: '/games/providers' },
      { title: 'Active Sessions', path: '/games/sessions' },
    ],
  },
  {
    title: 'Transactions',
    path: '/blog',
    icon: icon('ic-banking'),
    children: [
      { title: 'Transaction History', path: '/transactions/history' },
      { title: 'Payment Processing', path: '/transactions/processing' },
      { title: 'Refunds', path: '/transactions/refunds' },
    ],
  },
  {
    title: 'Reports & Analytics',
    path: '/reports',
    icon: icon('ic-file'),
    children: [
      { title: 'Financial Reports', path: '/reports/financial' },
      { title: 'Player Analytics', path: '/reports/players' },
      { title: 'Game Performance', path: '/reports/games' },
      { title: 'Audit Logs', path: '/reports/audit' },
    ],
  },
  {
    title: 'System Settings',
    path: '/settings',
    icon: icon('ic-settings'),
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
];

export type NavItem = {
  title: string;
  path: string;
  icon?: React.ReactNode;
  info?: React.ReactNode;
  children?: Omit<NavItem, 'icon' | 'info'>[];
};

export type NavData = NavItem[];