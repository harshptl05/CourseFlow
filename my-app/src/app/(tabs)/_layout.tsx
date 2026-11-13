import { Tabs } from 'expo-router/js-tabs';
import { StyleSheet, View } from 'react-native';

import { CourseFlowHeader } from '@/components/course-flow-header';
import { CourseFlowTabBar } from '@/components/course-flow-tab-bar';
import { Colors } from '@/constants/theme';

export default function TabsLayout() {
  return (
    <View style={styles.container}>
      <CourseFlowHeader />

      <Tabs
        screenOptions={{ headerShown: false, sceneStyle: styles.scene }}
        tabBar={(props) => <CourseFlowTabBar {...props} />}>
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="saved" options={{ title: 'Saved' }} />
        <Tabs.Screen name="courses" options={{ title: 'Courses' }} />
        <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scene: {
    backgroundColor: Colors.bg,
  },
});