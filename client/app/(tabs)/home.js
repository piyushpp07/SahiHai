import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../utils/api";
import { useRouter } from "expo-router";
import { useTheme } from "../context/ThemeContext";

// This is the new widget component
const MohallaRateWidget = ({ colors }) => (
  <View style={[styles.mohallaCard, { backgroundColor: colors.primary, shadowColor: colors.black }]}>
    <View style={styles.mohallaHeader}>
      <Text style={[styles.mohallaTitle, { color: colors.white }]}>Trending in Your Area</Text>
    </View>
    <View style={styles.mohallaBody}>
      <Text style={[styles.mohallaText, { color: colors.white }]}>
        People in <Text style={{fontWeight: 'bold'}}>Koramangala</Text> are paying
      </Text>
      <View style={styles.mohallaPriceContainer}>
        <Text style={[styles.mohallaPrice, { color: colors.secondary }]}>
          ₹350
        </Text>
        <Text style={[styles.mohallaService, { color: colors.white }]}>
          for Split AC Service today.
        </Text>
      </View>
    </View>
  </View>
);

export default function HomeTab() {
  const [recentScans, setRecentScans] = useState([]);
  const [totalSaved, setTotalSaved] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      setRecentScans([
        {_id: '1', title: 'LG AC Scan', type: 'image', savings: 150},
        {_id: '2', title: 'Samsung TV Check', type: 'audio', savings: 0},
      ]);
      setTotalSaved(1500);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      id: "tijori",
      icon: "lock-closed",
      title: "The Tijori",
      description: "Secure your bills & warranties",
      colorKey: "primary",
      route: "/tijori",
    },
    {
      id: "challan",
      icon: "car-sport",
      title: "RTO Challan",
      description: "Check traffic fines",
      colorKey: "error",
      route: "/features/challan",
    },
    {
      id: "inventory",
      icon: "cube",
      title: "Inventory",
      description: "Manage your appliances",
      colorKey: "success",
      route: "/inventory",
    },
    {
      id: "scan",
      icon: "scan-circle",
      title: "Scan Appliance",
      description: "Detect appliance age",
      colorKey: "secondary",
      route: "/scan",
    },
  ];

  const renderFeatureCard = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.featureCard,
        { backgroundColor: colors.surface, shadowColor: colors.black },
      ]}
      onPress={() => router.push(item.route)}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.featureIconContainer,
          { backgroundColor: `${colors[item.colorKey]}1A` },
        ]}
      >
        <Ionicons name={item.icon} size={28} color={colors[item.colorKey]} />
      </View>
      <View style={styles.featureContent}>
        <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>
          {item.title}
        </Text>
        <Text
          style={[styles.featureDescription, { color: colors.textSecondary }]}
        >
          {item.description}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  const renderRecentScan = ({ item }) => (
    <TouchableOpacity
      style={[styles.scanCard, { backgroundColor: colors.surface, shadowColor: colors.black }]}
      onPress={() => router.push(`/result/${item._id}`)}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.scanIcon,
          {
            backgroundColor:
              item.type === "image"
                ? `${colors.primary}1A`
                : `${colors.success}1A`,
          },
        ]}
      >
        <Ionicons
          name={item.type === "image" ? "document" : "mic"}
          size={24}
          color={item.type === "image" ? colors.primary : colors.success}
        />
      </View>
      <View style={styles.scanInfo}>
        <Text style={[styles.scanTitle, { color: colors.textPrimary }]}>
          {item.title || "Scan Result"}
        </Text>
        <Text style={[styles.scanTime, { color: colors.textSecondary }]}>
          Just now
        </Text>
      </View>
      <View
        style={[
          styles.savingsBadge,
          { backgroundColor: `${colors.success}20` },
        ]}
      >
        <Text style={[styles.savingsText, { color: colors.success }]}>
          ₹{item.savings || 0}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 32}}
      >
        {/* Mohalla Rate Widget */}
        <MohallaRateWidget colors={colors} />
        
        {/* Features Grid */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            What would you like to do?
          </Text>
          <View style={styles.featuresGrid}>
            {features.map(item => (
              <TouchableOpacity
                key={item.id}
                style={[styles.gridItem, { backgroundColor: colors.surface, shadowColor: colors.black }]}
                onPress={() => router.push(item.route)}
              >
                <Ionicons name={item.icon} size={28} color={colors[item.colorKey]} />
                <Text style={[styles.gridItemText, {color: colors.textPrimary}]}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        {recentScans.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text
                style={[styles.sectionTitle, { color: colors.textPrimary }]}
              >
                Recent Activity
              </Text>
              <TouchableOpacity onPress={fetchData}>
                <Ionicons name="refresh" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
            {recentScans.map(item => renderRecentScan({item}))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: 'Inter-Bold',
  },
  // New Mohalla Widget Styles
  mohallaCard: {
    margin: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  mohallaHeader: {
    marginBottom: 12,
  },
  mohallaTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    opacity: 0.9
  },
  mohallaBody: {
    alignItems: 'center',
  },
  mohallaText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  mohallaPriceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  mohallaPrice: {
    fontSize: 48,
    fontWeight: 'bold',
    fontFamily: 'Inter-Black',
  },
  mohallaService: {
    fontSize: 16,
    marginLeft: 8,
    fontFamily: 'Inter-Medium',
    flexShrink: 1,
  },
  // Updated Feature Grid Styles
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  gridItem: {
    width: '48%',
    aspectRatio: 1.2,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  gridItemText: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
    marginTop: 8,
  },
  // Old Feature Card Styles (can be removed if grid is preferred)
  featureCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    marginBottom: 12,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: 'Inter-SemiBold',
  },
  featureDescription: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
  },
  scanCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    marginBottom: 12,
  },
  scanIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  scanInfo: {
    flex: 1,
  },
  scanTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  scanTime: {
    fontSize: 13,
  },
  savingsBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  savingsText: {
    fontWeight: "600",
    fontSize: 13,
  },
});
