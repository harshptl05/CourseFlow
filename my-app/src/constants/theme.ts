export const Colors = {
  bg: '#faf9f6',
  ink: '#20212a',
  muted: '#747988',
  primary: '#5546c7',
  tint: '#f0eeff',
  cream: '#f7efdf',
  border: '#e9e8e4',
  white: '#ffffff',
  accent: '#8c5e1f',
} as const;

export type ThemeColor = keyof typeof Colors;

export const FontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  display: 'LibreBaskerville_400Regular',
} as const;

export const Typography = {
  display: { fontFamily: FontFamily.display, fontSize: 30, lineHeight: 38 },
  title: { fontFamily: FontFamily.semibold, fontSize: 22, lineHeight: 29 },
  label: { fontFamily: FontFamily.semibold, fontSize: 14, lineHeight: 20 },
  body: { fontFamily: FontFamily.regular, fontSize: 15, lineHeight: 23 },
  caption: { fontFamily: FontFamily.medium, fontSize: 12, lineHeight: 18 },
  meta: { fontFamily: FontFamily.medium, fontSize: 11, lineHeight: 16 },
} as const;

export type TypographyVariant = keyof typeof Typography;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const Radius = {
  sm: 8,
  md: 10,
  lg: 12,
  pill: 18,
} as const;

export const Layout = {
  gutter: 24,
  touchTarget: 44,
  courseCardWidth: 188,
} as const;
