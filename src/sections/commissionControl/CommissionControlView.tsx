import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, TextField, Typography } from '@mui/material';
import axios, { AxiosError } from 'axios';
import { env } from 'src/config/env.config';

interface CommissionData {
  commissionRate: number;
  currency: string;
}

interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

interface ApiErrorResponse {
  success: false;
  error?: string;
  errors?: Array<{ param?: string; message: string }>;
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

const CommissionControlView: React.FC = () => {
  const [commission, setCommission] = useState('');
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [token] = useState(localStorage.getItem('accessToken'));

  const apiUrl = `${env.api.baseUrl}:${env.api.port}/api/auth/admin/commission`;

  useEffect(() => {
    const fetchCommission = async () => {
      if (!token) {
        setError('Authentication token is missing');
        return;
      }

      try {
        const response = await axios.get<ApiResponse<CommissionData>>(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setCommission(response.data.data.commissionRate.toString());
          setError('');
        } else {
          setError(response.data.error || 'Failed to fetch commission rate');
        }
      } catch (fetchError) {
        const err = fetchError as AxiosError<ApiErrorResponse>;
        setError(err.response?.data?.error || 'Failed to fetch commission rate');
        console.error('Error fetching commission:', fetchError);
      }
    };

    fetchCommission();
  }, [token, apiUrl]);

  const handleSave = async () => {
    const percentage = parseFloat(commission);

    if (Number.isNaN(percentage) || percentage < 0 || percentage > 4) {
      setError('Commission must be between 0% and 4%');
      setSaveStatus(null);
      return;
    }

    if (!token) {
      setError('Authentication token is missing');
      setSaveStatus(null);
      return;
    }

    try {
      const response = await axios.post<ApiResponse<CommissionData>>(
        apiUrl,
        { commission: percentage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setError('');
        setSaveStatus('Commission saved successfully');
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setError(response.data.error || 'Failed to save commission');
        setSaveStatus(null);
      }
    } catch (saveError) {
      const err = saveError as AxiosError<ApiErrorResponse>;
      setError(err.response?.data?.error || 'Failed to save commission');
      setSaveStatus(null);
      console.error('Error saving commission:', saveError);
    }
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

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            onClick={handleSave}
            disabled={!token}
          >
            Save
          </Button>

          {saveStatus && (
            <Typography
              color={saveStatus.includes('successfully') ? 'success.main' : 'error'}
              sx={{ mt: 2, textAlign: 'center' }}
            >
              {saveStatus}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default CommissionControlView;
