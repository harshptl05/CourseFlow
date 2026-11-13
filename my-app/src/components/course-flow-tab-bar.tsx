import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Colors, Radius, Shadow, Spacing } from '@/constants/theme';

const TAB_ICONS = {
  index: require('@/assets/icons/tab-home.svg'),
  saved: require('@/assets/icons/tab-saved.svg'),
  courses: require('@/assets/icons/tab-courses.svg'),
  settings: require('@/assets/icons/tab-settings.svg'),
} as const;

export function CourseFlowTabBar(props: any) {
  const { state, descriptors, emitter, navigateToTab } = props;
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.shell, { paddingBottom: Math.max(insets.bottom, Spacing.sm) }]}>
      <View style={styles.bar}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          return (
            <Pressable
              key={route.key}
              style={[styles.item, isFocused && styles.itemFocused]}
              accessibilityRole="button"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={() => {
                const event = emitter.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigateToTab(route.key);
                }
              }}>
              <Image
                source={TAB_ICONS[route.name as keyof typeof TAB_ICONS]}
                style={[styles.icon, isFocused && styles.iconFocused]}
                contentFit="contain"
              />
              <ThemedText
                type="caption"
                color={isFocused ? 'primary' : 'muted'}
                style={styles.label}>
                {options.title ?? route.name}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    backgroundColor: Colors.bg,
  },
  bar: {
    flexDirection: 'row',
    gap: Spacing.xs,
    padding: Spacing.xs,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    ...Shadow.raised,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: Radius.lg,
  },
  itemFocused: {
    backgroundColor: Colors.tint,
  },
  icon: {
    width: 22,
    height: 22,
    opacity: 0.55,
  },
  iconFocused: {
    opacity: 1,
  },
  label: {
    textAlign: 'center',
  },
});
