import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';

import { _langs } from 'src/_mock';
import { layoutClasses } from 'src/layouts/classes';
import { Searchbar } from 'src/layouts/components/searchbar';
import { LayoutSection } from 'src/layouts/core/layout-section';
import { HeaderSection } from 'src/layouts/core/header-section';
import { MenuButton } from 'src/layouts/components/menu-button';
import { NavMobile, NavDesktop } from 'src/layouts/dashboard/nav';
import { AccountPopover } from 'src/layouts/components/account-popover';
import { LanguagePopover } from 'src/layouts/components/language-popover';
import { NotificationsPopover } from 'src/layouts/components/notifications-popover';

import { Iconify } from 'src/components/iconify';

import { affiliateNavData } from '../config-nav';

const transformedNavData = affiliateNavData.map((item) => ({
  path: item.href,
  title: item.label,
  icon: <Iconify icon={item.icon.icon} width={24} />,
}));

export default function AffiliateLayout() {
  const theme = useTheme();
  const [navOpen, setNavOpen] = useState(false);
  const layoutQuery = 'lg';

  return (
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
                <LanguagePopover data={_langs} />
                <NotificationsPopover />
                <AccountPopover
                  data={[
                    {
                      label: 'Home',
                      href: '/home',
                      icon: <Iconify width={22} icon="solar:home-angle-bold-duotone" />,
                    },
                    {
                      label: 'Settings',
                      href: '#',
                      icon: <Iconify width={22} icon="solar:settings-bold-duotone" />,
                    },
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
  );
}
