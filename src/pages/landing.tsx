import { Box, Button, Card, Container, Typography, Stack } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import { CONFIG } from 'src/config-global';

export default function LandingPage() {
  const router = useRouter();

  const handleAdminLogin = () => {
    router.push('/sign-in');
  };

  const handleAffiliateLogin = () => {
    router.push('/affiliate/login');
  };

  const handleAffiliateRegister = () => {
    router.push('/affiliate/register');
  };

  return (
    <>
      <Helmet>
        <title>{`Home | ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="Choose your login or registration option - admin or affiliate access"
        />
        <meta name="keywords" content="login,register,admin,affiliate,dashboard,portal" />
      </Helmet>

      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography variant="h3" component="h1" paragraph textAlign="center" mb={6}>
          Welcome to {CONFIG.appName}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            justifyContent: 'center',
          }}
        >
          <Card sx={{ p: 5, width: '100%', maxWidth: 400 }}>
            <Stack spacing={3} alignItems="center">
              <Iconify icon="solar:user-id-bold" width={80} height={80} color="primary.main" />
              <Typography variant="h4">Admin Login</Typography>
              <Typography variant="body1" textAlign="center" color="text.secondary">
                Access the admin dashboard to manage your platform, users, and settings.
              </Typography>
              <Button
                fullWidth
                size="large"
                variant="contained"
                onClick={handleAdminLogin}
                startIcon={<Iconify icon="solar:login-3-bold" />}
              >
                Login as Admin
              </Button>
            </Stack>
          </Card>

          <Card sx={{ p: 5, width: '100%', maxWidth: 400 }}>
            <Stack spacing={3} alignItems="center">
              <Iconify
                icon="solar:users-group-rounded-bold"
                width={80}
                height={80}
                color="info.main"
              />
              <Typography variant="h4">Affiliate Access</Typography>
              <Typography variant="body1" textAlign="center" color="text.secondary">
                Log in to your affiliate dashboard or register to start earning with referrals.
              </Typography>
              <Button
                fullWidth
                size="large"
                variant="contained"
                color="info"
                onClick={handleAffiliateLogin}
                startIcon={<Iconify icon="solar:login-3-bold" />}
                sx={{ mb: 2 }}
              >
                Login as Affiliate
              </Button>
              <Button
                fullWidth
                size="medium"
                variant="outlined"
                color="info"
                onClick={handleAffiliateRegister}
                startIcon={<Iconify icon="solar:user-plus-bold" />}
              >
                Register as Affiliate
              </Button>
            </Stack>
          </Card>
        </Box>
      </Container>
    </>
  );
}
