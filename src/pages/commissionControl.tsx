import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import CommissionControlView from 'src/sections/commissionControl/CommissionControlView';

// ----------------------------------------------------------------------

export default function CommissionControlPage() {
  return (
    <>
      <Helmet>
        <title> {`Affiliate - ${CONFIG.appName}`}</title>
      </Helmet>

      <CommissionControlView />
    </>
  );
}
