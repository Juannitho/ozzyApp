import { Stack } from "expo-router";

export default function JamsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="experiences" options={{ headerShown: false }} />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
          animation: 'slide_from_right',
          animationTypeForReplace: 'push',
          presentation: 'fullScreenModal',
        }}
      />
    </Stack>
  )
}