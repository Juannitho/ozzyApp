import { LinearGradient } from '@/components/ui';
import CardLg from '@/components/ui/Card/CardLg';
import { FONTS, typography } from '@/lib/customFont/fonts';
import { getJams } from '@/lib/supabase/api/jams';
import { colors } from '@/lib/theme';
import { Jam } from '@/types/database.types';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function Jams() {
  const [jams, setJams] = useState<Jam[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // load jams when the component mounts
  useEffect(() => {
    loadJams();
  }, []);

  // function to load the jams
  const loadJams = async () => {
    try {
      console.log('Cargando Jams...');
      const { jams: jamsData, error } = await getJams();

      if (error) {
        console.error('Error cargando jams:', error);
        Alert.alert('Error', 'No se pudieron cargar los Jams');
      } else {
        console.log(`Se cargaron ${jamsData.length} jams`);
        setJams(jamsData);
      }
    } catch (error) {
      console.error('Error inesperado:', error);
      Alert.alert('Error', 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // function to refresh the jams
  const onRefresh = () => {
    setRefreshing(true);
    loadJams();
  };

  // handle the click on a jam
  const handleJamPress = (jam: Jam) => {
    console.log('Navigating to jam details:', jam.id);
    router.push({
      pathname: `/(tabs)/jams/[id]`,
      params: {
        id: jam.id,
        title: jam.title,
        image_url: jam.image_url || '',
        description: jam.description || '',
        category: jam.category || '',
        cost_type: jam.cost_type || '',
        date: jam.jam_date || '',
        start_time: jam.start_time || '',
        end_time: jam.end_time || '',
        meeting_point: jam.meeting_point || '',
        location_name: jam.location_name || '',
        location_lng: jam.location_lng || '',
        location_lat: jam.location_lat || '',
        location_address: jam.location_address || '',
        max_participants: jam.max_participants || 0,
        current_participants: jam.current_participants || 0,
      }
    });
  };

  // while loading
  if (loading) {
    return (
      <LinearGradient>
        <SafeAreaView style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primitive.purple600} />
          <Text style={styles.loadingText}>Loading jams...</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // if there are no jams
  if (!loading && jams.length === 0) {
    return (
      <LinearGradient>
        <StatusBar barStyle="dark-content" />
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.centerContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primitive.purple600]}
              tintColor={colors.primitive.purple600}
            />
          }
        >
          <SafeAreaView>
            <Text style={styles.emptyText}>😔</Text>
            <Text style={styles.emptyTitle}>No jams available</Text>
            <Text style={styles.emptySubtext}>
              Pull down to refresh
            </Text>
          </SafeAreaView>
        </ScrollView>
      </LinearGradient>
    );
  }



  return (
    <LinearGradient>

      <SafeAreaView style={styles.wrapper}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Jams</Text>
        </View>

        {/* Lista de Jams */}
        <ScrollView
          style={styles.jamsWrapper}
          contentContainerStyle={{ paddingBottom: 56 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primitive.purple600]}
              tintColor={colors.primitive.purple600}
            // progressViewOffset={100}
            />
          }
        >
          <View style={styles.jamsContainer}>
            {jams.map((jam) => (
              <CardLg
                key={jam.id}
                jam={jam}
                onPress={() => handleJamPress(jam)}
              />
            ))}
          </View>
        </ScrollView>
        {/* Spacer at the bottom */}
        <View style={styles.bottomSpacer} />
      </SafeAreaView>

    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 24,
    paddingRight: 24,
    flex: 1,
  },
  wrapper: {
    flex: 1,
    marginHorizontal: 24,
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  header: {
    paddingTop: 24,
    paddingBottom: 16
  },
  title: {
    ...typography.h1,
    fontFamily: FONTS.CLASH_DISPLAY_BOLD,
    color: colors.primitive.greyPurple,
    marginBottom: 4,
  },
  jamsWrapper: {
    flex: 1,
    paddingBottom: 500,
  },
  jamsContainer: {
    gap: 24,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.primitive.purple600,
  },

  emptyText: {
    fontSize: 50,
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primitive.purple600,
    marginBottom: 8,
  },

  emptySubtext: {
    fontSize: 14,
    color: colors.primitive.purple600,
  },

  bottomSpacer: {
    height: 49,
  },
})