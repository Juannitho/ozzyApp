import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { styles } from './Avatar.styles';

interface AvatarProps {
    imgURL: string;
    onPress?: () => void;
}

export default function Avatar({ imgURL, onPress }: AvatarProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={{ uri: imgURL }} style={styles.avatar} />
    </TouchableOpacity>
  )
}