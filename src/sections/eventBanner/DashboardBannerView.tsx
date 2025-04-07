import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Stack, Paper } from '@mui/material';
import casinoImg from '../../../public/assets/background/casino.png';
import casinoBg from '../../../public/assets/background/casino-bg-full.jpg';

const DashboardBannerView: React.FC = () => {
  const [bannerData, setBannerData] = useState({
    title: 'YOUR ULTIMATE CASINO ADVENTURE AWAITS',
    subtitle: "DON'T MISS THE MAIN EVENT",
    buttonText: 'PLAY',
    countdown: '15:40:24',
  });
  const [countdownError, setCountdownError] = useState<string | null>(null);

  const parseTime = (timeString: string) => {
    const [h, m, s] = timeString.split(':').map(Number);
    return { hours: h || 0, minutes: m || 0, seconds: s || 0 };
  };

  const [timeLeft, setTimeLeft] = useState(parseTime(bannerData.countdown));
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return undefined;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const { hours, minutes, seconds } = prevTime;

        if (hours === 0 && minutes === 0 && seconds === 0) {
          clearInterval(timer);
          setIsRunning(false);
          return { hours: 0, minutes: 0, seconds: 0 };
        }

        if (seconds > 0) {
          return { hours, minutes, seconds: seconds - 1 };
        }
        if (minutes > 0) {
          return { hours, minutes: minutes - 1, seconds: 59 };
        }
        return { hours: hours - 1, minutes: 59, seconds: 59 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  const validateCountdown = (value: string): boolean => {
    const timePattern = /^(\d+):(\d+):(\d+)$/;
    if (!timePattern.test(value)) {
      setCountdownError('Please use format hh:mm:ss');
      return false;
    }

    const [hours, minutes, seconds] = value.split(':').map(Number);

    if (minutes > 59) {
      setCountdownError('Minutes cannot exceed 59');
      return false;
    }

    if (seconds > 59) {
      setCountdownError('Seconds cannot exceed 59');
      return false;
    }

    if (hours < 0 || minutes < 0 || seconds < 0) {
      setCountdownError('Time values cannot be negative');
      return false;
    }

    setCountdownError(null);
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBannerData({ ...bannerData, [e.target.name]: e.target.value });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setBannerData({ ...bannerData, countdown: newValue });
    validateCountdown(newValue);
  };

  const handleSave = () => {
    if (validateCountdown(bannerData.countdown)) {
      setTimeLeft(parseTime(bannerData.countdown));
      setIsRunning(true);
    }
  };

  return (
    <Box sx={{ maxWidth: '100%', width: '100vw', px: { xs: 2, md: 4 }, py: 4 }}>
      <Stack spacing={4} sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Admin Panel */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 2,
            bgcolor: '#fff',
            width: '100%',
            maxWidth: 600,
            mx: 'auto',
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            color="primary.main"
            sx={{ mb: 3, textAlign: 'center' }}
          >
            Banner Configuration
          </Typography>
          <Stack spacing={2.5}>
            <TextField
              fullWidth
              variant="outlined"
              label="Banner Title"
              name="title"
              value={bannerData.title}
              onChange={handleChange}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Banner Subtitle"
              name="subtitle"
              value={bannerData.subtitle}
              onChange={handleChange}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Button Text"
              name="buttonText"
              value={bannerData.buttonText}
              onChange={handleChange}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Countdown (hh:mm:ss)"
              name="countdown"
              value={bannerData.countdown}
              onChange={handleTimeChange}
              placeholder="hh:mm:ss"
              size="small"
              error={!!countdownError}
              helperText={countdownError}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={!!countdownError}
              sx={{
                borderRadius: '8px',
                py: 1.2,
                fontWeight: 'bold',
                mt: 2,
                bgcolor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                '&:disabled': {
                  bgcolor: 'grey.400',
                  color: 'grey.700',
                },
              }}
            >
              Save & Start Countdown
            </Button>
          </Stack>
        </Paper>

        {/* Preview Banner */}
        <Box
          sx={{
            width: '100%',
            backgroundImage: ` url(${casinoBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: 250,
          }}
        >
          <Box sx={{ width: { xs: '100%', sm: '60%' } }}>
            <Box
              sx={{
                backgroundColor: 'rgba(251, 0, 46, 0.2)',
                border: '1px solid #fb002e',
                p: 1,
                borderRadius: '20px',
                display: 'inline-block',
                mb: 2,
              }}
            >
              <Typography variant="subtitle2" fontWeight="medium">
                {bannerData.subtitle}
              </Typography>
            </Box>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                mb: 2,
                textShadow: '0 1px 5px rgba(0,0,0,0.3)',
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
              }}
            >
              {bannerData.title}
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                p: 1.5,
                borderRadius: '25px',
                width: 'fit-content',
              }}
            >
              <Button
                variant="contained"
                color="error"
                size="small"
                sx={{
                  borderRadius: '20px',
                  px: 3,
                  py: 1,
                  fontWeight: 'bold',
                }}
              >
                {bannerData.buttonText}
              </Button>
              <Typography variant="body2" fontWeight="medium">
                DON&apos;T MISS
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center">
                {[timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map((val, i) => (
                  <React.Fragment key={i}>
                    <Typography
                      sx={{
                        fontSize: { xs: '14px', sm: '16px' },
                        fontWeight: 'bold',
                        backgroundColor: 'rgba(251, 0, 46, 0.2)',
                        border: '1px solid #fb002e',
                        p: { xs: 1, sm: 1.5 },
                        borderRadius: '50%',
                        width: { xs: '40px', sm: '50px' },
                        height: { xs: '40px', sm: '50px' },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {String(val).padStart(2, '0')}
                    </Typography>
                    {i < 2 && (
                      <Typography sx={{ fontSize: { xs: '16px', sm: '20px' } }}>:</Typography>
                    )}
                  </React.Fragment>
                ))}
              </Stack>
            </Stack>
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '40%' }, mt: { xs: 2, sm: 0 } }}>
            <img
              src={casinoImg}
              alt="Casino Slot Machine"
              style={{
                width: '100%',
                maxWidth: 400,
                height: 'auto',
                display: 'block',
              }}
            />
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default DashboardBannerView;
