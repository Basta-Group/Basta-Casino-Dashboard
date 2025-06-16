import { Helmet } from 'react-helmet-async';

import { PendingKYCView } from 'src/sections/pending-kyc/view';

// ----------------------------------------------------------------------

/**
 * Page for displaying users with pending KYC verification.
 */
export default function PendingKYCPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Pending KYC</title>
      </Helmet>

      <PendingKYCView />
    </>
  );
}
