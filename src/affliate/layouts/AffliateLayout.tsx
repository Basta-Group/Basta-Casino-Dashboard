import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';

import { layoutClasses } from 'src/layouts/classes';
import { Searchbar } from 'src/layouts/components/searchbar';
import { LayoutSection } from 'src/layouts/core/layout-section';
import { HeaderSection } from 'src/layouts/core/header-section';
import { MenuButton } from 'src/layouts/components/menu-button';
import { NavMobile, NavDesktop } from 'src/layouts/dashboard/nav';
import { AccountPopover } from 'src/layouts/components/account-popover';
import { NotificationsPopover } from 'src/layouts/components/notifications-popover';

import { Iconify } from 'src/components/iconify';

import { affiliateNavData } from '../config-nav';

// import { _langs } from 'src/_mock';

const transformedNavData = affiliateNavData.map((item) => ({
  path: item.href,
  title: item.label,
  icon: <Iconify icon={item.icon.icon} width={24} />,
}));

export default function AffiliateLayout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const layoutQuery = 'lg';

  useEffect(() => {
    const validateToken = () => {
      const token = localStorage.getItem('affiliateToken');
      if (!token) {
        localStorage.removeItem('affiliateToken');
        navigate('/affiliate/login');
        return;
      }

      // Optional: Add token expiration check if your token contains expiration time
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        if (tokenData.exp && tokenData.exp * 1000 < Date.now()) {
          localStorage.removeItem('affiliateToken');
          navigate('/affiliate/login');
        }
      } catch (error) {
        // If token is not a valid JWT, remove it and redirect
        localStorage.removeItem('affiliateToken');
        navigate('/affiliate/login');
      }
    };

    validateToken();
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Basta-Affiliate</title>
      </Helmet>
      <LayoutSection
        headerSection={
          <HeaderSection
            layoutQuery={layoutQuery}
            slotProps={{
              container: {
                maxWidth: false,
                sx: { px: { [layoutQuery]: 5 } },
              },
            }}
            sx={{
              backgroundColor: '#fff',
              boxShadow: theme.shadows[1],
            }}
            slots={{
              topArea: (
                <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                  Affiliate alert placeholder
                </Alert>
              ),
              leftArea: (
                <>
                  <MenuButton
                    onClick={() => setNavOpen(true)}
                    sx={{
                      ml: -1,
                      [theme.breakpoints.up(layoutQuery)]: { display: 'none' },
                    }}
                  />
                  <NavMobile
                    data={transformedNavData}
                    open={navOpen}
                    onClose={() => setNavOpen(false)}
                  />
                </>
              ),
              rightArea: (
                <Box gap={1} display="flex" alignItems="center">
                  <Searchbar />
                  {/* <LanguagePopover data={_langs} /> */}
                  <NotificationsPopover />
                  <AccountPopover
                    data={[
                      {
                        label: 'Home',
                        href: '/affiliate/dashboard',
                        icon: <Iconify width={22} icon="solar:home-angle-bold-duotone" />,
                      },
                      // {
                      //   label: 'Settings',
                      //   href: '#',
                      //   icon: <Iconify width={22} icon="solar:settings-bold-duotone" />,
                      // },
                      // {
                      //   label: 'Logout..',
                      //   href: '#',
                      //   icon: <Iconify width={22} icon="solar:logout-2-bold-duotone" />,
                      // },
                    ]}
                  />
                </Box>
              ),
            }}
          />
        }
        sidebarSection={<NavDesktop data={transformedNavData} layoutQuery={layoutQuery} />}
        footerSection={null}
        cssVars={{
          '--layout-nav-vertical-width': '280px',
          '--layout-dashboard-content-pt': theme.spacing(1),
          '--layout-dashboard-content-pb': theme.spacing(8),
          '--layout-dashboard-content-px': theme.spacing(5),
        }}
        sx={{
          [`& .${layoutClasses.hasSidebar}`]: {
            [theme.breakpoints.up(layoutQuery)]: {
              pl: 'var(--layout-nav-vertical-width)',
            },
          },
          backgroundColor: '#fafbfc',
        }}
      >
        <Outlet />
      </LayoutSection>
    </>
  );
}
