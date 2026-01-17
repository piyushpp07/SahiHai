import { View, Text, StyleSheet } from 'react-native';
import { ScratchCard } from 'react-native-scratch-card';
import { useState } from 'react';
import { ConfettiExplosion } from './ui/ConfettiExplosion';

interface RewardCardProps {
  amount: number;
  onScratch?: () => void;
}

export const RewardCard = ({ amount, onScratch }: RewardCardProps) => {
  const [scratched, setScratched] = useState(false);

  const handleScratch = (percentage: number) => {
    if (percentage > 50 && !scratched) {
      setScratched(true);
      if (onScratch) onScratch();
    }
  };

  return (
    <View style={styles.container}>
      {scratched && <ConfettiExplosion />} 
      <View style={styles.cardContainer}>
         {/* Background (Won Amount) */}
         <View style={styles.rewardContainer}>
            <Text style={styles.wonText}>You Won</Text>
            <Text style={styles.amountText}>₹{amount}</Text>
         </View>
         
         {/* Foreground (Scratch Layer) - Needs adjustment based on library specifics */}
         {!scratched && (
             <View style={styles.scratchLayer}>
                <Text>Scratch Me!</Text>
                {/* 
                  Note: react-native-scratch-card API varies. 
                  Assuming a simple overlay. 
                  If using a specific library, integration code goes here.
                  For now, mocking the behavior visually.
                */}
             </View>
         )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  cardContainer: {
    width: 200,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  rewardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dbeafe', // blue-100
  },
  wonText: {
    fontSize: 18,
    color: '#1e40af', // blue-800
  },
  amountText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1e3a8a', // blue-900
  },
  scratchLayer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: '#3b82f6', // blue-500
      alignItems: 'center',
      justifyContent: 'center',
  }
});
