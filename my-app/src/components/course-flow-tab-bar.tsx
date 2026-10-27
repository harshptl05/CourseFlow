import { Image } from 'expo-image';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Colors, Radius, Spacing } from '@/constants/theme';

const TAB_ICONS = {
  index: require('@/assets/icons/tab-home.svg'),
  saved: require('@/assets/icons/tab-saved.svg'),
  courses: require('@/assets/icons/tab-courses.svg'),
  settings: require('@/assets/icons/tab-settings.svg'),
} as const;

export function CourseFlowTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, Spacing.md) }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        return (
          <Pressable
            key={route.key}
            style={styles.item}
            accessibilityRole="button"
            accessibilityState={{ selected: isFocused }}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            }}>
            <Image
              source={TAB_ICONS[route.name as keyof typeof TAB_ICONS]}
              style={styles.icon}
              contentFit="contain"
            />
            <ThemedText type="caption" color={isFocused ? 'primary' : 'muted'} style={styles.label}>
              {options.title ?? route.name}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.bg,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
    padding: 6,
    borderRadius: Radius.pill,
  },
  icon: {
    width: 22,
    height: 22,
  },
  label: {
    textAlign: 'center',
  },
});
