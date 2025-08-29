import { FONTS } from "@/lib/customFont/fonts"
import colors from "@/lib/theme/colors"


import { StyleSheet } from "react-native"

// Base container styles
export const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        width: '100%',
    },
    label: {
        fontFamily: FONTS.SATOSHI_BOLD,
        fontSize: 12,
        color: colors.primitive.greyPurple,
        position: 'absolute',
        top: 8,
        left: 12,
        zIndex: 10,
    },
    inputLabel: {
        borderWidth: 1,
        borderColor: colors.primitive.grey500,
        borderRadius: 5,
        fontFamily: FONTS.SATOSHI_MEDIUM,
        fontSize: 16,
        height: 64,
        paddingLeft: 12,
        paddingTop: 16,
        width: '100%',
    },
    input: {
        borderWidth: 1,
        borderColor: colors.primitive.grey500,
        borderRadius: 5,
        fontFamily: FONTS.SATOSHI_MEDIUM,
        fontSize: 16,
        height: 64,
        paddingLeft: 16,
        width: '100%',
    },
    error: {
        color: colors.primitive.red400,
        marginTop: 8,
        fontFamily: FONTS.SATOSHI_BOLD,
        fontSize: 14,
        alignSelf: 'flex-start',
    }
})