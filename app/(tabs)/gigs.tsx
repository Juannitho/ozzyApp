import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function Gigs() {
  return (
    <View style={styles.container}>
      <Text>Comming Soon...</Text>
      <Text>Next Sprint</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})