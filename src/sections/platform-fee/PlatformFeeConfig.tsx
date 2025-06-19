import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Switch,
  Button,
  Grid,
  FormControlLabel,
  Alert,
} from '@mui/material';
import { env } from 'src/config/env.config';

export default function PlatformFeeConfig() {
  const [config, setConfig] = useState({
    fee_percentage: 0,
    is_active: false,
    min_fee_amount: 0,
    max_fee_amount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchConfig = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${env.api.baseUrl}:${env.api.port}/api/platform-fee/config`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setConfig(data.data);
        else setError(data.error || 'Failed to fetch config');
      } catch (e) {
        setError('Failed to fetch config');
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({
      ...config,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    });
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${env.api.baseUrl}:${env.api.port}/api/platform-fee/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (data.success) setSuccess('Platform fee configuration updated!');
      else setError(data.error || 'Failed to update config');
    } catch (e) {
      setError('Failed to update config');
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Platform Fee Configuration
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Fee Percentage (%)"
              name="fee_percentage"
              type="number"
              value={config.fee_percentage}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Min Fee Amount"
              name="min_fee_amount"
              type="number"
              value={config.min_fee_amount}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Max Fee Amount"
              name="max_fee_amount"
              type="number"
              value={config.max_fee_amount}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControlLabel
              control={
                <Switch checked={config.is_active} name="is_active" onChange={handleChange} />
              }
              label="Active"
            />
          </Grid>
        </Grid>
        <Button variant="contained" sx={{ mt: 2 }} onClick={handleSave} disabled={loading}>
          Save
        </Button>
      </CardContent>
    </Card>
  );
}
