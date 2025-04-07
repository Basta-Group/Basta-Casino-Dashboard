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
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

type PaymentMode = 'test' | 'live';

interface PaymentConfig {
  id: string;
  paymentMethodId: number;
  name: string;
  config: Record<string, string>;
  mode: PaymentMode;
  isActive: boolean;
}

export function PaymentView() {
  const [paymentConfigs, setPaymentConfigs] = useState<PaymentConfig[]>([]);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Stripe-inspired color palette
  const colors = {
    primary: '#6772e5',
    primaryLight: '#b2b7f1',
    primaryDark: '#5469d4',
    secondary: '#6b7c93',
    secondaryLight: '#e1e3e8',
    success: '#32CD32',
    successLight: 'rgba(50, 205, 50, 0.1)',
    warning: '#FFA500',
    warningLight: 'rgba(255, 165, 0, 0.1)',
    error: '#e25959',
    textPrimary: '#1a1a1a',
    textSecondary: '#6b7c93',
    background: '#f9fafb',
  };

  useEffect(() => {
    const fetchPaymentConfigs = async () => {
      try {
        const apiUrl = `${env.api.baseUrl}:${env.api.port}/api/auth/payment-configs/all`;
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch payment configurations');
        }

        const data = await response.json();

        if (data.success) {
          setPaymentConfigs(data.data);

          const initialShowPassword: Record<string, boolean> = {};
          data.data.forEach((config: PaymentConfig) => {
            Object.keys(config.config).forEach((key) => {
              initialShowPassword[`${config.id}-${key}`] = false;
            });
          });
          setShowPassword(initialShowPassword);
        } else {
          setError(data.message || 'Failed to fetch payment configurations');
        }
      } catch (err) {
        console.error('Error fetching payment configs:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'An error occurred while fetching payment configurations'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentConfigs();
  }, []);

  const handleCopy = (configId: string, key: string) => {
    const config = paymentConfigs.find((c) => c.id === configId);
    if (config) {
      navigator.clipboard.writeText(config.config[key]);
      setCopiedField(`${config.id}-${key}`);
      setTimeout(() => setCopiedField(null), 1500);
    }
  };

  const handleModeChange = (configId: string, isTestMode: boolean) => {
    setPaymentConfigs((prev) =>
      prev.map((config) =>
        config.id === configId ? { ...config, mode: isTestMode ? 'test' : 'live' } : config
      )
    );
  };

  const handleToggleChange = (configId: string, newIsActive: boolean) => {
    setPaymentConfigs((prev) =>
      prev.map((config) => (config.id === configId ? { ...config, isActive: newIsActive } : config))
    );
  };

  const handleSubmit = async (configId: string) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const configToUpdate = paymentConfigs.find((c) => c.id === configId);
      if (!configToUpdate) {
        throw new Error('Configuration not found');
      }

      const apiUrl = `${env.api.baseUrl}:${env.api.port}/api/auth/payment-configs/${configId}`;
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          mode: configToUpdate.mode,
          isActive: configToUpdate.isActive,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update payment configuration');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to update payment configuration');
      }

      setSuccess(`Payment configuration for ${configToUpdate.name} updated successfully!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred while saving payment details'
      );
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredConfigFields = (config: PaymentConfig) =>
    Object.entries(config.config).filter(([key]) => {
      if (!['stripe', 'bastapay'].includes(config.name)) {
        return true;
      }

      const isTestField = key.toLowerCase().includes('test');
      return (config.mode === 'test' && isTestField) || (config.mode === 'live' && !isTestField);
    });

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
          <Typography variant="h4" sx={{ fontWeight: 700, color: colors.textPrimary }}>
            Payment Configurations
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ width: '100%', mb: 3, borderRadius: 2 }}>
            {success}
          </Alert>
        )}

        {loading && paymentConfigs.length === 0 ? (
          <Box display="flex" justifyContent="center" sx={{ py: 4 }}>
            <Typography>Loading payment configurations...</Typography>
          </Box>
        ) : (
          paymentConfigs.map((config) => (
            <Box key={config.id} display="flex" flexDirection="column" sx={{ mb: 6 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: colors.textPrimary }}>
                  {config.name.charAt(0).toUpperCase() + config.name.slice(1)}
                </Typography>
                <Chip
                  label={config.mode.toUpperCase()}
                  variant="outlined"
                  sx={{
                    backgroundColor:
                      config.mode === 'live' ? colors.successLight : colors.warningLight,
                    borderColor: config.mode === 'live' ? colors.success : colors.warning,
                    color: config.mode === 'live' ? colors.success : colors.warning,
                    fontWeight: 600,
                  }}
                />
              </Box>

              {/* Combined Toggles */}
              <Stack direction="row" spacing={4} sx={{ mb: 4 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={config.mode === 'test'}
                      onChange={(e) => handleModeChange(config.id, e.target.checked)}
                      size="medium"
                      disabled={loading}
                      sx={{
                        '& .MuiSwitch-thumb': {
                          backgroundColor:
                            config.mode === 'test' ? colors.primary : colors.secondary,
                        },
                        '& .MuiSwitch-track': {
                          backgroundColor:
                            config.mode === 'test' ? colors.primaryLight : colors.secondaryLight,
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: '1rem', color: colors.textPrimary }}>
                      Test Mode
                    </Typography>
                  }
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={config.isActive}
                      onChange={(e) => handleToggleChange(config.id, e.target.checked)}
                      size="medium"
                      disabled={loading}
                      sx={{
                        '& .MuiSwitch-thumb': {
                          backgroundColor: config.isActive ? colors.primary : colors.secondary,
                        },
                        '& .MuiSwitch-track': {
                          backgroundColor: config.isActive
                            ? colors.primaryLight
                            : colors.secondaryLight,
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: '1rem', color: colors.textPrimary }}>
                      {config.isActive ? 'Enabled' : 'Disabled'}
                    </Typography>
                  }
                />
              </Stack>

              {/* Filtered Config Fields */}
              {getFilteredConfigFields(config).map(([key, value]) => (
                <TextField
                  key={`${config.id}-${key}`}
                  fullWidth
                  label={key.replace(/_/g, ' ').replace(/(?:^|\s)\S/g, (a) => a.toUpperCase())}
                  value={value || ''}
                  InputLabelProps={{
                    shrink: true,
                    sx: {
                      color: colors.textPrimary,
                      fontSize: '1rem',
                      fontWeight: 500,
                    },
                  }}
                  type={showPassword[`${config.id}-${key}`] ? 'text' : 'password'}
                  InputProps={{
                    sx: {
                      fontSize: '1rem',
                      bgcolor: colors.background,
                      borderRadius: 1.5,
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title={showPassword[`${config.id}-${key}`] ? 'Hide' : 'Show'}>
                          <IconButton
                            onClick={() =>
                              setShowPassword((prev) => ({
                                ...prev,
                                [`${config.id}-${key}`]: !prev[`${config.id}-${key}`],
                              }))
                            }
                            edge="end"
                            sx={{ p: 1 }}
                          >
                            <Iconify
                              icon={
                                showPassword[`${config.id}-${key}`]
                                  ? 'solar:eye-bold'
                                  : 'solar:eye-closed-bold'
                              }
                              width={20}
                              color={colors.textSecondary}
                            />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title={copiedField === `${config.id}-${key}` ? 'Copied!' : 'Copy'}>
                          <IconButton
                            onClick={() => handleCopy(config.id, key)}
                            edge="end"
                            sx={{ p: 1 }}
                          >
                            <Iconify
                              icon={
                                copiedField === `${config.id}-${key}`
                                  ? 'solar:check-bold'
                                  : 'solar:copy-bold'
                              }
                              width={20}
                              color={
                                copiedField === `${config.id}-${key}`
                                  ? colors.success
                                  : colors.textSecondary
                              }
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

              <LoadingButton
                fullWidth
                size="large"
                variant="contained"
                onClick={() => handleSubmit(config.id)}
                loading={loading}
                disabled={loading}
                sx={{
                  mt: 2,
                  backgroundColor: colors.primary,
                  '&:hover': {
                    backgroundColor: colors.primaryDark,
                  },
                  '&.Mui-disabled': {
                    backgroundColor: colors.secondaryLight,
                    color: colors.secondary,
                  },
                }}
              >
                Save {config.name} Configuration
              </LoadingButton>
            </Box>
          ))
        )}
      </Box>

      <Divider sx={{ my: 4, '&::before, &::after': { borderTopStyle: 'dashed' } }} />
    </>
  );
}
