import { Box, Typography, Stack, Grid } from '@mui/material';

const AffiliateInfoPage = () => (
  <Box
    sx={{
      display: 'flex',
      width: '100%',
      mb: 3,
      minHeight: '100vh', // Changed to minHeight to allow content to expand
      p: { xs: 2, sm: 4, md: 6 }, // Responsive padding
      bgcolor: '#E0F2F1',
      overflow: 'auto',
      flexDirection: 'column',
      justifyContent: 'center',
      backgroundImage: 'transparent',
      backgroundSize: { xs: '15px 15px', md: '20px 20px' }, // Smaller texture on mobile
    }}
  >
    <Stack spacing={{ xs: 2, md: 4 }}>
      {' '}
      {/* Responsive spacing */}
      <Typography
        variant="h3"
        fontWeight="bold"
        sx={{
          color: '#fff',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
          background: 'linear-gradient(45deg, #FF7043, #F06292)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: { xs: '1.8rem', sm: '2.2rem', md: '3rem' }, // Responsive font size
          textAlign: { xs: 'center', md: 'left' }, // Center on mobile
        }}
      >
        Recommend Games. Earn Commissions.
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontSize: { xs: '1rem', md: '1.1rem' }, // Responsive font size
          color: '#37474F',
          maxWidth: { xs: '90%', sm: '600px', md: '800px' }, // Responsive width
          lineHeight: 1.6,
          textAlign: { xs: 'center', md: 'left' }, // Center on mobile
        }}
      >
        Welcome to one of the largest affiliate programs in the online casino industry. The BASTA
        Casino Affiliate Program helps content creators, bloggers, and influencers monetize their
        traffic with style and efficiency.
      </Typography>
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mt: { xs: 1, md: 2 } }}>
        {[
          {
            title: '1. Sign up',
            text: 'Join thousands of affiliates earning with the BASTA Casino Affiliate Program.',
          },
          {
            title: '2. Recommend',
            text: 'Share thousands of casino games with your audience using our customized linking tools.',
          },
          {
            title: '3. Earn',
            text: 'Earn up to 40% commission on player deposits and sign-ups with our competitive rates.',
          },
        ].map((item, index) => (
          <Grid item xs={11} sm={6} md={4} key={index}>
            {' '}
            {/* Responsive grid */}
            <Box
              sx={{
                p: { xs: 2, md: 3 }, // Responsive padding
                bgcolor: '#F9FAFB',
                borderRadius: 2,
                height: '100%',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                border: '1px solid rgba(176, 190, 197, 0.3)',
                '&:hover': {
                  transform: { md: 'translateY(-8px)' }, // Hover effect only on larger screens
                  boxShadow: '0 12px 40px rgba(38, 166, 154, 0.2)',
                },
                position: 'relative',
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  background: 'linear-gradient(45deg, #26A69A, #4DB6AC)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                }}
              >
                {item.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#78909C',
                  lineHeight: 1.5,
                  fontSize: { xs: '0.9rem', md: '1rem' },
                }}
              >
                {item.text}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Box
        sx={{
          p: { xs: 2, md: 3 },
          bgcolor: '#F9FAFB',
          borderRadius: 2,
          mt: { xs: 2, md: 2 },
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          borderLeft: '4px solid #FF7043',
          maxWidth: { xs: '100%', sm: '600px', md: '700px' }, // Responsive width
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: { md: 'scale(1.02)' }, // Hover effect only on larger screens
            boxShadow: '0 6px 24px rgba(38, 166, 154, 0.15)',
          },
        }}
      >
        <Typography
          variant="body1"
          fontStyle="italic"
          sx={{
            color: '#37474F',
            position: 'relative',
            fontSize: { xs: '0.9rem', md: '1rem' }, // Responsive font size
          }}
        >
          Since we have a global audience, the BASTA Affiliate Program has helped us scale our
          earnings internationally. It’s been simple to sign up and use! - CasinoBlog
        </Typography>
      </Box>
    </Stack>
  </Box>
);

export default AffiliateInfoPage;
