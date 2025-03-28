import { useState, useEffect } from 'react';
import { env } from 'src/config/env.config';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Tooltip from '@mui/material/Tooltip';
import { Iconify } from 'src/components/iconify';

export function PaymentView() {
  const [stripeKeys, setStripeKeys] = useState({
    stripeSecretKey: '',
    stripePublishableKey: '',
    stripeWebhookSecret: '',
  });
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({
    stripeSecretKey: false,
    stripePublishableKey: false,
    stripeWebhookSecret: false,
  });
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [toggleState, setToggleState] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [token, setToken] = useState(localStorage.getItem('accessToken'));

  useEffect(() => {
    const fetchStripeConfig = async () => {
      try {
        const apiUrl = `${env.api.baseUrl}:${env.api.port}/api/auth/stripe-config-details`;
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          const { stripeSecretKey, stripePublishableKey, stripeWebhookSecret, stripeMode } =
            data.data;
          setStripeKeys({ stripeSecretKey, stripePublishableKey, stripeWebhookSecret });
          setToggleState(stripeMode === 1);
        } else {
          setError('Failed to fetch Stripe configuration');
        }
      } catch (err) {
        console.error('Error fetching Stripe details:', err);
        setError('An error occurred while fetching Stripe details');
      } finally {
        setLoading(false);
      }
    };
    fetchStripeConfig();
  }, [token]);

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(stripeKeys[key as keyof typeof stripeKeys]);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      const stripeMode = toggleState ? 1 : 0;
      const apiUrl = `${env.api.baseUrl}:${env.api.port}/api/auth/stripe-config-details`;

      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stripeMode }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error('Failed to update Stripe configuration');
      }

      setSuccess('Stripe configuration updated successfully!');

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('An error occurred while saving payment details');

      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          maxWidth: 480,
          minWidth: { xs: 'auto', sm: 480 },
          margin: 'auto',
          mt: 1,
          p: 4,
          boxShadow: 4,
          borderRadius: 3,
          bgcolor: '#fff',
        }}
      >
        <Box gap={2} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Stripe Details
          </Typography>
        </Box>

        <Box display="flex" flexDirection="column" alignItems="center">
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}
          {Object.keys(stripeKeys).map((field) => (
            <TextField
              key={field}
              fullWidth
              label={field}
              value={stripeKeys[field as keyof typeof stripeKeys]}
              InputLabelProps={{
                shrink: true,
                sx: {
                  color: 'text.primary',
                  fontSize: '1.1rem',
                  fontWeight: 500,
                },
              }}
              type={showPassword[field] ? 'text' : 'password'}
              InputProps={{
                sx: {
                  fontSize: '1.1rem',
                  bgcolor: '#f9fafb',
                  borderRadius: 1.5,
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }))
                      }
                      edge="end"
                      sx={{ p: 1 }}
                    >
                      <Iconify
                        icon={showPassword[field] ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                        width={24}
                      />
                    </IconButton>

                    <Tooltip title={copiedField === field ? 'Copied!' : 'Copy'}>
                      <IconButton onClick={() => handleCopy(field)} edge="end" sx={{ p: 1 }}>
                        <Iconify
                          icon={copiedField === field ? 'solar:check-bold' : 'solar:copy-bold'}
                          width={24}
                          color={copiedField === field ? 'success.main' : 'text.secondary'}
                        />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
                readOnly: true,
              }}
              sx={{ mb: 4 }}
            />
          ))}
          <FormControlLabel
            control={
              <Switch
                checked={toggleState}
                onChange={(e) => setToggleState(e.target.checked)}
                size="medium"
              />
            }
            label={
              <Typography sx={{ fontSize: '1.1rem', color: 'text.primary' }}>
                {toggleState ? 'Live' : 'Test'}
              </Typography>
            }
            sx={{ mb: 4 }}
          />
          <LoadingButton
            fullWidth
            size="large"
            color="inherit"
            variant="contained"
            onClick={handleSubmit}
            loading={loading}
          >
            Save Payment Details
          </LoadingButton>
        </Box>
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
            {success}
          </Alert>
        )}
      </Box>

      <Divider sx={{ my: 4, '&::before, &::after': { borderTopStyle: 'dashed' } }} />
    </>
  );
}
