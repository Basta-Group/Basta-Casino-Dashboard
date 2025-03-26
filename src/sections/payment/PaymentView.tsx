import { useState } from 'react';
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

// Static Stripe Values
const STRIPE_KEYS = {
  STRIPE_SECRET_KEY:
    'sk_test_51Qw1igE7CXYLgkTBDVuP77zjBnOOux7sSLVbyAVi2q0uAf6GlD0iiQFG83x48KgxXqGPC3a9z5Oog2WqGVSIQX3600ESGfEqtT',
  STRIPE_PUBLISHABLE_KEY:
    'pk_test_51Qw1igE7CXYLgkTBsyWZ3Y8gUzfhndEhimzCwooXP5ezrHRMYfa4HubtadP7qvdlkAQgvxeihk3p0gZxkMBP5DtT009X5HePww',
  STRIPE_WEBHOOK_SECRET: 'whsec_ufjNpeZOxaXG8s9p7N8ljxJcxmZ410OQ',
};

export function PaymentView() {
  const [showPassword, setShowPassword] = useState({
    STRIPE_SECRET_KEY: false,
    STRIPE_PUBLISHABLE_KEY: false,
    STRIPE_WEBHOOK_SECRET: false,
  });

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [toggleState, setToggleState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(STRIPE_KEYS[key as keyof typeof STRIPE_KEYS]);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 1500); // Reset copied state after 1.5s
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      setTimeout(() => {
        console.log('Payment Details:', STRIPE_KEYS);
        console.log('Toggle State:', toggleState ? 'Live' : 'Test');
        setLoading(false);
      }, 2000);
    } catch (err) {
      setError('An error occurred while saving payment details');
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

          {Object.keys(STRIPE_KEYS).map((field) => (
            <TextField
              key={field}
              fullWidth
              label={field}
              value={STRIPE_KEYS[field as keyof typeof STRIPE_KEYS]}
              InputLabelProps={{ shrink: true, sx: { color: 'text.primary' } }}
              type={showPassword[field as keyof typeof showPassword] ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {/* Toggle Password Visibility */}
                    <IconButton
                      onClick={() =>
                        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }))
                      }
                      edge="end"
                    >
                      <Iconify
                        icon={
                          showPassword[field as keyof typeof showPassword]
                            ? 'solar:eye-bold'
                            : 'solar:eye-closed-bold'
                        }
                      />
                    </IconButton>

                    {/* Copy to Clipboard */}
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

          {/* Toggle Switch */}
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
      </Box>

      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }} />
    </>
  );
}
