import { useEffect, type ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Colors, Radius } from '@/constants/theme';

/**
 * RN port of Magic UI / 21st "Shimmer Button" —
 * a soft light sweep across the button face.
 */
export function ShimmerButton({
  children,
  onPress,
  style,
  accessibilityLabel,
}: {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 2400, easing: Easing.linear }),
      -1,
      false,
    );
  }, [progress]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -80 + progress.value * 280 }],
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [styles.button, style, pressed && styles.pressed]}>
      <View pointerEvents="none" style={styles.shimmerMask}>
        <Animated.View style={[styles.shimmer, shimmerStyle]} />
      </View>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'relative',
    overflow: 'hidden',
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  shimmerMask: {
    ...StyleSheet.absoluteFill,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 64,
    backgroundColor: 'rgba(255,255,255,0.22)',
    transform: [{ skewX: '-18deg' }],
  },
});
