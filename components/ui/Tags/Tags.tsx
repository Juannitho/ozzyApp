import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './Tags.style';

interface TagsProps {
  label?: string;
}

export default function Tag({ label }: TagsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{label}</Text>
    </View>
  )
}