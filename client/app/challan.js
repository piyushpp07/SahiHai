import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Keyboard, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { useTheme } from './context/ThemeContext';
import ModernHeader from './components/ModernHeader';

const ChallanResultCard = ({ colors, challanData, onPay, onContest }) => (
  <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: colors.black }]}>
    <Text style={[styles.resultTitle, { color: colors.textPrimary }]}>Challan Status</Text>
    <View style={styles.resultInfoContainer}>
      <Text style={[styles.resultText, { color: colors.textSecondary }]}>
        You have <Text style={{ color: colors.error, fontWeight: 'bold' }}>{challanData.count} Pending Challans</Text> totaling
      </Text>
      <Text style={[styles.amountText, { color: colors.primary }]}>₹{challanData.totalAmount.toLocaleString('en-IN')}</Text>
    </View>
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={[styles.actionButton, { borderColor: colors.primary }]} onPress={onPay}>
        <Text style={[styles.actionButtonText, { color: colors.primary }]}>Pay Now (Official Link)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.secondary }]} onPress={onContest}>
        <Text style={[styles.actionButtonText, { color: colors.white }]}>Contest Fine (AI Draft)</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const NoChallanCard = ({ colors }) => (
    <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: colors.black }]}>
        <Text style={[styles.resultTitle, { color: colors.textPrimary }]}>No Pending Challans</Text>
        <Text style={[styles.resultText, { color: colors.success, textAlign: 'center' }]}>
            Congratulations! You have a clean record.
        </Text>
    </View>
);


const RTOChallanScreen = () => {
  const { colors } = useTheme();
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [challanData, setChallanData] = useState(null);
  const [error, setError] = useState('');

  const handleCheckFines = () => {
    Keyboard.dismiss();
    if (!vehicleNumber.trim()) {
      setError('Vehicle number cannot be empty.');
      setChallanData(null);
      return;
    }
    setError('');
    setLoading(true);
    setChallanData(null);

    // Mock API call
    setTimeout(() => {
      setLoading(false);
      // Simulate different responses based on vehicle number for demo
      if (vehicleNumber.includes('1234')) {
        setChallanData({ count: 2, totalAmount: 2000 });
      } else if (vehicleNumber.includes('0000')) {
        setChallanData({ count: 0, totalAmount: 0 });
      } 
      else {
        setChallanData({ count: 1, totalAmount: 500 });
      }
    }, 1500);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <ModernHeader title="RTO Challan Check" />
        <View style={styles.container}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Enter Vehicle Number to check for pending fines.</Text>
          <TextInput
            style={[styles.input, { color: colors.textPrimary, borderColor: colors.primary, backgroundColor: colors.surface }]}
            placeholder="e.g., MH01AB1234"
            placeholderTextColor={colors.textSecondary}
            value={vehicleNumber}
            onChangeText={text => setVehicleNumber(text.toUpperCase())}
            autoCapitalize="characters"
          />
          {error ? <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text> : null}
          <TouchableOpacity 
            style={[styles.checkButton, { backgroundColor: colors.primary }]} 
            onPress={handleCheckFines}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={[styles.checkButtonText, { color: colors.white }]}>Check Fines</Text>
            )}
          </TouchableOpacity>

          {challanData && challanData.count > 0 && (
            <ChallanResultCard 
              colors={colors} 
              challanData={challanData}
              onPay={() => alert('Redirecting to official payment gateway...')}
              onContest={() => alert('AI is drafting a response to contest the fine...')}
            />
          )}
          {challanData && challanData.count === 0 && (
            <NoChallanCard colors={colors} />
          )}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily: 'Inter-Regular',
  },
  input: {
    height: 50,
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 18,
    fontFamily: 'Roboto-Mono', // Good for vehicle numbers
    marginBottom: 10,
  },
  errorText: {
    marginBottom: 10,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  checkButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
    elevation: 2,
  },
  checkButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
  },
  card: {
    borderRadius: 12,
    padding: 20,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  resultInfoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resultText: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  amountText: {
    fontSize: 48,
    fontWeight: 'bold',
    fontFamily: 'Inter-Black',
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    marginHorizontal: 4,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
  },
});

export default RTOChallanScreen;
