import { env } from 'src/config/env.config';
import { useState, useCallback } from 'react';
import { Box, Link, Divider, TextField, Typography, Alert } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useRouter } from 'src/routes/hooks';

export default function AffiliateForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      setError('');    
       const apiUrl = `${env.api.baseUrl}:${env.api.port}/api/auth/affiliate/forgot-password`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset link');
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [email]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <Box
        sx={{
          width: '100%',
          borderRadius: 1,
        }}
      >
        <Box gap={1.5} display="flex" flexDirection="column" alignItems="center">
          <Box
            component="img"
            src="/assets/icons/BastaLogo.svg"
            alt="BASTA Casino Logo"
            sx={{ width: 150, height: 'auto', mb: 2 }}
          />
          <Typography sx={{ mb: 2 }} variant="h5">
            Forgot Password
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Enter your email address to receive a password reset link
          </Typography>
        </Box>

        <Box display="flex" flexDirection="column" alignItems="flex-end" mt={2}>
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          {submitted ? (
            <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
              If your email is registered, you will receive a reset link.
            </Alert>
          ) : (
            <>
              <TextField
                fullWidth
                name="email"
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                Send Reset Link
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
