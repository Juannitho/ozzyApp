import { FONTS } from '@/lib/customFont/fonts';
import { colors } from '@/lib/theme';
import { Profile } from '@/types/database.types';
import { GraduationCap } from 'lucide-react-native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProfileCardProps {
  profile: Profile;
  onPress?: () => void;
  showStats?: boolean;
  compact?: boolean;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onPress,
  showStats = true,
  compact = false,
}) => {

  const nameTrimmed = profile?.full_name?.trim().split(' ')[0];

  const renderAvatar = () => {
    if (profile.avatar_url) {
      return (
        <Image 
          source={{ uri: profile.avatar_url }} 
          style={[styles.avatar, compact && styles.avatarCompact]} 
        />
      );
    }
    
    return (
      <Image 
        source={{ uri: `https://avatar.iran.liara.run/username?username=${nameTrimmed}&bold=true&length=1` }} 
        style={[styles.avatar, compact && styles.avatarCompact]} 
      />
    );
  };

  const renderCountryFlag = () => {
    if (profile.country_flag) {
      return <Text style={styles.countryFlag}>{profile.country_flag}</Text>;
    }
    return null;
  };

  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <CardWrapper 
      style={[styles.card, compact && styles.cardCompact]} 
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.header}>
        {renderAvatar()}
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={[styles.displayName, compact && styles.displayNameCompact]}>
              {profile.full_name || profile.username}
            </Text>
            {renderCountryFlag()}
          </View>
          
          {!compact && profile.username !== profile.display_name && (
            <Text style={styles.username}>@{profile.username}</Text>
          )}
          
          {!compact && profile.school && (
            <View style={styles.schoolRow}>
              <GraduationCap size={16} color={colors.primitive.grey600} />
              <Text style={styles.school}>{profile.school}</Text>
            </View>
          )}
        </View>
      </View>

      {!compact && profile.bio && (
        <Text style={styles.bio} numberOfLines={3}>
          {profile.bio}
        </Text>
      )}

      {showStats && !compact && (
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile.jams_created}</Text>
            <Text style={styles.statLabel}>Jams Created</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile.jams_joined}</Text>
            <Text style={styles.statLabel}>Jams Joined</Text>
          </View>
        </View>
      )}
    </CardWrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primitive.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: colors.primitive.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardCompact: {
    padding: 12,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  avatarCompact: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primitive.purple400,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  displayName: {
    fontFamily: FONTS.SATOSHI_BOLD,
    fontSize: 18,
    color: colors.primitive.greyPurple,
    marginRight: 16,
  },
  displayNameCompact: {
    fontSize: 32,
  },
  username: {
    fontFamily: FONTS.SATOSHI_REGULAR,
    fontSize: 14,
    color: colors.primitive.grey600,
    marginBottom: 4,
  },
  countryFlag: {
    fontSize: 16,
  },
  schoolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  school: {
    fontFamily: FONTS.SATOSHI_REGULAR,
    fontSize: 12,
    color: colors.primitive.grey600,
    marginLeft: 4,
  },
  bio: {
    fontFamily: FONTS.SATOSHI_REGULAR,
    fontSize: 14,
    color: colors.primitive.grey800,
    lineHeight: 20,
    marginBottom: 12,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.primitive.grey200,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.primitive.grey200,
  },
  statNumber: {
    fontFamily: FONTS.SATOSHI_BOLD,
    fontSize: 20,
    color: colors.primitive.purple400,
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: FONTS.SATOSHI_REGULAR,
    fontSize: 12,
    color: colors.primitive.grey600,
  },
});

export default ProfileCard;
