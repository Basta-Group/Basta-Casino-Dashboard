import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import TransactionView from '../sections/transaction/TransactionView';
// ----------------------------------------------------------------------

export default function TransactionPage() {
  return (
    <>
      <Helmet>
        <title>{`Payments - ${CONFIG.appName}`}</title>
      </Helmet>

      <TransactionView />
    </>
  );
}
