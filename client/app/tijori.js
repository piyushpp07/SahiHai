import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Dimensions, ScrollView } from 'react-native';
import { useTheme } from './context/ThemeContext';
import ModernHeader from './components/ModernHeader'; // Assuming a modern header component exists

// Mock Data for Warranties
const MOCK_WARRANTIES = {
  active: [
    { id: '1', productName: 'Samsung 55" QLED TV', purchaseDate: '2023-08-01', expiryDate: '2025-07-31' },
    { id: '2', productName: 'LG Inverter AC (1.5 Ton)', purchaseDate: '2024-04-10', expiryDate: '2026-04-09' },
    { id: '3', productName: 'Sony WH-1000XM5 Headphones', purchaseDate: '2024-01-15', expiryDate: '2025-01-14' },
  ],
  expired: [
    { id: '4', productName: 'OnePlus 9 Pro', purchaseDate: '2022-05-20', expiryDate: '2023-05-19' },
  ],
};

const WarrantyProgressBar = ({ startDate, endDate, colors }) => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const now = new Date().getTime();

  const totalDuration = end - start;
  const elapsedDuration = now - start;
  
  let progress = (elapsedDuration / totalDuration) * 100;
  if (progress < 0) progress = 0;
  if (progress > 100) progress = 100;

  const daysRemaining = Math.ceil((end - now) / (1000 * 60 * 60 * 24));

  return (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: colors.primary }]} />
      <Text style={[styles.progressText, { color: daysRemaining < 30 ? colors.error : colors.textSecondary }]}>
        {daysRemaining > 0 ? `Expires in ${daysRemaining} days` : 'Expired'}
      </Text>
    </View>
  );
};

const WarrantyCard = ({ item, colors }) => {
  const isExpiringSoon = new Date(item.expiryDate).getTime() - new Date().getTime() < 30 * 24 * 60 * 60 * 1000;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: colors.black }]}>
      <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{item.productName}</Text>
      <WarrantyProgressBar startDate={item.purchaseDate} endDate={item.expiryDate} colors={colors} />
      <TouchableOpacity 
        style={[
          styles.claimButton, 
          { backgroundColor: isExpiringSoon ? colors.secondary : colors.primary }
        ]}
      >
        <Text style={[styles.claimButtonText, { color: colors.white }]}>Claim Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const TijoriScreen = () => {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'expired'

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ModernHeader title="The Tijori" />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'active' && { borderBottomColor: colors.primary, borderBottomWidth: 3 }]}
            onPress={() => setActiveTab('active')}
          >
            <Text style={[styles.tabText, { color: activeTab === 'active' ? colors.primary : colors.textSecondary }]}>Active</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'expired' && { borderBottomColor: colors.primary, borderBottomWidth: 3 }]}
            onPress={() => setActiveTab('expired')}
          >
            <Text style={[styles.tabText, { color: activeTab === 'expired' ? colors.primary : colors.textSecondary }]}>Expired</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={MOCK_WARRANTIES[activeTab]}
          renderItem={({ item }) => <WarrantyCard item={item} colors={colors} />}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
        {/* Placeholder for "Add Warranty" button - could be a FAB */}
        <TouchableOpacity style={[styles.fab, { backgroundColor: colors.secondary }]}>
            {/* Using a simple text plus sign for now, can be replaced with an icon */}
            <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0', // a light grey border
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 12,
    alignItems: 'center',
    width: '50%',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold', // Assuming "Inter" font is available
  },
  listContainer: {
    paddingBottom: 80, // space for FAB
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  progressBarContainer: {
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 10,
  },
  progressText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter-Medium',
  },
  claimButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  claimButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 30,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabIcon: {
    fontSize: 30,
    color: 'white',
    lineHeight: 30, // Adjust for vertical centering
  },
});

export default TijoriScreen;
