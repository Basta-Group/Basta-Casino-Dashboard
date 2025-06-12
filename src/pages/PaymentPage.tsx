import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { PaymentView } from '../sections/payment/PaymentView';
// ----------------------------------------------------------------------

export default function PaymentPage() {
  return (
    <>
      <Helmet>
        <title>{`Payments - ${CONFIG.appName}`}</title>
      </Helmet>

      <PaymentView />
    </>
  );
}
