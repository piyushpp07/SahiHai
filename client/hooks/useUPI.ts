import { Linking } from 'react-native';

interface UPIPayment {
  pa: string; // Payee Address (VPA)
  pn: string; // Payee Name
  am: string; // Amount
  tn?: string; // Transaction Note
}

export const useUPI = () => {
  const initiatePayment = async ({ pa, pn, am, tn = 'Payment' }: UPIPayment) => {
    // Construct UPI Intent URI
    // upi://pay?pa=...&pn=...&am=...
    const url = `upi://pay?pa=${pa}&pn=${encodeURIComponent(pn)}&am=${am}&tn=${encodeURIComponent(tn)}&cu=INR`;

    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
        // In a real app, we might poll an API here to check payment status 
        // after the user returns to the app.
        return { status: 'initiated', url };
      } else {
        console.warn("UPI apps not installed or URL not supported");
        return { status: 'failed', error: 'UPI_NOT_SUPPORTED' };
      }
    } catch (err) {
      console.error('An error occurred', err);
      return { status: 'failed', error: err };
    }
  };

  return { initiatePayment };
};
