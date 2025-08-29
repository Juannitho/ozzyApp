import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './IconDescriptor.style';

interface IconDescriptorProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

export default function IconDescriptor({ icon, title, description }: IconDescriptorProps) {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                {icon}
            </View>
            <View>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>
            </View>
        </View>
    )
}