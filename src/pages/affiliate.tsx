import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { AdminAffiliateView } from 'src/sections/affiliate/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Affiliate - ${CONFIG.appName}`}</title>
      </Helmet>

      <AdminAffiliateView />
    </>
  );
}
