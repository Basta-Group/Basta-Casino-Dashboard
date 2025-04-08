import { useState, useCallback } from 'react';
import {
  Box,
  TextField,
  Typography,
  Link,
  Divider,
  InputAdornment,
  IconButton,
  Alert,
  Stack,
  Grid,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Iconify } from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';

// Type definition for form data
interface LoginFormData {
  email: string;
  password: string;
}

// Type definition for API response
interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      email: string;
      username: string;
      role: number;
      requires2FA?: boolean;
    };
    token: string;
    expiresIn: number;
  };
  error?: string;
  errors?: Array<{ param?: string; message: string }>;
}

export default function AffiliateLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });

  // Handle input change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    setError('');
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  // Validate form fields
  const validateForm = useCallback(() => {
    if (!formData.email) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Invalid email format';
    if (!formData.password) return 'Password is required';
    return '';
  }, [formData]);

  // Handle login submission
  const handleLogin = useCallback(async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    setFieldErrors({});

    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}:${import.meta.env.VITE_API_PORT}/api/auth/affiliate/login`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role_id: 2 }),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok || !data.success) {
        if (data.error) {
          throw new Error(data.error);
        }
        if (data.errors && Array.isArray(data.errors)) {
          const errorMap: Record<string, string> = {};
          data.errors.forEach((err) => {
            if (err.param) {
              errorMap[err.param] = err.message;
            } else {
              setError(err.message);
            }
          });
          setFieldErrors(errorMap);
          return;
        }
        throw new Error('Login failed');
      }

      if (!data.data?.token) {
        throw new Error('No token received from server');
      }

      localStorage.setItem('affiliateToken', data.data.token);

      if (data.data.user.requires2FA) {
        router.push(`/affiliate/verify-2fa?playerId=${data.data.user.id}`);
      } else {
        router.push('/affiliate/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [formData, router, validateForm]);

  // Handle Enter key press
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !loading) {
        handleLogin();
      }
    },
    [handleLogin, loading]
  );

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        overflow: 'hidden',
        bgcolor: '#f5f7fa',
      }}
    >
      {/* Left Side - Form Section */}
      <Box
        sx={{
          width: { xs: '100%', md: '40%' },
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          p: 4,
          bgcolor: 'white',
          overflowY: 'auto',
        }}
      >
        <Box sx={{ maxWidth: 400, width: '100%', mx: 'auto' }}>
          <Stack spacing={3} alignItems="center" sx={{ mb: 4 }}>
            <Box
              component="img"
              src="/assets/icons/BastaLogo.svg"
              alt="BASTA Casino Logo"
              sx={{ width: 150, height: 'auto' }}
            />
            <Typography variant="h4" fontWeight="bold">
              Affiliate Login
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center">
              Welcome to the BASTA Casino Affiliate Program
            </Typography>
          </Stack>

          <Stack spacing={3}>
            {error && (
              <Alert severity="error" sx={{ borderRadius: 1 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              name="email"
              label="Email address"
              value={formData.email}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              error={touched.email && (!formData.email || !!fieldErrors.email)}
              helperText={
                (touched.email && !formData.email && 'Email is required') || fieldErrors.email || ''
              }
              disabled={loading}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  backgroundColor: '#f8f9fa',
                },
              }}
            />

            <TextField
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              error={touched.password && (!formData.password || !!fieldErrors.password)}
              helperText={
                (touched.password && !formData.password && 'Password is required') ||
                fieldErrors.password ||
                ''
              }
              disabled={loading}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  backgroundColor: '#f8f9fa',
                },
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Link
                href="/affiliate/forget-password"
                variant="body2"
                color="text.secondary"
                sx={{
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Forgot password?
              </Link>
            </Box>

            <LoadingButton
              fullWidth
              size="large"
              variant="contained"
              onClick={handleLogin}
              loading={loading}
              disabled={!formData.email || !formData.password}
              sx={{
                py: 1.5,
                borderRadius: 1,
                textTransform: 'none',
                fontWeight: 'medium',
                fontSize: '1rem',
              }}
            >
              Login
            </LoadingButton>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <Typography variant="body2" color="text.secondary" textAlign="center">
              Don't have an account?{' '}
              <Link
                href="/affiliate/register"
                variant="subtitle2"
                color="primary"
                sx={{ '&:hover': { textDecoration: 'underline' } }}
              >
                Sign up
              </Link>
            </Typography>
          </Stack>
        </Box>
      </Box>

      {/* Right Side - Promotional Section */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: '60%',
          height: '100%',
          p: 6,
          bgcolor: '#f0f4f8',
          overflowY: 'auto',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Stack spacing={4}>
          <Typography variant="h3" fontWeight="bold" color="primary">
            Recommend Games. Earn Commissions.
          </Typography>

          <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
            Welcome to one of the largest affiliate programs in the online casino industry. The
            BASTA Casino Affiliate Program helps content creators, bloggers, and influencers
            monetize their traffic.
          </Typography>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={4}>
              <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2, height: '100%' }}>
                <Typography variant="h5" color="primary" gutterBottom>
                  1. Sign up
                </Typography>
                <Typography variant="body2">
                  Join thousands of affiliates earning with the BASTA Casino Affiliate Program.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2, height: '100%' }}>
                <Typography variant="h5" color="primary" gutterBottom>
                  2. Recommend
                </Typography>
                <Typography variant="body2">
                  Share thousands of casino games with your audience using our customized linking
                  tools.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2, height: '100%' }}>
                <Typography variant="h5" color="primary" gutterBottom>
                  3. Earn
                </Typography>
                <Typography variant="body2">
                  Earn up to 40% commission on player deposits and sign-ups with our competitive
                  rates.
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2, mt: 2 }}>
            <Typography variant="body1" fontStyle="italic">
              "Since we have a global audience, the BASTA Affiliate Program has helped us scale our
              earnings internationally. It's been simple to sign up and use!" - CasinoBlog
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
