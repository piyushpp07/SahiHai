import { Share } from 'react-native';

interface FlaggedItem {
  item: string;
  claimedPrice: number;
  marketPrice: number;
}

interface ScanResult {
  flaggedItems: FlaggedItem[];
  // Add other properties of scanResult if they are used elsewhere
}

export const shareLootReport = async (scanResult: ScanResult) => {
  if (!scanResult) {
    console.warn("Share function called with no scan result.");
    return;
  }

  const totalOvercharge = scanResult.flaggedItems.reduce(
    (acc, item) => acc + (item.claimedPrice - item.marketPrice),
    0
  );

  if (totalOvercharge <= 0) {
      try {
            await Share.share({
                message: "SahiHai App helped me check my bill and everything was fairly priced! ✅ Check your bills before paying! Download SahiHai.",
            });
        } catch (error) {
            console.error('Sharing failed', error);
        }
        return;
  }
  
  const worstOffender = scanResult.flaggedItems.reduce(
    (worst, current) => {
      const currentOvercharge = current.claimedPrice - current.marketPrice;
      const worstOvercharge = worst.claimedPrice - worst.marketPrice;
      return currentOvercharge > worstOvercharge ? current : worst;
    }, 
    scanResult.flaggedItems[0] // Assuming flaggedItems is never empty when totalOvercharge > 0
  );

  const message = `🚨 SahiHai Alert! 🚨
I just checked this bill and found I was being overcharged by ₹${totalOvercharge.toFixed(2)}!

❌ Worst Item: ${worstOffender.item}
   - Quoted: ₹${worstOffender.claimedPrice}
   - Should be: ₹${worstOffender.marketPrice}

Check your bills before paying! Download the SahiHai app to avoid getting scammed.`;

  try {
    await Share.share({
      message,
    });
  } catch (error) {
    console.error('Sharing failed', error);
  }
};
