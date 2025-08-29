import { FONTS } from '@/lib/customFont/fonts'
import { colors } from '@/lib/theme'
import { CalendarPlus } from 'lucide-react-native'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function JamEmptyState() {
  return (
    <View style={styles.emptyStateContainer}>
      <View style={styles.barBackground} />
      <View style={styles.iconWrapper}>
        <CalendarPlus size={24} color={colors.primitive.blue500} />
      </View>
      <View style={styles.textWrapper}>
        <Text style={styles.emptyStateTitle}>No Jams schedule yet 😞</Text>
        <Text style={styles.emptyStateCaption}>Start making new friends now</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    emptyStateContainer: {
        borderWidth: 1,
        borderColor: colors.primitive.purpleAlpha50,
        borderRadius: 8,
        backgroundColor: colors.primitive.white,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        width: '100%',
        elevation: 1,
        shadowColor: colors.primitive.purple600,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3.84,
    },
    barBackground: {
        backgroundColor: colors.primitive.blue100,
        borderRadius: 16,
        width: 6,
        height: 60,
    },
    iconWrapper: {
        backgroundColor: colors.primitive.blueAlpha10,
        borderRadius: 48,
        width: 60,
        height: 60,
        justifyContent: 'center',
        marginRight: 16,
        marginLeft: 12,
        alignItems: 'center',
    },
    textWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: 100,
    },
    emptyStateTitle: {
        color: colors.primitive.blue500,
        fontSize: 18,
        fontFamily: FONTS.SATOSHI_BLACK,
    },
    emptyStateCaption: {
        fontSize: 16,
        fontFamily: FONTS.SATOSHI_REGULAR,
        color: colors.primitive.blue600,
    }
})