import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import TransactionPage from 'src/pages/TransactionPage';
import DashboardBanner from 'src/pages/DashboardBanner';

// ----------------------------------------------------------------------

// Lazy-loaded pages
export const HomePage = lazy(() => import('src/pages/home'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const TransactionsPage = lazy(() => import('src/pages/TransactionPage'));
export const UserPage = lazy(() => import('src/pages/user'));
export const AffiliatePage = lazy(() => import('src/pages/affiliate'));
export const PaymentPage = lazy(() => import('src/pages/PaymentPage'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
// affliate-routes
const AffiliateLoginPage = lazy(() => import('src/affliate/pages/login'));
const AffiliateForgotPage = lazy(() => import('src/affliate/pages/ForgetPassword'));
const AffiliateDashboardPage = lazy(() => import('src/affliate/pages/dashboard'));
const AffiliateLayout = lazy(() => import('src/affliate/layouts/AffliateLayout'));

// ----------------------------------------------------------------------

// Loading fallback
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

// Authentication check
const isAuthenticated = () => !!localStorage.getItem('accessToken');

// Auth Guard
const AuthGuard = ({ children }: { children: React.ReactNode }) =>
  isAuthenticated() ? <>{children}</> : <Navigate to="/sign-in" replace />;


export function Router() {
  return useRoutes([
    {
      element: (
        <AuthGuard>
          <DashboardLayout>
            <Suspense fallback={renderFallback}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </AuthGuard>
      ),
      children: [
        { element: <HomePage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'affiliate', element: <AffiliatePage/> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'payment-details', element: <PaymentPage /> },
        { path: 'transactions', element: <TransactionPage /> },
        { path: 'dashboard-banner', element: <DashboardBanner /> },
      ],
    },
    // ✅ Affiliate Routes here
    {
      path: 'affiliate',
      element: (
        <Suspense fallback={renderFallback}>
          <AffiliateLayout />
        </Suspense>
      ),
      children: [
        { path: 'login', element: <AffiliateLoginPage /> },
        { path: 'forget-password', element: <AffiliateForgotPage /> },
        { path: 'dashboard', element: <AffiliateDashboardPage /> },
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
