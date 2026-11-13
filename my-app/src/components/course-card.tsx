import { Feather } from '@expo/vector-icons';
import { Image, type ImageSource } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Layout, Radius, Shadow, Spacing } from '@/constants/theme';

export type CourseCardProps = {
  code: string;
  icon: ImageSource | number;
  resourceCount: string;
  suggestedReads: string;
  surface: 'tint' | 'cream';
  onPress?: () => void;
};

export function CourseCard({
  code,
  icon,
  resourceCount,
  suggestedReads,
  surface,
  onPress,
}: CourseCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: Colors[surface] },
        pressed && styles.cardPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${code}, ${resourceCount}, ${suggestedReads}`}
      onPress={onPress}>
      <View style={styles.heading}>
        <View style={styles.iconTile}>
          <View style={styles.icon}>
            <Image source={icon} style={StyleSheet.absoluteFill} contentFit="contain" />
          </View>
        </View>
        <ThemedText type="label" style={styles.code}>
          {code}
        </ThemedText>
        <Feather name="arrow-up-right" size={16} color={Colors.muted} />
      </View>
      <ThemedText type="caption" color="muted">
        {resourceCount}
      </ThemedText>
      <ThemedText type="meta" color="accent">
        {suggestedReads}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: Layout.courseCardWidth,
    padding: Spacing.md,
    borderRadius: Radius.xl,
    gap: 7,
    ...Shadow.card,
  },
  cardPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconTile: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.sm,
    backgroundColor: Colors.white,
  },
  code: {
    flex: 1,
  },
  icon: {
    width: 18,
    height: 18,
  },
});
