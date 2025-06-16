import { Helmet } from 'react-helmet-async';
import { useState, useCallback } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Link,
  Alert,
  Stack,
  Divider,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

// Type definitions
interface LoginFormData {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      email: string;
      firstname?: string;
      lastname?: string;
      status: 'Active' | 'Inactive' | 'Banned';
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
    // Trim spaces from email and password
    const trimmedValue = name === 'email' || name === 'password' ? value.trim() : value;
    setFormData((prev) => ({ ...prev, [name]: trimmedValue }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    setError('');
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  // Validate form
  const validateForm = useCallback(() => {
    if (!formData.email) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Invalid email format';
    if (!formData.password) return 'Password is required';
    if (formData.password.includes(' ')) return 'Password cannot contain spaces';
    return '';
  }, [formData]);

  // Handle login
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
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}:${
        import.meta.env.VITE_API_PORT
      }/api/auth/affiliate-login`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password.trim(),
        }),
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

      router.push('/affiliate/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [formData, router, validateForm]);

  // Handle key press
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !loading) {
        handleLogin();
      }
    },
    [handleLogin, loading]
  );

  return (
    <>
      {' '}
      <Helmet>
        <title>Affiliate | Login</title>
      </Helmet>
      <Box
        sx={{
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            width: { xs: '100%' },
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            bgcolor: 'white',
            overflow: 'auto',
          }}
        >
          <Box>
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
              <Typography
                variant="body1"
                sx={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  background: '#000',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  mb: 1,
                }}
              >
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
                  (touched.email && !formData.email && 'Email is required') ||
                  fieldErrors.email ||
                  ''
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
                Don&apos;t have an account?{' '}
                <Link
                  href="https://bastaxcasino.com/affiliate-registeration"
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
      </Box>
    </>
  );
}
