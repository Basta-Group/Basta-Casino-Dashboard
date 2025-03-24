import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';

import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import { env } from 'src/config/env.config';

export function SignInView() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = useCallback((e:any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  const handleSignIn = useCallback(async () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const apiUrl = `${env.api.baseUrl}:${env.api.port}/api/auth/login`;
      const requestData = { ...formData, role_id: 1 };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      console.log("==data==",data)

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (!data.data?.user || !data.data?.token) {
        throw new Error('Invalid response from server');
      }

      if (data.data.user.role !== 1) {
        throw new Error('Access denied. Admin access only.');
      }

      localStorage.setItem('accessToken', data.data.token);
      router.push('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  }, [formData, router]);

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Sign in</Typography>
      </Box>

      <Box display="flex" flexDirection="column" alignItems="flex-end">
        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
        <TextField
          fullWidth
          name="email"
          label="Email address"
          value={formData.email}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 3 }}
        />
        <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
          Forgot password?
        </Link>
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
          sx={{ mb: 3 }}
        />
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          color="inherit"
          variant="contained"
          onClick={handleSignIn}
          loading={loading}
        >
          Sign in
        </LoadingButton>
      </Box>

      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }} />
    </>
  );
}
