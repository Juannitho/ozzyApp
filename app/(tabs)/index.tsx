import HeaderGreetings from "@/components/ui/Header/HeaderGreetings";
import { LinearGradient } from "@/components/ui/LinearGradient/LinearGradient";
import { supabase } from "@/lib/supabase/supabase";
import { Button, SafeAreaView, StatusBar, StyleSheet } from "react-native";
import 'react-native-url-polyfill/auto';

export default function Index() {
  const logout = async () => {
    await supabase.auth.signOut();
  }

  return (
    <LinearGradient>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <HeaderGreetings style={styles.headerGreetings} userName="Juan" userLocation="Melbourne, Au" />
        <Button title="Sing out" onPress={logout} />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
  },
  headerGreetings: {
    minHeight: 100,
    flex: 1,
  },
});