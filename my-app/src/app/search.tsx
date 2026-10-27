import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { Colors, Layout, Spacing } from '@/constants/theme';

export default function SearchScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      {/* Search Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Feather name="chevron-left" size={24} color={Colors.ink} />
          <ThemedText type="label">Explore</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <ThemedText type="display">Follow your curiosity.</ThemedText>
        <ThemedText type="caption" color="muted" style={{ marginTop: Spacing.sm }}>
          Search topics, papers & publishers
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    paddingHorizontal: Layout.gutter,
    paddingTop: 60, 
    paddingBottom: Spacing.md,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  content: {
    paddingHorizontal: Layout.gutter,
    paddingTop: Spacing.xl,
  },
});