
import React from 'react';
import { View, StyleSheet } from 'react-native';
import ShimmerBox from './ShimmerBox';

const SkeletonLoader = ({ type }) => {
  if (type === 'dashboard') {
    return (
      <View style={styles.dashboardContainer}>
        <ShimmerBox width="100%" height={100} borderRadius={8} style={styles.sectionMargin} />
        <View style={styles.row}>
          <ShimmerBox width="48%" height={80} borderRadius={8} style={styles.itemMargin} />
          <ShimmerBox width="48%" height={80} borderRadius={8} style={styles.itemMargin} />
        </View>
        <ShimmerBox width="100%" height={50} borderRadius={8} style={styles.sectionMargin} />
      </View>
    );
  }

  if (type === 'chatMessage') {
    return (
      <View style={styles.chatMessageContainer}>
        <ShimmerBox width={200} height={20} borderRadius={4} />
        <ShimmerBox width={150} height={20} borderRadius={4} style={{ marginTop: 8 }} />
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  dashboardContainer: {
    padding: 16,
  },
  sectionMargin: {
    marginBottom: 16,
  },
  itemMargin: {
    marginRight: '4%', // To create space between two items in a row
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  chatMessageContainer: {
    padding: 16,
    alignItems: 'flex-start',
  },
});

export default SkeletonLoader;
