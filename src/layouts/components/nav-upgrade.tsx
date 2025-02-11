import type { StackProps } from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { textGradient } from 'src/theme/styles';

export function CasinoPromo({ sx, ...other }: StackProps) {
  return (
    <Box
      display="flex"
      alignItems="center"
      flexDirection="column"
      sx={{ 
        mb: 4, 
        textAlign: 'center',
        background: (theme) => `linear-gradient(135deg, ${theme.palette.background.neutral} 0%, ${theme.palette.background.default} 100%)`,
        borderRadius: 2,
        p: 3,
        ...sx 
      }}
      {...other}
    >
      <Typography
        variant="h6"
        sx={(theme) => ({
          ...textGradient(
            `to right, ${theme.vars.palette.primary.main}, ${theme.vars.palette.error.main}`
          ),
          mb: 1
        })}
      >
        Welcome Bonus!
      </Typography>

      <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 1 }}>
        100% Match
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
        Up to{' '}
        <Box component="strong" sx={{ color: 'primary.main', fontSize: '1.2em' }}>
          $1000
        </Box>
        {' '}+ 50 Free Spins
      </Typography>

      <Box
        component="img"
        alt="Casino Games"
        src="/assets/illustrations/casino-games.webp"
        sx={{ 
          width: 240,
          height: 160,
          objectFit: 'cover',
          borderRadius: 1,
          mb: 2,
          filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.15))'
        }}
      />

      <Button
        href="/games"
        variant="contained"
        color="primary"
        size="large"
        sx={{
          px: 4,
          py: 1,
          fontSize: '1.1rem',
          fontWeight: 'bold',
          background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.error.main} 100%)`,
          '&:hover': {
            background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.error.dark} 100%)`,
          }
        }}
      >
        Play Now
      </Button>

      <Typography 
        variant="caption" 
        sx={{ 
          mt: 2,
          color: 'text.secondary',
          fontSize: '0.75rem'
        }}
      >
        *Terms & Conditions Apply. Please Play Responsibly
      </Typography>
    </Box>
  );
}