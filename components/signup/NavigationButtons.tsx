import { Button } from '@/components/ui';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface NavigationButtonsProps {
  isLastStep: boolean;
  loading: boolean;
  onNext: () => void;
}

export default function NavigationButtons({ 
  isLastStep, 
  loading, 
  onNext 
}: NavigationButtonsProps) {
  return (
    <View style={styles.navigationContainer}>
      <Button
        title={isLastStep ? (loading ? 'Creating Account...' : 'Create Account') : 'Next'}
        variant="filled"
        size="large"
        fullWidth={true}
        loading={loading}
        disabled={loading}
        onPress={onNext}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 32,
  }
});
