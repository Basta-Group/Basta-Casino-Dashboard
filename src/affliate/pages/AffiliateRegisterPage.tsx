import { useState, useCallback } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Link, Alert, TextField, Typography } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

export default function AffiliateRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    phone_number: '',
    fullname: '',
  });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  const handleRegister = useCallback(async () => {
    if (!formData.email || !formData.password || !formData.username) {
      setError('Please fill in all required fields (email, password, username)');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}:${import.meta.env.VITE_API_PORT}/api/auth/affiliate/register`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      localStorage.setItem('affiliateToken', data.data.token);
      router.push('/affiliate/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  }, [formData, router]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box>
        <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
          <Typography variant="h5">Affiliate Registration</Typography>
          <Typography variant="body2" color="text.secondary">
            Create your affiliate account
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          name="email"
          label="Email address *"
          value={formData.email}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          name="username"
          label="Username *"
          value={formData.username}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          name="password"
          label="Password *"
          value={formData.password}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          type="password"
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          name="phone_number"
          label="Phone Number (optional)"
          value={formData.phone_number}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          name="fullname"
          label="Full Name (optional)"
          value={formData.fullname}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />

        <LoadingButton
          fullWidth
          size="large"
          color="inherit"
          variant="contained"
          onClick={handleRegister}
          loading={loading}
          sx={{ mt: 1 }}
        >
          Register
        </LoadingButton>

        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 2 }}>
          Already have an account?{' '}
          <Link href="/affiliate/login" variant="subtitle2">
            Log in
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
