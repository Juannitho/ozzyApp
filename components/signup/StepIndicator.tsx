import colors from '@/lib/theme/colors';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBackground}>
        <View 
          style={[
            styles.progressFill,
            { width: `${progress}%` }
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    paddingHorizontal: 0,
    marginBottom: 40,
    width: '100%',
  },
  progressBackground: {
    width: '100%',
    height: 8,
    backgroundColor: colors.primitive.greyAlpha10,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primitive.purple400,
    borderRadius: 4,
    minWidth: 8,
  },
});
