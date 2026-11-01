import { useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { Colors, Layout, Radius, Spacing } from '@/constants/theme';
import { useCourseFlowDB } from '@/db/store';

const ITEM_HEIGHT = 44;

const TIME_SLOTS = [
  '5:00 AM', '5:30 AM',
  '6:00 AM', '6:30 AM',
  '7:00 AM', '7:30 AM',
  '8:00 AM', '8:30 AM',
  '9:00 AM', '9:30 AM',
  '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM',
  '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM',
  '5:00 PM', '5:30 PM',
  '6:00 PM', '6:30 PM',
  '7:00 PM', '7:30 PM',
  '8:00 PM', '8:30 PM',
  '9:00 PM', '9:30 PM',
  '10:00 PM',
];

export default function SettingsScreen() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<'main' | 'interests' | 'dailyBrief'>('main');
  const timeScrollRef = useRef<ScrollView>(null);

  const {
    interests,
    toggleInterest,
    dailyBriefEnabled,
    dailyBriefTime,
    toggleDailyBrief,
    setDailyBriefTime,
  } = useCourseFlowDB();

  const SETTINGS_LINKS = [
    { label: 'Notifications', onPress: () => {} },
    { label: 'Daily Brief preferences', onPress: () => setActiveView('dailyBrief') },
    { label: 'Content interests', onPress: () => setActiveView('interests') },
    { label: 'Manage courses', onPress: () => router.push('/courses') },
    { label: 'Account', onPress: () => {} },
  ];

  const handleTimeScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, TIME_SLOTS.length - 1));
    const selected = TIME_SLOTS[clampedIndex];
    if (selected && selected !== dailyBriefTime) {
      setDailyBriefTime(selected);
    }
  };

  const selectTimeSlot = (time: string, index: number) => {
    setDailyBriefTime(time);
    timeScrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: true });
  };

  if (activeView === 'dailyBrief') {
    const initialIndex = Math.max(0, TIME_SLOTS.indexOf(dailyBriefTime));

    return (
      <View style={styles.screen}>
        {/* --- Sub-header --- */}
        <View style={styles.subHeader}>
          <TouchableOpacity
            onPress={() => setActiveView('main')}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Feather name="chevron-left" size={20} color={Colors.primary} />
            <ThemedText type="label" style={styles.headerTitle}>
              Daily Brief
            </ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* --- Daily Brief Toggle Card --- */}
          <View style={styles.interestCard}>
            <ThemedText type="label">Daily Brief</ThemedText>

            <TouchableOpacity
              style={styles.toggleBtn}
              activeOpacity={0.7}
              onPress={toggleDailyBrief}
            >
              <ThemedText type="label" style={{ color: Colors.primary }}>
                {dailyBriefEnabled ? 'On' : 'Off'}
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* --- Delivery Time Section --- */}
          <View style={styles.deliverySection}>
            <ThemedText type="title">Delivery time</ThemedText>
            <ThemedText type="display" style={styles.selectedTimeDisplay}>
              {dailyBriefTime}
            </ThemedText>

            {/* --- Scrollable Time Wheel --- */}
            <View style={styles.wheelContainer}>
              <View style={styles.wheelHighlight} pointerEvents="none" />
              <ScrollView
                ref={timeScrollRef}
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                contentOffset={{ x: 0, y: initialIndex * ITEM_HEIGHT }}
                contentContainerStyle={styles.wheelContent}
                onMomentumScrollEnd={handleTimeScroll}
                onScrollEndDrag={handleTimeScroll}
              >
                {TIME_SLOTS.map((time, index) => {
                  const isSelected = time === dailyBriefTime;
                  return (
                    <TouchableOpacity
                      key={time}
                      style={styles.wheelItem}
                      activeOpacity={0.7}
                      onPress={() => selectTimeSlot(time, index)}
                    >
                      <ThemedText
                        type="label"
                        color={isSelected ? undefined : 'muted'}
                        style={[
                          styles.wheelText,
                          isSelected && styles.wheelTextSelected,
                        ]}
                      >
                        {time}
                      </ThemedText>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>

          <ThemedText type="caption" color="muted" style={styles.prototypeNote}>
            Preference controls are demonstrated in this prototype.
          </ThemedText>
        </ScrollView>
      </View>
    );
  }

  if (activeView === 'interests') {
    return (
      <View style={styles.screen}>
        {/* --- Sub-header --- */}
        <View style={styles.subHeader}>
          <TouchableOpacity
            onPress={() => setActiveView('main')}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Feather name="chevron-left" size={20} color={Colors.primary} />
            <ThemedText type="label" style={styles.headerTitle}>
              Content interests
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* --- Content Interest Cards --- */}
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.interestList}>
            {interests.map((item) => (
              <View key={item.id} style={styles.interestCard}>
                <ThemedText type="label">{item.name}</ThemedText>

                <TouchableOpacity
                  style={[
                    styles.toggleBtn,
                    !item.enabled && styles.toggleBtnOff,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => toggleInterest(item.id)}
                >
                  <ThemedText
                    type="label"
                    color={item.enabled ? undefined : 'muted'}
                    style={item.enabled ? { color: Colors.primary } : undefined}
                  >
                    {item.enabled ? 'On' : 'Off'}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <ThemedText type="title">Settings</ThemedText>

      {/* --- Profile Card --- */}
      <View style={styles.profileCard}>
        <ThemedText type="display" style={styles.initials}>
          HP
        </ThemedText>
        <ThemedText type="title" style={styles.name}>
          Harsh Patel
        </ThemedText>
        <ThemedText type="caption" color="muted">
          Your teaching workspace
        </ThemedText>
      </View>

      {/* --- Settings Menu Links --- */}
      <View style={styles.menuList}>
        {SETTINGS_LINKS.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={item.onPress}
          >
            <ThemedText type="label" style={{ color: Colors.primary }}>
              {item.label}
            </ThemedText>
            <Feather name="arrow-right" size={16} color={Colors.primary} />
          </TouchableOpacity>
        ))}
      </View>

      {/* --- Footer Tagline --- */}
      <ThemedText type="caption" color="muted" style={styles.footerText}>
        CourseFlow · A considered reading habit.
      </ThemedText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.gutter,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  headerTitle: {
    marginLeft: 4,
  },
  content: {
    paddingHorizontal: Layout.gutter,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl * 2,
    gap: Spacing.xl,
  },
  profileCard: {
    backgroundColor: '#F5EFE6',
    borderRadius: Radius.md,
    padding: Spacing.lg,
    gap: Spacing.xs,
  },
  initials: {
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  name: {
    marginBottom: 2,
  },
  menuList: {
    alignItems: 'center',
    gap: Spacing.xl + Spacing.sm,
    marginVertical: Spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
  },
  footerText: {
    marginTop: Spacing.sm,
  },
  interestList: {
    gap: Spacing.lg,
  },
  interestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleBtn: {
    backgroundColor: '#F2F2FF',
    borderRadius: Radius.md,
    paddingVertical: 10,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleBtnOff: {
    backgroundColor: Colors.bg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  deliverySection: {
    gap: Spacing.md,
  },
  selectedTimeDisplay: {
    marginTop: Spacing.xs,
  },
  wheelContainer: {
    height: ITEM_HEIGHT * 3,
    marginTop: Spacing.sm,
    position: 'relative',
    justifyContent: 'center',
  },
  wheelHighlight: {
    position: 'absolute',
    top: ITEM_HEIGHT,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: '#F2F2FF',
    borderRadius: Radius.md,
  },
  wheelContent: {
    paddingVertical: ITEM_HEIGHT,
  },
  wheelItem: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelText: {
    opacity: 0.5,
  },
  wheelTextSelected: {
    color: Colors.primary,
    opacity: 1,
  },
  prototypeNote: {
    marginTop: Spacing.md,
  },
});