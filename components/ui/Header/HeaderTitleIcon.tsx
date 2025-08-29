import { Button } from '@/components/ui/Button';
import { FONTS } from '@/lib/customFont/fonts';
import colors from '@/lib/theme/colors';
import { router } from 'expo-router';
import { ArrowLeft, ShareIcon } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

interface HeaderTitleIconProps {
    pageTitle: string;
    showShareButton?: boolean;
}

export default function HeaderTitleIcon({ pageTitle, showShareButton = false }: HeaderTitleIconProps) {
    return (
        <View style={styles.container}>
            <Button
                style={styles.leftButton}
                variant="ghost"
                size="small"
                iconOnly
                leftIcon={<ArrowLeft size={32} color={colors.primitive.greyPurple} />}
                onPress={() => router.back()}
            />
            <Text style={styles.title}>{pageTitle}</Text>
            {showShareButton && (
            <Button
                style={styles.rightButton}
                variant="ghost"
                size="small"
                iconOnly
                leftIcon={<ShareIcon size={26} color={colors.primitive.greyPurple} />}
                onPress={() => {
                    // TODO: Share the jam
                    console.log('share')
                }}
            />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 24,
        paddingBottom: 24,   
        width: '100%',
    },
    title: {
        fontFamily: FONTS.CLASH_DISPLAY_BOLD,
        fontSize: 18,
        color: colors.primitive.greyPurple,
        textAlign: 'center',
        alignSelf: 'center',
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    leftButton: {
        position: 'absolute',
        left: 0,
    },
    rightButton: {
        margin: 0,
        position: 'absolute',
        right: 0,
    },
})