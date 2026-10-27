import { StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/theme';

export default function CoursesScreen() {
  return <View style={styles.screen} />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
});
