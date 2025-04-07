// src/affiliate/pages/login.tsx
import { useState, useCallback } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Divider,
  InputAdornment,
  IconButton,
  Alert,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Iconify } from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';

export default function AffiliateLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  const handleLogin = useCallback(async () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const apiUrl = '/api/affiliate/login'; // Replace with actual endpoint
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (!data.token) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('affiliateToken', data.token);
      router.push('/affiliate/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  }, [formData, router]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <Box
        sx={{
          maxWidth: 400,
          width: '100%',
          border: '1px solid',
          borderColor: 'grey.300',
          borderRadius: 1,
          p: 3,
          bgcolor: 'background.paper',
        }}
      >
        <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
          <Typography variant="h5">Affiliate Login</Typography>
          <Typography variant="body2" color="text.secondary">
            Enter your credentials to access your affiliate account
          </Typography>
        </Box>

        <Box display="flex" flexDirection="column" alignItems="flex-end">
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            name="email"
            label="Email address"
            value={formData.email}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            name="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <Link
            href="http://localhost:3001/affiliate/forget-password"
            variant="body2"
            color="inherit"
            sx={{ mb: 3 }}
          >
            Forgot password?
          </Link>

          <LoadingButton
            fullWidth
            size="large"
            color="inherit"
            variant="contained"
            onClick={handleLogin}
            loading={loading}
            sx={{ mt: 1 }}
          >
            Login
          </LoadingButton>
        </Box>

        <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>

        <Typography variant="body2" color="text.secondary" textAlign="center">
          Don&apos;t have an account?{' '}
          <Link href="/affiliate/register" variant="subtitle2">
            Sign up
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
