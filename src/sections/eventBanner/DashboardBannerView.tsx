import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { env } from 'src/config/env.config';
import { Box, Button, TextField, Typography, Stack, Paper } from '@mui/material';
import casinoImg from '../../../public/assets/background/casino.png';
import casinoBg from '../../../public/assets/background/casino-bg-full.jpg';

interface BannerConfig {
  title: string;
  subtitle: string;
  buttonText: string;
  countdown: string; // Format: hh:mm:ss
}

const DashboardBannerView: React.FC = () => {
  const [bannerData, setBannerData] = useState<BannerConfig>({
    title: '',
    subtitle: '',
    buttonText: '',
    countdown: '',
  });
  const [timeInputs, setTimeInputs] = useState({
    hours: '',
    minutes: '',
    seconds: '',
  });
  const [timeErrors, setTimeErrors] = useState({
    hours: null as string | null,
    minutes: null as string | null,
    seconds: null as string | null,
  });
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [token] = useState(localStorage.getItem('accessToken')); // Removed setToken as it's unused

  // Parse countdown string (hh:mm:ss) to time object
  const parseTime = (timeString: string) => {
    const [h, m, s] = timeString.split(':').map(Number);
    return { hours: h || 0, minutes: m || 0, seconds: s || 0 };
  };

  // Format time inputs to hh:mm:ss
  const formatTimeString = () => {
    const { hours, minutes, seconds } = timeInputs;
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
  };

  // Fetch existing banner configuration on mount
  useEffect(() => {
    const fetchBannerConfig = async () => {
      try {
        const response = await axios.get<BannerConfig>('/api/banner');
        const data = response.data;
        setBannerData(data);
        const time = parseTime(data.countdown);
        setTimeInputs({
          hours: String(time.hours).padStart(2, '0'),
          minutes: String(time.minutes).padStart(2, '0'),
          seconds: String(time.seconds).padStart(2, '0'),
        });
        setTimeLeft(time);
      } catch (error) {
        console.error('Failed to fetch banner config:', error);
      }
    };

    fetchBannerConfig();
  }, []);

  // Countdown timer logic
  useEffect(() => {
    if (!isRunning) return undefined; // Explicitly return undefined for consistent return

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

    return () => {
      clearInterval(timer); // Cleanup without explicit return
    };
  }, [isRunning]);

  // Validate individual time input
  const validateTimeInput = (name: string, value: string): string | null => {
    if (!/^\d*$/.test(value)) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} must be numeric`;
    }

    const numValue = parseInt(value, 10) || 0;

    if (name === 'hours' && value && numValue < 0) {
      return 'Hours cannot be negative';
    }

    if (name === 'minutes' && value && (numValue < 0 || numValue > 59)) {
      return 'Minutes must be between 0 and 59';
    }

    if (name === 'seconds' && value && (numValue < 0 || numValue > 59)) {
      return 'Seconds must be between 0 and 59';
    }

    return null;
  };

  // Validate all time inputs before saving
  const validateAllTimeInputs = () => {
    const errors = {
      hours: validateTimeInput('hours', timeInputs.hours),
      minutes: validateTimeInput('minutes', timeInputs.minutes),
      seconds: validateTimeInput('seconds', timeInputs.seconds),
    };
    setTimeErrors(errors);
    return !errors.hours && !errors.minutes && !errors.seconds;
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBannerData({ ...bannerData, [e.target.name]: e.target.value });
  };

  // Handle time input changes with dynamic validation
  const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTimeInputs((prev) => ({ ...prev, [name]: value }));

    // Validate the changed field and update errors dynamically
    const error = validateTimeInput(name, value);
    setTimeErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Save banner configuration to backend
  const handleSave = async () => {
    if (!validateAllTimeInputs()) return;

    if (!token) {
      setSaveStatus('Authentication token is missing');
      setTimeout(() => setSaveStatus(null), 3000);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', bannerData.title || '');
      formData.append('subtitle', bannerData.subtitle || '');
      formData.append('buttonText', bannerData.buttonText || '');

      // Ensure time inputs are valid numbers, default to 0 if empty
      const hours = timeInputs.hours ? parseInt(timeInputs.hours, 10) : 0;
      const minutes = timeInputs.minutes ? parseInt(timeInputs.minutes, 10) : 0;
      const seconds = timeInputs.seconds ? parseInt(timeInputs.seconds, 10) : 0;

      // Append individual fields or countdown based on backend requirements
      formData.append('hours', String(hours));
      formData.append('minutes', String(minutes));
      formData.append('seconds', String(seconds));
      // Optionally, append countdown as a single field
      const countdown = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      formData.append('countdown', countdown);

      const apiUrl = `${env.api.baseUrl}:${env.api.port}/api/auth/admin/banner`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save banner configuration');
      }

      setSaveStatus('Banner configuration saved successfully!');
      setBannerData({ ...bannerData, countdown });
      setTimeLeft({ hours, minutes, seconds });
      setIsRunning(true);
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('Error saving banner config:', error);
      setSaveStatus((error as Error).message || 'Failed to save banner configuration');
      setTimeout(() => setSaveStatus(null), 3000);
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
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                variant="outlined"
                label="Hours"
                name="hours"
                value={timeInputs.hours}
                onChange={handleTimeInputChange}
                placeholder="hh"
                size="small"
                error={!!timeErrors.hours}
                helperText={timeErrors.hours}
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
                label="Minutes"
                name="minutes"
                value={timeInputs.minutes}
                onChange={handleTimeInputChange}
                placeholder="mm"
                size="small"
                error={!!timeErrors.minutes}
                helperText={timeErrors.minutes}
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
                label="Seconds"
                name="seconds"
                value={timeInputs.seconds}
                onChange={handleTimeInputChange}
                placeholder="ss"
                size="small"
                error={!!timeErrors.seconds}
                helperText={timeErrors.seconds}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
            </Stack>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={!!timeErrors.hours || !!timeErrors.minutes || !!timeErrors.seconds}
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
            {saveStatus && (
              <Typography
                color={saveStatus.includes('Failed') ? 'error' : 'success.main'}
                sx={{ mt: 1, textAlign: 'center' }}
              >
                {saveStatus}
              </Typography>
            )}
          </Stack>
        </Paper>

        {/* Preview Banner */}
        <Box
          sx={{
            width: '100%',
            backgroundImage: `url(${casinoBg})`,
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
                {bannerData.subtitle || "DON'T MISS THE MAIN EVENT"}
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
              {bannerData.title || 'YOUR ULTIMATE CASINO ADVENTURE AWAITS'}
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
                {bannerData.buttonText || 'PLAY'}
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
