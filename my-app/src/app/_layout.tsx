import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { Colors } from '@/constants/theme';

const CourseFlowTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.bg,
    card: Colors.bg,
    text: Colors.ink,
    primary: Colors.primary,
    border: Colors.border,
  },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={CourseFlowTheme}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
