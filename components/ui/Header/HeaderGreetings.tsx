import { FONTS } from '@/lib/customFont/fonts';
import { colors } from '@/lib/theme';
import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Avatar from '../Avatar/Avatar';

interface HeaderGreetingsProps {
    style?: StyleProp<ViewStyle>;
    userName?: string;
    userLocation?: string;
    avatarURL?: string;
    onAvatarPress?: () => void;
}


export default function HeaderGreetings({ style, userName, userLocation, avatarURL, onAvatarPress }: HeaderGreetingsProps) {

    return (
        <View style={[styles.container, style]}>
            <View style={styles.greetingContainer}>
                <Text style={styles.greetingText}>G'day {userName} 👋🏻</Text>
                <Text style={styles.greetingSubtitle}>You're in <Text style={styles.greetingSubtitleHighlight}>{userLocation}</Text></Text>
            </View>
            <View>
                <Avatar
                    imgURL={avatarURL}
                    onPress={onAvatarPress}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greetingContainer: {
        flex: 1,
    },
    greetingText: {
        fontFamily: FONTS.CLASH_DISPLAY_SEMIBOLD,
        fontSize: 28,
        lineHeight: 32,
        color: colors.primitive.greyPurple,
    },
    greetingSubtitle: {
        fontSize: 16,
        color: colors.primitive.greyPurple,
    },
    greetingSubtitleHighlight: {
        color: colors.primitive.purple500,
        fontFamily: FONTS.SATOSHI_BOLD
    },
})