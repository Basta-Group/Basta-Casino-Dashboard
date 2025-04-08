import { Box, Typography, Stack, Grid } from '@mui/material';

const AffiliateInfoPage = () => {
  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        height: '100vh',
        p: 6,
        bgcolor: '#f0f4f8',
        overflow: 'auto',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Stack spacing={4}>
        <Typography variant="h3" fontWeight="bold" color="primary">
          Recommend Games. Earn Commissions.
        </Typography>

        <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
          Welcome to one of the largest affiliate programs in the online casino industry. The BASTA
          Casino Affiliate Program helps content creators, bloggers, and influencers monetize their
          traffic.
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={4}>
            <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2, height: '100%' }}>
              <Typography variant="h5" color="primary" gutterBottom>
                1. Sign up
              </Typography>
              <Typography variant="body2">
                Join thousands of affiliates earning with the BASTA Casino Affiliate Program.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2, height: '100%' }}>
              <Typography variant="h5" color="primary" gutterBottom>
                2. Recommend
              </Typography>
              <Typography variant="body2">
                Share thousands of casino games with your audience using our customized linking
                tools.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2, height: '100%' }}>
              <Typography variant="h5" color="primary" gutterBottom>
                3. Earn
              </Typography>
              <Typography variant="body2">
                Earn up to 40% commission on player deposits and sign-ups with our competitive
                rates.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2, mt: 2 }}>
          <Typography variant="body1" fontStyle="italic">
            &quot;Since we have a global audience, the BASTA Affiliate Program has helped us scale
            our earnings internationally. It&apos;s been simple to sign up and use!&quot; -
            CasinoBlog
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default AffiliateInfoPage;
