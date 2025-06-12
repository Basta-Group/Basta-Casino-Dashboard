import type { BoxProps } from '@mui/material/Box';

import React from 'react';
import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';

import fullLogo from '../../../public/assets/icons/BastaLogo.svg';

export type LogoProps = BoxProps & {
  href?: string;
  isSingle?: boolean;
  disableLink?: boolean;
};

const Logo: React.FC<LogoProps> = ({ href = '/', isSingle, disableLink, ...boxProps }) => {
  const logoSrc = fullLogo;

  const LogoImage = (
    <Box
      component="img"
      src={logoSrc}
      alt="Logo"
      sx={{ height: 40, cursor: 'pointer' }}
      {...boxProps}
    />
  );

  if (disableLink) {
    return LogoImage;
  }

  return (
    <Link
      to={href}
      style={{
        textDecoration: 'none',
        backgroundColor: '#f4f6f8',
        textAlign: 'center',
        padding: '4px',
        marginBottom: '10px',
        borderRadius: '7px',
      }}
    >
      {LogoImage}
    </Link>
  );
};

export default Logo;
