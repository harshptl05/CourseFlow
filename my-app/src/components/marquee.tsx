import { useEffect, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Spacing } from '@/constants/theme';

/**
 * RN port of Magic UI / 21st "Marquee" —
 * infinite horizontal scroll for chips or media.
 */
export function Marquee({
  children,
  style,
  duration = 22000,
  gap = Spacing.md,
  reverse = false,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  duration?: number;
  gap?: number;
  reverse?: boolean;
}) {
  const progress = useSharedValue(0);
  const contentWidth = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration, easing: Easing.linear }),
      -1,
      false,
    );
  }, [duration, progress]);

  const trackStyle = useAnimatedStyle(() => {
    const travel = contentWidth.value + gap;
    if (travel <= 0) {
      return {};
    }
    const offset = progress.value * travel;
    return {
      transform: [{ translateX: reverse ? offset : -offset }],
    };
  });

  return (
    <View style={[styles.viewport, style]}>
      <Animated.View style={[styles.track, trackStyle]}>
        <View
          style={[styles.group, { marginRight: gap }]}
          onLayout={(event) => {
            contentWidth.value = event.nativeEvent.layout.width;
          }}>
          {children}
        </View>
        <View style={[styles.group, { marginRight: gap }]}>{children}</View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewport: {
    overflow: 'hidden',
  },
  track: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
