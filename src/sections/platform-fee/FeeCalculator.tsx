import { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Alert, Grid } from '@mui/material';
import { env } from 'src/config/env.config';

export default function FeeCalculator() {
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('accessToken');

  const handleCalculate = async () => {
    setError(null); setResult(null); setLoading(true);
    try {
      const res = await fetch(`${env.api.baseUrl}:${env.api.port}/api/platform-fee/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      });
      const data = await res.json();
      if (data.success) setResult(data.data);
      else setError(data.error || 'Calculation failed');
    } catch (e) {
      setError('Calculation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Fee Calculator</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField label="Amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button variant="contained" onClick={handleCalculate} disabled={loading || !amount}>Calculate</Button>
          </Grid>
        </Grid>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {result && (
          <Alert severity="success" sx={{ mt: 2 }}>
            <div>Fee: <b>{result.fee_amount}</b></div>
            <div>Net Amount: <b>{result.net_amount}</b></div>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
} 