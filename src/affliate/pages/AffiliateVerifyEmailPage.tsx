import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';

const VerifyContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
}));

const MessageBox = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  maxWidth: '500px',
  width: '100%',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const ResendButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  '&:disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
}));

const BackButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  color: theme.palette.text.primary,
}));

export default function AffiliateVerifyEmailPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Function to verify the email token
  const verifyEmailToken = useCallback(async (token: string) => {
    setIsVerifying(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/verify-affiliate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid or expired token');
      }

      const data = await response.json();
      setEmail(data.email || 'your email'); // Fallback if email not returned
      setMessage('Email verified successfully! Redirecting to dashboard...');
      setTimeout(() => navigate('/affiliate/dashboard'), 2000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to verify email. The token may be invalid or expired.';
      setMessage(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  }, [navigate]);

  // Extract token and fetch email on mount
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');

    if (!token) {
      setMessage('Invalid or missing verification token. Please check the link or request a new one.');
      return;
    }

    // Verify the token
    verifyEmailToken(token);
  }, [location, verifyEmailToken]);

  const handleResendEmail = async () => {
    if (!email) {
      setMessage('Email address not available. Please try registering again.');
      return;
    }

    setIsResending(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/resend-verification-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, isAffiliate: true }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to resend email');
      }

      setMessage('Verification email resent successfully. Please check your inbox and spam/junk folder.');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend email. Please try again later.';
      setMessage(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <VerifyContainer>
      <MessageBox>
        <Typography variant="h5" gutterBottom>
          Verify Your Email
        </Typography>
        {isVerifying ? (
          <Box display="flex" justifyContent="center" my={2}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {email ? (
                <>
                  We&apos;ve sent a verification link to <strong>{email}</strong>. Please check your inbox
                  (and spam/junk folder) to verify your email address.
                </>
              ) : (
                'Verifying your email address...'
              )}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Didn&apos;t receive the email?
            </Typography>
            <ResendButton
              variant="contained"
              onClick={handleResendEmail}
              disabled={isResending || !email}
              startIcon={isResending ? <CircularProgress size={20} /> : null}
              aria-label="Resend verification email"
            >
              {isResending ? 'Resending...' : 'Resend Email'}
            </ResendButton>
            {message && (
              <Typography
                variant="body2"
                color={message.includes('successfully') ? 'success.main' : 'error.main'}
                sx={{ mt: 2 }}
                role="alert"
              >
                {message}
              </Typography>
            )}
            <BackButton
              variant="text"
              onClick={() => navigate('/affiliate/login')}
              aria-label="Back to login"
            >
              Back to Login
            </BackButton>
          </>
        )}
      </MessageBox>
    </VerifyContainer>
  );
}