import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import { env } from 'src/config/env.config';

interface SignInFormData {
  email: string;
  password: string;
}

interface SignInResponse {
  success: boolean;
  message?: string;
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

export function SignInView() {
  const router = useRouter();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<SignInFormData>({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });

  // Handle input change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    setError('');
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  // Client-side validation
  const validateForm = useCallback(() => {
    if (!formData.email) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Invalid email format';
    if (!formData.password) return 'Password is required';
    return '';
  }, [formData]);

  // Handle sign-in submission
  const handleSignIn = useCallback(async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    setFieldErrors({});

    try {
      const apiUrl = `${env.api.baseUrl}:${env.api.port}/api/auth/login`;
      const requestData = { ...formData, role_id: 1 }; // Role 1 for admin

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const data: SignInResponse = await response.json();

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
        throw new Error(data.message || 'Login failed');
      }

      if (!data.data?.user || !data.data?.token) {
        throw new Error('Invalid response from server');
      }

      if (data.data.user.role !== 1) {
        throw new Error('Access denied. Admin access only.');
      }

      localStorage.setItem('accessToken', data.data.token);

      if (data.data.user.requires2FA) {
        router.push(`/verify-2fa?playerId=${data.data.user.id}`);
      } else {
        router.push('/');
      }
    } catch (err) {
      console.error('Sign-in error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [formData, router, validateForm]);

  // Handle Enter key press
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !loading) {
        handleSignIn();
      }
    },
    [handleSignIn, loading]
  );

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        p: 2,
      }}
    >
      <Box
        sx={{
          width: '100%',
        }}
      >
        <Stack spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Typography variant="h5" component="h1" fontWeight="bold">
            Admin Sign In
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            Enter your admin credentials to access
            <br />
            the dashboard
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
              href="/forgot-password"
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
            onClick={handleSignIn}
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
            Sign In
          </LoadingButton>
        </Stack>
      </Box>
    </Box>
  );
}
