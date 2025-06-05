import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  InputAdornment,
  Snackbar,
  IconButton,
  Divider,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Iconify } from 'src/components/iconify';
import axios from 'axios';
import { env } from 'src/config/env.config';

const ReferralHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, #26A69A 0%, #4DB6AC 100%)`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  color: theme.palette.common.white,
  marginBottom: theme.spacing(4),
  boxShadow: theme.shadows[8],
}));

const CouponCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#F9FAFB',
  color: theme.palette.text.primary,
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  position: 'relative',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(to right, #FF7043, #F06292)`,
  },
}));

const ShareButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1, 3),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[4],
  },
}));

const AffiliateReferralsPage = () => {
  const [copied, setCopied] = useState(false);
  const [affiliateData, setAffiliateData] = useState({
    couponCode: '',
    referralLink: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReferralLink = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('affiliateToken'); // Adjust based on how you store the JWT
        const response = await axios.get(`${env.api.affiliateUrl}/referral-link`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { referralLink } = response.data.data;
        setAffiliateData({
          couponCode: new URLSearchParams(new URL(referralLink).search).get('ref') || '',
          referralLink,
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch referral link');
      } finally {
        setLoading(false);
      }
    };
    fetchReferralLink();
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    {
      icon: 'solar:share-bold',
      label: 'Twitter',
      color: 'primary',
      onClick: () =>
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(affiliateData.referralLink)}&text=Join with my referral code: ${affiliateData.couponCode}`
        ),
    },
    {
      icon: 'solar:letter-bold',
      label: 'Email',
      color: 'info',
      onClick: () => {
        window.location.href = `mailto:?subject=Join with my referral&body=Use my referral code: ${affiliateData.couponCode} - ${affiliateData.referralLink}`;
      },
    },
    {
      icon: 'solar:link-bold',
      label: 'WhatsApp',
      color: 'success',
      onClick: () =>
        window.open(
          `https://wa.me/?text=Use my referral code: ${affiliateData.couponCode} - ${affiliateData.referralLink}`
        ),
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#E0F2F1', p: 4 }}>
      {/* Header */}
      <ReferralHeader>
        <Box display="flex" alignItems="center" gap={3}>
          <Avatar sx={{ bgcolor: '#FF8A65', color: 'white', width: 48, height: 48 }}>
            <Iconify icon="solar:users-group-rounded-bold" width={28} />
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              Your Referral Hub
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Share your unique code and earn rewards!
            </Typography>
          </Box>
        </Box>
      </ReferralHeader>

      {/* Referral Link Section */}
      <Box mt={4}>
        <CouponCard elevation={5}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#26A69A' }}>
              Your Referral Link
            </Typography>
            {loading ? (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress sx={{ color: '#26A69A' }} />
              </Box>
            ) : error ? (
              <Typography color="error" variant="body1">
                {error}
              </Typography>
            ) : (
              <>
                <TextField
                  value={affiliateData.referralLink}
                  fullWidth
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'white',
                      borderRadius: 2,
                      color: '#37474F',
                      '& fieldset': { borderColor: '#B0BEC5' },
                      '&:hover fieldset': { borderColor: '#FF7043' },
                      '&.Mui-focused fieldset': { borderColor: '#26A69A' },
                    },
                  }}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => handleCopy(affiliateData.referralLink)}
                          sx={{ color: '#FF7043' }}
                        >
                          <Iconify icon="solar:copy-bold" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Box mt={3} display="flex" gap={2} flexWrap="wrap">
                  {shareOptions.map((option) => (
                    <ShareButton
                      key={option.label}
                      variant="contained"
                      color="primary"
                      startIcon={<Iconify icon={option.icon} />}
                      onClick={option.onClick}
                      sx={{ bgcolor: '#26A69A', '&:hover': { bgcolor: '#4DB6AC' } }}
                    >
                      {option.label}
                    </ShareButton>
                  ))}
                </Box>
              </>
            )}
          </CardContent>
        </CouponCard>
      </Box>

      {/* Instructions */}
      <Box mt={4} textAlign="center">
        <Divider
          sx={{
            my: 3,
            '&::before, &::after': { borderTopStyle: 'dashed', borderColor: '#B0BEC5' },
          }}
        />
        <Typography variant="body1" color="#78909C">
          Share your code or link via social media, email, or messaging apps to start earning!
        </Typography>
      </Box>

      <Snackbar
        open={copied}
        autoHideDuration={2000}
        message="Copied to clipboard!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            bgcolor: '#FF7043',
            color: 'white',
            borderRadius: 2,
          },
        }}
      />
    </Box>
  );
};

export default AffiliateReferralsPage;
