import { ProfileCard } from '@/components/profile';
import { Button as ButtonUI } from '@/components/ui/Button/Button';
import { supabase } from '@/lib/supabase/supabase';
import { colors } from '@/lib/theme';
import { useAuth } from '@/providers/AuthProvider';
import { router } from 'expo-router';
import { LogOut, X } from 'lucide-react-native';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function UserProfilePage() {
  const { profile } = useAuth();


  const logout = async () => {
    await supabase.auth.signOut();
  }

  const handleClose = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <X size={32} color={colors.primitive.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Content */}
      <View style={styles.content}>
        {profile ? (
          <ProfileCard profile={profile} showStats={true} />
        ) : (
          <Text>Loading profile...</Text>
        )}
      </View>

      <ButtonUI
        title="Sign out"
        onPress={logout}
        variant="filled"
        size="large"
        style={styles.logoutButton}
        leftIcon={<LogOut size={24} color={colors.primitive.purple300} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primitive.white,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  topSection: {
    backgroundColor: colors.primitive.purple600,
    height: 180,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: -80,
  },
  logoutButton: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
});