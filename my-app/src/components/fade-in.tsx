import { type ReactNode, useEffect } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

/**
 * RN port of Magic UI / 21st "Blur Fade" —
 * soft entrance with fade + slight rise.
 */
export function FadeIn({
  children,
  delay = 0,
  duration = 420,
  offset = 12,
  style,
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  offset?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(offset);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration, easing: Easing.out(Easing.cubic) }),
    );
    translateY.value = withDelay(
      delay,
      withTiming(0, { duration, easing: Easing.out(Easing.cubic) }),
    );
  }, [delay, duration, offset, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>;
}
