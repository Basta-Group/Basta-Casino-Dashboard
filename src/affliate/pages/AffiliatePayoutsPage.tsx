import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import AdminPayoutPageView from 'src/sections/commissionControl/AdminPayoutPageView';

// ----------------------------------------------------------------------

export default function AdminPayoutPage() {
  return (
    <>
      <Helmet>
        <title> {`Affiliate - ${CONFIG.appName}`}</title>
      </Helmet>

      <AdminPayoutPageView />
    </>
  );
}
