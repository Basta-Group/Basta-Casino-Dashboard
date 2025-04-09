import React, { useState } from 'react';
import { Box, Button, Card, CardContent, TextField, Typography } from '@mui/material';

const CommissionControlView: React.FC = () => {
  const [commission, setCommission] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    const percentage = parseFloat(commission);

    // Updated validation logic
    if (Number.isNaN(percentage) || percentage < 0 || percentage > 4) {
      setError('Commission must be between 0% and 4% only');
      return;
    }

    setError('');
    console.log('Commission saved:', percentage);
    // TODO: Save the value (API/local state)
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
      sx={{ background: 'linear-gradient(to bottom right, #f0f4f8, #ffffff)' }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', borderRadius: 3, p: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
            Set Commission
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" mb={3}>
            Define commission percentage for affiliates on successful referral
          </Typography>

          <TextField
            label="Commission (%)"
            type="number"
            fullWidth
            value={commission}
            onChange={(e) => setCommission(e.target.value)}
            error={!!error}
            helperText={error}
            inputProps={{ min: 0, max: 4, step: 0.1 }}
          />

          <Button fullWidth variant="contained" sx={{ mt: 3 }} onClick={handleSave}>
            Save
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CommissionControlView;
