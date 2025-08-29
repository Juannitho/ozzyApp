import { FONTS } from "@/lib/customFont/fonts";
import colors from "@/lib/theme/colors";
import { StyleSheet } from "react-native";

export const stepsStyle = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '100%',
      },
      title: {
        fontFamily: FONTS.CLASH_DISPLAY_BOLD,
        fontSize: 32,
        textAlign: 'left',
        paddingBottom: 24,
        color: colors.primitive.greyPurple,
      },
});
