import { Stack } from "expo-router";

export default function Layout() {
    return (
        <Stack screenOptions={{ 
            headerShown: false, 
            presentation: 'modal',
            animation: 'slide_from_bottom',
            animationTypeForReplace: 'pop',
        }}>
            <Stack.Screen name="index" options={{ 
                headerShown: false, 
                presentation: 'modal',
                animation: 'slide_from_bottom',
                animationTypeForReplace: 'push',
            }} />
        </Stack>
    )
}