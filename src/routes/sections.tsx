import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';
import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import TransactionPage from 'src/pages/TransactionPage';
import DashboardBanner from 'src/pages/DashboardBanner';
import AdminAffiliatePage from 'src/pages/AdminAffiliatePage';
import AffiliateInfoPage from 'src/affliate/pages/AffiliateInfoPage';
import AffiliateEarningPage from 'src/affliate/pages/AffiliateEarningPage';
import AffiliateReferralsPage from 'src/affliate/pages/AffiliateReferralsPage';
import CommissionControlPage from 'src/pages/commissionControl';
import { UserDetailPage } from 'src/sections/user/user-detail';

export const HomePage = lazy(() => import('src/pages/home'));
export const LandingPage = lazy(() => import('src/pages/landing'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const TransactionsPage = lazy(() => import('src/pages/TransactionPage'));
export const UserPage = lazy(() => import('src/pages/user'));
export const AffiliatePage = lazy(() => import('src/pages/AdminAffiliatePage'));
export const PaymentPage = lazy(() => import('src/pages/PaymentPage'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// Affiliate routes
const AffiliateLoginPage = lazy(() => import('src/affliate/pages/login'));
const AffiliateForgotPage = lazy(() => import('src/affliate/pages/ForgetPassword'));
const AffiliateRegisterPage = lazy(() => import('src/affliate/pages/AffiliateRegisterPage'));
const AffiliateDashboardPage = lazy(() => import('src/affliate/pages/dashboard'));
const AffiliateLayout = lazy(() => import('src/affliate/layouts/AffliateLayout'));

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

const isAdminAuthenticated = () => !!localStorage.getItem('accessToken');
const isAffiliateAuthenticated = () => !!localStorage.getItem('affiliateToken');

const AdminAuthGuard = ({ children }: { children: React.ReactNode }) =>
  isAdminAuthenticated() ? <>{children}</> : <Navigate to="/sign-in" replace />;

const AffiliateAuthGuard = ({ children }: { children: React.ReactNode }) =>
  isAffiliateAuthenticated() ? <>{children}</> : <Navigate to="/affiliate/login" replace />;

const PublicAffiliateRoutesGuard = ({ children }: { children: React.ReactNode }) =>
  !isAffiliateAuthenticated() ? <>{children}</> : <Navigate to="/affiliate/dashboard" replace />;

export function Router() {
  return useRoutes([
    {
      path: '/home',
      element: (
        <Suspense fallback={renderFallback}>
          <LandingPage />
        </Suspense>
      ),
    },
    {
      element: (
        <AdminAuthGuard>
          <DashboardLayout>
            <Suspense fallback={renderFallback}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </AdminAuthGuard>
      ),
      children: [
        { element: <HomePage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'user/:userId', element: <UserDetailPage /> },
        { path: 'admin-affiliate', element: <AdminAffiliatePage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'payment-details', element: <PaymentPage /> },
        { path: 'transactions', element: <TransactionPage /> },
        { path: 'dashboard-banner', element: <DashboardBanner /> },
        { path: 'commission-control', element: <CommissionControlPage /> },
      ],
    },
    {
      path: 'affiliate',
      element: (
        <Suspense fallback={renderFallback}>
          <Outlet />
        </Suspense>
      ),
      children: [
        {
          element: (
            <PublicAffiliateRoutesGuard>
              <AuthLayout>
                <Outlet />
              </AuthLayout>
            </PublicAffiliateRoutesGuard>
          ),
          children: [
            { path: 'login', element: <AffiliateLoginPage /> },
            { path: 'forget-password', element: <AffiliateForgotPage /> },
            { path: 'register', element: <AffiliateRegisterPage /> },
          ],
        },
        {
          element: (
            <AffiliateAuthGuard>
              <AffiliateLayout />
            </AffiliateAuthGuard>
          ),
          children: [
            { path: 'dashboard', element: <AffiliateDashboardPage /> },
            { path: 'referrals', element: <AffiliateReferralsPage /> },
            { path: 'earnings', element: <AffiliateEarningPage /> },
            { path: 'affliate-info', element: <AffiliateInfoPage /> },
            { index: true, element: <Navigate to="/affiliate/dashboard" replace /> },
          ],
        },
      ],
    },
    {
      path: 'sign-in',
      element: (
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      ),
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
