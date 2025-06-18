import type { AxiosError } from 'axios';

import axios from 'axios';
import React, { useState, useEffect } from 'react';

import { Box, Stack, Paper, Button, TextField, Typography } from '@mui/material';

import casinoImg from '../../../public/assets/background/casino.png';
import casinoBg from '../../../public/assets/background/casino-bg-full.jpg';

interface BannerConfig {
  title: string;
  subtitle: string;
  buttonText: string;
  countdown: string; // Format: hh:mm:ss
  startTime?: string; // ISO string of when the countdown started
}

interface ApiSuccessResponse<T> {
  message: string;
  data: T;
}

interface ApiErrorResponse {
  message: string;
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

interface TimeInputs {
  hours: string;
  minutes: string;
  seconds: string;
}

interface TimeErrors {
  hours: string | null;
  minutes: string | null;
  seconds: string | null;
}

interface FormErrors {
  title: string | null;
  subtitle: string | null;
  buttonText: string | null;
}

const DashboardBannerView = (): JSX.Element => {
  const [bannerData, setBannerData] = useState<BannerConfig>({
    title: '',
    subtitle: '',
    buttonText: '',
    countdown: '',
  });
  const [timeInputs, setTimeInputs] = useState<TimeInputs>({
    hours: '',
    minutes: '',
    seconds: '',
  });
  const [timeErrors, setTimeErrors] = useState<TimeErrors>({
    hours: null,
    minutes: null,
    seconds: null,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({
    title: null,
    subtitle: null,
    buttonText: null,
  });
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [token] = useState(localStorage.getItem('accessToken'));

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

  useEffect(() => {
    const fetchBannerConfig = async () => {
      try {
        const response = await axios.get<ApiResponse<BannerConfig>>(
          `${import.meta.env.VITE_API_BASE_URL}:${import.meta.env.VITE_API_PORT}/api/auth/banner`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log('Fetch response:', response.data);
        if ('data' in response.data) {
          const { data } = response.data;
          setBannerData(data);

          // Set input fields to the original countdown duration
          const time = parseTime(data.countdown);
          setTimeInputs({
            hours: String(time.hours).padStart(2, '0'),
            minutes: String(time.minutes).padStart(2, '0'),
            seconds: String(time.seconds).padStart(2, '0'),
          });

          if (data.startTime) {
            // Calculate remaining time for the preview banner
            const startTime = new Date(data.startTime).getTime();
            const now = Date.now();
            const elapsedSeconds = Math.floor((now - startTime) / 1000);

            const totalSeconds = time.hours * 3600 + time.minutes * 60 + time.seconds;
            const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);

            const hours = Math.floor(remainingSeconds / 3600);
            const minutes = Math.floor((remainingSeconds % 3600) / 60);
            const seconds = remainingSeconds % 60;

            setTimeLeft({ hours, minutes, seconds });

            if (remainingSeconds > 0) {
              setIsRunning(true);
            }
          } else {
            // No startTime, use countdown as initial time for preview
            setTimeLeft(time);
          }
        } else {
          setSaveStatus(response.data.message || 'Failed to fetch banner configuration');
        }
      } catch (error) {
        const err = error as AxiosError<ApiErrorResponse>;
        setSaveStatus(err.response?.data?.message || 'Failed to fetch banner configuration');
        console.error('Failed to fetch banner config:', error);
      }
    };

    fetchBannerConfig();
  }, [token]);

  useEffect(() => {
    if (!isRunning) return undefined;

    const timer = setInterval(() => {
      if (bannerData.startTime) {
        const startTime = new Date(bannerData.startTime).getTime();
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - startTime) / 1000);

        const [h, m, s] = bannerData.countdown.split(':').map(Number);
        const totalSeconds = h * 3600 + m * 60 + s;
        const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);

        if (remainingSeconds <= 0) {
          setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
          setIsRunning(false);
          return;
        }

        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        const seconds = remainingSeconds % 60;

        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, bannerData.startTime, bannerData.countdown]);

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

  const validateTextInput = (name: string, value: string): string | null => {
    if (!value.trim()) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required and cannot be empty`;
    }

    switch (name) {
      case 'title':
        if (value.length > 50) {
          return 'Title must be less than 50 characters';
        }
        break;
      case 'subtitle':
        if (value.length > 30) {
          return 'Subtitle must be less than 30 characters';
        }
        break;
      case 'buttonText':
        if (value.length > 20) {
          return 'Button text must be less than 20 characters';
        }
        break;
      default:
        break;
    }

    return null;
  };

  const validateAllInputs = () => {
    const textErrors = {
      title: validateTextInput('title', bannerData.title),
      subtitle: validateTextInput('subtitle', bannerData.subtitle),
      buttonText: validateTextInput('buttonText', bannerData.buttonText),
    };
    const newTimeErrors = {
      hours: validateTimeInput('hours', timeInputs.hours),
      minutes: validateTimeInput('minutes', timeInputs.minutes),
      seconds: validateTimeInput('seconds', timeInputs.seconds),
    };
    setFormErrors(textErrors);
    setTimeErrors(newTimeErrors);
    return (
      !textErrors.title &&
      !textErrors.subtitle &&
      !textErrors.buttonText &&
      !newTimeErrors.hours &&
      !newTimeErrors.minutes &&
      !newTimeErrors.seconds
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBannerData({ ...bannerData, [name]: value });
    const error = validateTextInput(name, value);
    setFormErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTimeInputs((prev) => ({ ...prev, [name]: value }));
    const error = validateTimeInput(name, value);
    setTimeErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSave = async () => {
    if (!validateAllInputs()) return;

    if (!token) {
      setSaveStatus('Authentication token is missing');
      setTimeout(() => setSaveStatus(null), 3000);
      return;
    }

    try {
      const hours = timeInputs.hours ? timeInputs.hours : '0';
      const minutes = timeInputs.minutes ? timeInputs.minutes : '0';
      const seconds = timeInputs.seconds ? timeInputs.seconds : '0';

      const payload = {
        title: bannerData.title,
        subtitle: bannerData.subtitle,
        buttonText: bannerData.buttonText,
        hours,
        minutes,
        seconds,
        startTime: new Date().toISOString(),
      };

      console.log('Saving payload:', payload);

      const response = await axios({
        method: 'post',
        url: `${import.meta.env.VITE_API_BASE_URL}:${import.meta.env.VITE_API_PORT}/api/auth/admin/banner`,
        data: payload,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Save response:', response.data);

      if ('data' in response.data) {
        // Update bannerData with server response
        setBannerData(response.data.data);
        // Keep timeInputs as entered by the user (original duration)
        setTimeInputs({
          hours: String(parseInt(hours, 10)).padStart(2, '0'),
          minutes: String(parseInt(minutes, 10)).padStart(2, '0'),
          seconds: String(parseInt(seconds, 10)).padStart(2, '0'),
        });
        // Set timeLeft to the full duration for the preview
        setTimeLeft({
          hours: parseInt(hours, 10),
          minutes: parseInt(minutes, 10),
          seconds: parseInt(seconds, 10),
        });
        setIsRunning(true);
        setSaveStatus(response.data.message);
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        throw new Error(response.data.message || 'Failed to save banner configuration');
      }
    } catch (error) {
      console.error('Error saving banner config:', error);
      const err = error as AxiosError<ApiErrorResponse>;
      setSaveStatus(err.response?.data?.message || 'Failed to save banner configuration');
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
              error={!!formErrors.title}
              helperText={formErrors.title || `${bannerData.title.length}/50 characters`}
              inputProps={{ maxLength: 50 }}
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
              error={!!formErrors.subtitle}
              helperText={formErrors.subtitle || `${bannerData.subtitle.length}/30 characters`}
              inputProps={{ maxLength: 30 }}
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
              error={!!formErrors.buttonText}
              helperText={formErrors.buttonText || `${bannerData.buttonText.length}/20 characters`}
              inputProps={{ maxLength: 20 }}
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
              disabled={
                !!formErrors.title ||
                !!formErrors.subtitle ||
                !!formErrors.buttonText ||
                !!timeErrors.hours ||
                !!timeErrors.minutes ||
                !!timeErrors.seconds
              }
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
