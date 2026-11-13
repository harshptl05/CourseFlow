import { useEffect, type ReactNode } from 'react';
import {
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Colors, Radius } from '@/constants/theme';

/**
 * RN port of Magic UI / 21st "Shine Border" —
 * a soft highlight that travels the card edge.
 */
export function ShineBorder({
  children,
  style,
  duration = 3600,
  delay = 0,
  color = Colors.primary,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  duration?: number;
  delay?: number;
  color?: string;
}) {
  const progress = useSharedValue(0);
  const width = useSharedValue(0);
  const height = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration, easing: Easing.linear }), -1, false),
    );
  }, [delay, duration, progress]);

  const onLayout = (event: LayoutChangeEvent) => {
    width.value = event.nativeEvent.layout.width;
    height.value = event.nativeEvent.layout.height;
  };

  const beamStyle = useAnimatedStyle(() => {
    const w = width.value;
    const h = height.value;
    if (w === 0 || h === 0) {
      return { opacity: 0 };
    }

    const beam = 52;
    const perimeter = w * 2 + h * 2;
    const distance = progress.value * perimeter;

    if (distance < w) {
      return {
        opacity: 1,
        width: beam,
        height: 2,
        transform: [{ translateX: Math.min(distance, w - beam) }, { translateY: 0 }],
      };
    }
    if (distance < w + h) {
      return {
        opacity: 1,
        width: 2,
        height: beam,
        transform: [
          { translateX: w - 2 },
          { translateY: Math.min(distance - w, h - beam) },
        ],
      };
    }
    if (distance < w * 2 + h) {
      return {
        opacity: 1,
        width: beam,
        height: 2,
        transform: [
          { translateX: Math.max(w - beam - (distance - w - h), 0) },
          { translateY: h - 2 },
        ],
      };
    }
    return {
      opacity: 1,
      width: 2,
      height: beam,
      transform: [
        { translateX: 0 },
        { translateY: Math.max(h - beam - (distance - w * 2 - h), 0) },
      ],
    };
  });

  return (
    <View style={[styles.shell, style]} onLayout={onLayout}>
      {children}
      <View pointerEvents="none" style={styles.overlay}>
        <Animated.View style={[styles.beam, { backgroundColor: color }, beamStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    position: 'relative',
    borderRadius: Radius.xl,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    borderRadius: Radius.xl,
    overflow: 'hidden',
  },
  beam: {
    position: 'absolute',
    borderRadius: 2,
  },
});
