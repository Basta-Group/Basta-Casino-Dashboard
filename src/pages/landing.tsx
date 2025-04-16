import { Box, Button, Card, Container, Typography, Stack } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
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

  // Animation variants for cards
  const cardVariants = {
    hover: { scale: 1.03, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' },
    initial: { scale: 1, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
  };

  // Animation for buttons
  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
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

      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #e0f7fa 0%, #80deea 100%)',
          display: 'flex',
          alignItems: 'center',
          py: { xs: 6, md: 10 },
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h1"
            textAlign="center"
            sx={{
              mb: 8,
              fontWeight: 'bold',
              color: '#1a237e',
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            Welcome to {CONFIG.appName}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 4,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* Admin Card */}
            <motion.div
              variants={cardVariants}
              initial="initial"
              whileHover="hover"
              transition={{ duration: 0.3 }}
            >
              <Card
                sx={{
                  p: 5,
                  width: '100%',
                  maxWidth: 400,
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                <Stack spacing={3} alignItems="center">
                  <Iconify
                    icon="solar:user-id-bold"
                    width={80}
                    height={80}
                    sx={{ color: 'primary.main' }}
                  />
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    Admin Login
                  </Typography>
                  <Typography
                    variant="body1"
                    textAlign="center"
                    sx={{ color: 'text.secondary', maxWidth: 300 }}
                  >
                    Access the admin dashboard to manage your platform, users, and settings.
                  </Typography>
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button
                      fullWidth
                      size="large"
                      variant="contained"
                      onClick={handleAdminLogin}
                      startIcon={<Iconify icon="solar:login-3-bold" />}
                      aria-label="Login as Admin"
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 'medium',
                        py: 1.5,
                      }}
                    >
                      Login as Admin
                    </Button>
                  </motion.div>
                </Stack>
              </Card>
            </motion.div>

            {/* Affiliate Card */}
            <motion.div
              variants={cardVariants}
              initial="initial"
              whileHover="hover"
              transition={{ duration: 0.3 }}
            >
              <Card
                sx={{
                  p: 5,
                  width: '100%',
                  maxWidth: 400,
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                <Stack spacing={3} alignItems="center">
                  <Iconify
                    icon="solar:users-group-rounded-bold"
                    width={80}
                    height={80}
                    sx={{ color: 'info.main' }}
                  />
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    Affiliate Access
                  </Typography>
                  <Typography
                    variant="body1"
                    textAlign="center"
                    sx={{ color: 'text.secondary', maxWidth: 300 }}
                  >
                    Log in to your affiliate dashboard or register to start earning with referrals.
                  </Typography>
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button
                      fullWidth
                      size="large"
                      variant="contained"
                      color="info"
                      onClick={handleAffiliateLogin}
                      startIcon={<Iconify icon="solar:login-3-bold" />}
                      aria-label="Login as Affiliate"
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 'medium',
                        py: 1.5,
                        mb: 2,
                      }}
                    >
                      Login as Affiliate
                    </Button>
                  </motion.div>
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    {/* <Button
                      fullWidth
                      size="large"
                      variant="outlined"
                      color="info"
                      onClick={handleAffiliateRegister}
                      startIcon={<Iconify icon="solar:user-plus-bold" />}
                      aria-label="Register as Affiliate"
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 'medium',
                        py: 1.5,
                      }}
                    >
                      Register as Affiliate
                    </Button> */}
                  </motion.div>
                </Stack>
              </Card>
            </motion.div>
          </Box>
        </Container>
      </Box>
    </>
  );
}
