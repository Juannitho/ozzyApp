import { FONTS } from "@/lib/customFont/fonts";
import { colors } from "@/lib/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24,
        marginBottom: 24,
    },
    iconContainer: {
        backgroundColor: colors.primitive.blueAlpha10,
        padding: 16,
        borderRadius: 100,
    },
    title: {
        fontFamily: FONTS.SATOSHI_REGULAR,
        fontSize: 16,
    },
    description: {
        fontFamily: FONTS.SATOSHI_BOLD,
        fontSize: 16,
        color: colors.primitive.greyPurple,
        lineHeight: 22,
    },
});