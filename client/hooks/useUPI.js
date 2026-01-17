
import { Linking } from 'react-native';
import { useEffect, useState } from 'react';

export const useUPI = () => {
  const [upiStatus, setUpiStatus] = useState(null);
  const [upiTransactionDetails, setUpiTransactionDetails] = useState(null);

  useEffect(() => {
    const handleDeepLink = (event) => {
      console.log('Deep link URL:', event.url);
      const url = new URL(event.url);
      const transactionStatus = url.searchParams.get('Status');
      const transactionRef = url.searchParams.get('TxnRef');
      const approvalRef = url.searchParams.get('ApprovalRef');

      if (transactionStatus === 'SUCCESS') {
        setUpiStatus('success');
        setUpiTransactionDetails({ transactionRef, approvalRef, status: 'SUCCESS' });
      } else if (transactionStatus === 'FAILURE') {
        setUpiStatus('failed');
        setUpiTransactionDetails({ transactionRef, approvalRef, status: 'FAILURE' });
      } else {
        setUpiStatus('failed');
        setUpiTransactionDetails({ transactionRef, approvalRef, status: transactionStatus || 'UNKNOWN' });
      }
    };

    Linking.addEventListener('url', handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      Linking.removeEventListener('url', handleDeepLink);
    };
  }, []);

  const openUPI = async (vpa, amount) => {
    setUpiStatus(null);
    setUpiTransactionDetails(null);

    const url = `upi://pay?pa=${vpa}&pn=SahiHai&am=${amount}&cu=INR`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log('UPI not supported on this device');
      setUpiStatus('failed');
    }
  };

  return { openUPI, upiStatus, upiTransactionDetails };
};
