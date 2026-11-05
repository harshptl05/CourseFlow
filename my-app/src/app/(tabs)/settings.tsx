import { useEffect, useRef, useState } from 'react';
import {
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { Colors, Layout, Radius, Spacing } from '@/constants/theme';
import { getInitials, useCourseFlowDB } from '@/db/store';

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
  const navigation = useNavigation();
  const [activeView, setActiveView] = useState<
    'main' | 'interests' | 'dailyBrief' | 'account'
  >('main');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const timeScrollRef = useRef<ScrollView>(null);

  const {
    interests,
    toggleInterest,
    dailyBriefEnabled,
    dailyBriefTime,
    userProfile,
    toggleDailyBrief,
    setDailyBriefTime,
    updateUserProfile,
    signOut,
  } = useCourseFlowDB();

  const [pendingTime, setPendingTime] = useState<string>(dailyBriefTime);

  // Account form local state
  const [nameInput, setNameInput] = useState(userProfile.name);
  const [universityInput, setUniversityInput] = useState(userProfile.university);
  const [gmailInput, setGmailInput] = useState(userProfile.gmail);
  const [savedBanner, setSavedBanner] = useState(false);

  // Reset to the main Settings view whenever the Settings tab is pressed or re-entered
  useEffect(() => {
    const unsubscribeTabPress = (navigation as any).addListener('tabPress', () => {
      setShowConfirmModal(false);
      setActiveView('main');
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      setShowConfirmModal(false);
      setActiveView('main');
    });

    return () => {
      unsubscribeTabPress?.();
      unsubscribeBlur?.();
    };
  }, [navigation]);

  const openDailyBrief = () => {
    setPendingTime(dailyBriefTime);
    setActiveView('dailyBrief');
  };

  const openAccount = () => {
    setNameInput(userProfile.name);
    setUniversityInput(userProfile.university);
    setGmailInput(userProfile.gmail);
    setSavedBanner(false);
    setActiveView('account');
  };

  const SETTINGS_LINKS = [
    { label: 'Notifications', onPress: () => {} },
    { label: 'Daily Brief preferences', onPress: openDailyBrief },
    { label: 'Content interests', onPress: () => setActiveView('interests') },
    { label: 'Manage courses', onPress: () => router.push('/courses') },
    { label: 'Account', onPress: openAccount },
  ];

  const handleTimeScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, TIME_SLOTS.length - 1));
    const selected = TIME_SLOTS[clampedIndex];
    if (selected && selected !== pendingTime) {
      setPendingTime(selected);
    }
  };

  const selectTimeSlot = (time: string, index: number) => {
    setPendingTime(time);
    timeScrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: true });
  };

  const handleConfirmSave = () => {
    setDailyBriefTime(pendingTime);
    if (!dailyBriefEnabled) {
      toggleDailyBrief();
    }
    setShowConfirmModal(false);
    setActiveView('main');
  };

  const handleSaveAccount = () => {
    updateUserProfile({
      name: nameInput.trim() || 'Educator',
      university: universityInput.trim(),
      gmail: gmailInput.trim(),
    });
    setSavedBanner(true);
    setTimeout(() => {
      setSavedBanner(false);
      setActiveView('main');
    }, 600);
  };

  const handleSignOut = () => {
    signOut();
    setActiveView('main');
    router.replace('/auth');
  };

  /* --- Account Subscreen --- */
  if (activeView === 'account') {
    const previewInitials = getInitials(nameInput || userProfile.name);

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
              Account
            </ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* --- Live Profile Preview Card --- */}
          <View style={styles.profileCard}>
            <ThemedText type="display" style={styles.initials}>
              {previewInitials}
            </ThemedText>
            <ThemedText type="title" style={styles.name}>
              {nameInput.trim() || 'Your Name'}
            </ThemedText>
            <ThemedText type="caption" color="muted">
              {universityInput.trim()
                ? `${universityInput.trim()} · Teaching workspace`
                : 'Your teaching workspace'}
            </ThemedText>
            {gmailInput.trim() ? (
              <ThemedText type="caption" style={{ color: Colors.primary, marginTop: 2 }}>
                {gmailInput.trim()}
              </ThemedText>
            ) : null}
          </View>

          {/* --- Editable Form Fields --- */}
          <View style={styles.formSection}>
            <View style={styles.fieldGroup}>
              <ThemedText type="label">Full name</ThemedText>
              <TextInput
                value={nameInput}
                onChangeText={setNameInput}
                placeholder="Enter your full name"
                placeholderTextColor={Colors.muted}
                style={styles.textInput}
              />
            </View>

            <View style={styles.fieldGroup}>
              <ThemedText type="label">University</ThemedText>
              <TextInput
                value={universityInput}
                onChangeText={setUniversityInput}
                placeholder="e.g. UT Dallas"
                placeholderTextColor={Colors.muted}
                style={styles.textInput}
              />
            </View>

            <View style={styles.fieldGroup}>
              <ThemedText type="label">Gmail</ThemedText>
              <TextInput
                value={gmailInput}
                onChangeText={setGmailInput}
                placeholder="you@gmail.com"
                placeholderTextColor={Colors.muted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.textInput}
              />
            </View>
          </View>

          {/* --- Account Actions --- */}
          <View style={styles.accountActions}>
            <TouchableOpacity
              style={styles.primaryActionBtn}
              activeOpacity={0.8}
              onPress={handleSaveAccount}
            >
              <ThemedText type="label" style={{ color: Colors.primary }}>
                {savedBanner ? 'Saved ✓' : 'Save changes'}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signOutBtn}
              activeOpacity={0.7}
              onPress={handleSignOut}
            >
              <ThemedText type="label" style={styles.signOutText}>
                Sign out
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  /* --- Daily Brief Subscreen --- */
  if (activeView === 'dailyBrief') {
    const initialIndex = Math.max(0, TIME_SLOTS.indexOf(pendingTime));

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
              {pendingTime}
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
                  const isSelected = time === pendingTime;
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

            {/* --- Open Confirmation Popup Button --- */}
            <TouchableOpacity
              style={styles.primaryActionBtn}
              activeOpacity={0.8}
              onPress={() => setShowConfirmModal(true)}
            >
              <ThemedText type="label" style={{ color: Colors.primary }}>
                Set delivery time
              </ThemedText>
            </TouchableOpacity>
          </View>

          <ThemedText type="caption" color="muted" style={styles.prototypeNote}>
            Preference controls are demonstrated in this prototype.
          </ThemedText>
        </ScrollView>

        {/* --- Confirmation Popup Modal --- */}
        <Modal
          visible={showConfirmModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowConfirmModal(false)}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setShowConfirmModal(false)}
          >
            <Pressable style={styles.modalCard} onPress={() => {}}>
              <ThemedText type="caption" color="muted">
                CONFIRM DELIVERY TIME
              </ThemedText>
              <ThemedText type="display" style={styles.confirmTimeText}>
                {pendingTime}
              </ThemedText>
              <ThemedText type="body" color="muted" style={styles.confirmDescription}>
                Deliver your Daily Brief at {pendingTime} each day?
              </ThemedText>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.primaryActionBtn}
                  activeOpacity={0.8}
                  onPress={handleConfirmSave}
                >
                  <ThemedText type="label" style={{ color: Colors.primary }}>
                    Confirm
                  </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryActionBtn}
                  activeOpacity={0.7}
                  onPress={() => setShowConfirmModal(false)}
                >
                  <ThemedText type="label" color="muted">
                    Cancel
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    );
  }

  /* --- Content Interests Subscreen --- */
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

  /* --- Main Settings Screen --- */
  const initials = getInitials(userProfile.name);
  const workspaceSubtitle = userProfile.university
    ? `${userProfile.university} · Your teaching workspace`
    : 'Your teaching workspace';

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <ThemedText type="title">Settings</ThemedText>

      {/* --- Profile Card --- */}
      <TouchableOpacity
        style={styles.profileCard}
        activeOpacity={0.85}
        onPress={openAccount}
      >
        <ThemedText type="display" style={styles.initials}>
          {initials}
        </ThemedText>
        <ThemedText type="title" style={styles.name}>
          {userProfile.name}
        </ThemedText>
        <ThemedText type="caption" color="muted">
          {workspaceSubtitle}
        </ThemedText>
        {userProfile.gmail ? (
          <ThemedText type="caption" style={{ color: Colors.primary, marginTop: 2 }}>
            {userProfile.gmail}
          </ThemedText>
        ) : null}
      </TouchableOpacity>

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
  formSection: {
    gap: Spacing.lg,
  },
  fieldGroup: {
    gap: Spacing.xs,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.ink,
  },
  accountActions: {
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  primaryActionBtn: {
    backgroundColor: '#F2F2FF',
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  secondaryActionBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  signOutBtn: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 14,
    alignItems: 'center',
  },
  signOutText: {
    color: '#C0392B',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Layout.gutter,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: Colors.bg,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  confirmTimeText: {
    color: Colors.primary,
    marginVertical: Spacing.xs,
  },
  confirmDescription: {
    lineHeight: 22,
  },
  modalActions: {
    marginTop: Spacing.sm,
    gap: Spacing.xs,
  },
  prototypeNote: {
    marginTop: Spacing.md,
  },
});