import { Image, type ImageSource } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Layout, Radius, Spacing } from '@/constants/theme';

export type CourseCardProps = {
  code: string;
  icon: ImageSource | number;
  resourceCount: string;
  suggestedReads: string;
  surface: 'tint' | 'cream';
};

export function CourseCard({
  code,
  icon,
  resourceCount,
  suggestedReads,
  surface,
}: CourseCardProps) {
  return (
    <Pressable
      style={[styles.card, { backgroundColor: Colors[surface] }]}
      accessibilityRole="button"
      accessibilityLabel={`${code}, ${resourceCount}, ${suggestedReads}`}>
      <View style={styles.heading}>
        <Image source={icon} style={styles.icon} contentFit="contain" />
        <ThemedText type="label">{code}</ThemedText>
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
    borderRadius: Radius.lg,
    gap: 7,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  icon: {
    width: 20,
    height: 20,
  },
});
