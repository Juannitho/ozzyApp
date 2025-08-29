import { Button } from '@/components/ui/Button';
import colors from '@/lib/theme/colors';
import { ArrowLeft } from 'lucide-react-native';
import React from 'react';

interface BackArrowProps {
  onPress: () => void;
}

export default function BackArrow({ onPress }: BackArrowProps) {
  return (
    <Button
      variant="ghost"
      size="small"
      iconOnly
      leftIcon={<ArrowLeft size={32} color={colors.primitive.greyPurple} />}
      onPress={onPress}
    />
  );
}

