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

  useEffect(() => {
    const fetchStripeConfig = async () => {
      try {
        const apiUrl = `${env.api.baseUrl}:${env.api.port}/api/auth/stripe-config-details`;
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
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
  }, []);

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
          maxWidth: 400,
          minWidth: { xs: 'auto', sm: 400 },
          margin: 'auto',
          mt: 10,
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: '#fff',
        }}
      >
        <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
          <Typography variant="h5">Payment Details</Typography>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="flex-end">
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}
          {Object.keys(stripeKeys).map((field) => (
            <TextField
              key={field}
              fullWidth
              label={field}
              value={stripeKeys[field as keyof typeof stripeKeys]}
              InputLabelProps={{ shrink: true, sx: { color: 'text.primary' } }}
              type={showPassword[field] ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }))
                      }
                      edge="end"
                    >
                      <Iconify
                        icon={showPassword[field] ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                      />
                    </IconButton>
                    <Tooltip title={copiedField === field ? 'Copied!' : 'Copy'}>
                      <IconButton onClick={() => handleCopy(field)} edge="end">
                        <Iconify
                          icon={copiedField === field ? 'solar:check-bold' : 'solar:copy-bold'}
                          color={copiedField === field ? 'green' : 'inherit'}
                        />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
                readOnly: true,
              }}
              sx={{ mb: 3 }}
            />
          ))}
          <FormControlLabel
            control={
              <Switch checked={toggleState} onChange={(e) => setToggleState(e.target.checked)} />
            }
            label={toggleState ? 'Live' : 'Test'}
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

      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }} />
    </>
  );
}
