import { Text, type TextProps } from 'react-native';

import {
  Colors,
  type ThemeColor,
  Typography,
  type TypographyVariant,
} from '@/constants/theme';

export type ThemedTextProps = TextProps & {
  type?: TypographyVariant;
  color?: ThemeColor;
};

export function ThemedText({ style, type = 'body', color = 'ink', ...rest }: ThemedTextProps) {
  return <Text style={[Typography[type], { color: Colors[color] }, style]} {...rest} />;
}
