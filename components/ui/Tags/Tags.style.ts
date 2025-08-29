import { FONTS } from "@/lib/customFont/fonts";
import { colors } from "@/lib/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#599CE3",
  },
  text: {
    color: colors.primitive.white,
    fontFamily: FONTS.SATOSHI_BOLD,
    fontSize: 12,
  },
});