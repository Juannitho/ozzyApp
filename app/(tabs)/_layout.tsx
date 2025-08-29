import { FONTS } from '@/lib/customFont/fonts'
import { colors } from '@/lib/theme'
import { BlurView } from 'expo-blur'
import { Tabs } from 'expo-router'
import { Backpack, BriefcaseBusiness, Home } from 'lucide-react-native'
import { StyleSheet, View } from 'react-native'

const TabIcon = ({ focused, children }: { focused: boolean; children: React.ReactNode }) => (
  <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
    {children}
  </View>
)

export default function Layout() {
  return (
    <Tabs 
    screenOptions={{
      animation: 'fade',
      tabBarBackground: () => (
        <BlurView 
          intensity={50} 
          tint="light" 
          style={{ 
            flex: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderTopWidth: 0.5,
            borderTopColor: colors.primitive.purpleAlpha50
          }}
        />
      ),
      
      tabBarStyle: {
        position: 'absolute',
        paddingTop: 12,
        height: 104,
        borderTopWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
      },
      tabBarActiveTintColor: colors.primitive.greyPurple,
      tabBarInactiveTintColor: colors.primitive.grey700,
      tabBarLabelStyle: {
        fontFamily: FONTS.SATOSHI_BOLD,
        fontSize: 12,
        paddingTop: 8,
      },
    }}>
        <Tabs.Screen name="index" options={{ 
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused}>
              <Home color={focused ? colors.primitive.greyPurple : color} size={28} strokeWidth={focused ? 2 : 1.5} />
            </TabIcon>
          ),
        }} />
        <Tabs.Screen name="jams" options={{ 
          headerShown: false, 
          title: 'Jams',
          href: {
            pathname: '/jams',
            params: {}
          },
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused}>
              <Backpack color={focused ? colors.primitive.greyPurple : color} size={28} strokeWidth={focused ? 2 : 1.5} />
            </TabIcon>
          ),
        }} />
        <Tabs.Screen name="gigs" options={{ 
          headerShown: false, 
          title: 'Gigs',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused}>
              <BriefcaseBusiness color={focused ? colors.primitive.greyPurple : color} size={28} strokeWidth={focused ? 2 : 1.5} />
            </TabIcon>
          ),
        }} />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 56,
    height: 40,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIconContainer: {
    backgroundColor: colors.primitive.purpleAlpha50,
  },
})