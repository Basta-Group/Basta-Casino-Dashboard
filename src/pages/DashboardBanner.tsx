import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import DashboardBannerView from 'src/sections/eventBanner/DashboardBannerView';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Users - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardBannerView />
    </>
  );
}
