// src/affiliate/pages/reset-password.tsx
import { env } from 'src/config/env.config';
import { useState, useCallback, useEffect } from 'react';
import { Box, Link, Divider, TextField, Typography, Alert } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useRouter } from 'src/routes/hooks';

export default function AffiliateResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromURL = urlParams.get('token');
    if (tokenFromURL) {
      setToken(tokenFromURL);
    } else {
      setError('Invalid or missing token');
    }
  }, []);
  

  const handleSubmit = useCallback(async () => {
    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).{8,}$/;

    if (!passwordRegex.test(password)) {
      setError(
        'Password must contain uppercase, lowercase, number, special character and be at least 8 characters long'
      );
      return;
    }

    try {
      setLoading(true);
      setError('');
      const apiUrl = `${env.api.baseUrl}:${env.api.port}/api/auth/affiliate/reset-password`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setSuccess(true);
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [token,password, confirmPassword]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <Box sx={{ width: '100%', borderRadius: 1 }}>
        <Box gap={1.5} display="flex" flexDirection="column" alignItems="center">
          <Box
            component="img"
            src="/assets/icons/BastaLogo.svg"
            alt="BASTA Casino Logo"
            sx={{ width: 150, height: 'auto', mb: 2 }}
          />
          <Typography sx={{ mb: 2 }} variant="h5">
            Reset Password
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Enter a new password to reset your account
          </Typography>
        </Box>

        <Box display="flex" flexDirection="column" alignItems="flex-end" mt={2}>
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          {success ? (
            <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
              Password reset successful. You can now log in.
            </Alert>
          ) : (
            <>
              <TextField
                fullWidth
                name="password"
                label="New Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 3 }}
              />
              <LoadingButton
                fullWidth
                size="large"
                color="inherit"
                variant="contained"
                onClick={handleSubmit}
                loading={loading}
              >
                Reset Password
              </LoadingButton>
            </>
          )}

          <Divider
            sx={{ my: 1, width: '100%', '&::before, &::after': { borderTopStyle: 'dashed' } }}
          />

          <Link
            variant="body2"
            onClick={() => router.push('/affiliate/login')}
            color="primary"
            sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          >
            Back to Login
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
