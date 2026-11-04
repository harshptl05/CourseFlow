import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { Colors, Layout, Radius, Spacing } from '@/constants/theme';
import { useCourseFlowDB } from '@/db/store';

export default function AuthScreen() {
  const router = useRouter();
  const { signIn, createAccount } = useCourseFlowDB();

  const [mode, setMode] = useState<'signIn' | 'createAccount'>('signIn');
  const [name, setName] = useState('Harsh Patel');
  const [university, setUniversity] = useState('UT Dallas');
  const [gmail, setGmail] = useState('prof@gmail.com');
  const [password, setPassword] = useState('cgs4352!');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = () => {
    setErrorMessage('');

    if (!gmail.trim() || !password.trim()) {
      setErrorMessage('Please enter both your email and password.');
      return;
    }

    if (mode === 'signIn') {
      signIn(gmail, password);
    } else {
      createAccount({
        name,
        university,
        gmail,
        password,
      });
    }

    router.replace('/');
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* --- Brand Header --- */}
        <View style={styles.brandSection}>
          <ThemedText type="caption" color="muted" style={styles.brandBadge}>
            COURSEFLOW · EDUCATOR WORKSPACE
          </ThemedText>
          <ThemedText type="display" style={styles.heroTitle}>
            {mode === 'signIn'
              ? 'Welcome back to\nyour reading room.'
              : 'Create your\nteaching workspace.'}
          </ThemedText>
          <ThemedText type="body" color="muted">
            Curated academic literature and daily briefs tailored to your courses.
          </ThemedText>
        </View>

        {/* --- Mode Switcher Tabs (Sign In / Create Account) --- */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabBtn, mode === 'signIn' && styles.tabBtnActive]}
            activeOpacity={0.8}
            onPress={() => {
              setMode('signIn');
              setErrorMessage('');
            }}
          >
            <ThemedText
              type="label"
              color={mode === 'signIn' ? undefined : 'muted'}
              style={mode === 'signIn' ? { color: Colors.primary } : undefined}
            >
              Sign in
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, mode === 'createAccount' && styles.tabBtnActive]}
            activeOpacity={0.8}
            onPress={() => {
              setMode('createAccount');
              setErrorMessage('');
            }}
          >
            <ThemedText
              type="label"
              color={mode === 'createAccount' ? undefined : 'muted'}
              style={mode === 'createAccount' ? { color: Colors.primary } : undefined}
            >
              Create account
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* --- Form Card --- */}
        <View style={styles.formCard}>
          {mode === 'createAccount' && (
            <>
              <View style={styles.fieldGroup}>
                <ThemedText type="label">Full name</ThemedText>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Harsh Patel"
                  placeholderTextColor={Colors.muted}
                  style={styles.textInput}
                />
              </View>

              <View style={styles.fieldGroup}>
                <ThemedText type="label">University</ThemedText>
                <TextInput
                  value={university}
                  onChangeText={setUniversity}
                  placeholder="UT Dallas"
                  placeholderTextColor={Colors.muted}
                  style={styles.textInput}
                />
              </View>
            </>
          )}

          <View style={styles.fieldGroup}>
            <ThemedText type="label">Email (Gmail)</ThemedText>
            <TextInput
              value={gmail}
              onChangeText={setGmail}
              placeholder="prof@gmail.com"
              placeholderTextColor={Colors.muted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.textInput}
            />
          </View>

          <View style={styles.fieldGroup}>
            <ThemedText type="label">Password</ThemedText>
            <View style={styles.passwordWrapper}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                placeholderTextColor={Colors.muted}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.passwordInput}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((prev) => !prev)}
                style={styles.eyeBtn}
                activeOpacity={0.7}
              >
                <Feather
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={18}
                  color={Colors.muted}
                />
              </TouchableOpacity>
            </View>
          </View>

          {errorMessage ? (
            <ThemedText type="caption" style={styles.errorText}>
              {errorMessage}
            </ThemedText>
          ) : null}

          <TouchableOpacity
            style={styles.submitBtn}
            activeOpacity={0.85}
            onPress={handleSubmit}
          >
            <ThemedText type="label" style={{ color: Colors.primary }}>
              {mode === 'signIn' ? 'Sign in to CourseFlow' : 'Create account & continue'}
            </ThemedText>
            <Feather name="arrow-right" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <ThemedText type="caption" color="muted" style={styles.footerNote}>
          Default demo credentials pre-filled: prof@gmail.com · cgs4352!
        </ThemedText>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  content: {
    paddingHorizontal: Layout.gutter,
    paddingTop: 72,
    paddingBottom: Spacing.xl * 2,
    gap: Spacing.xl,
  },
  brandSection: {
    gap: Spacing.sm,
  },
  brandBadge: {
    letterSpacing: 0.8,
  },
  heroTitle: {
    marginTop: 4,
  },
  tabRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabBtnActive: {
    backgroundColor: '#F2F2FF',
    borderColor: '#F2F2FF',
  },
  formCard: {
    backgroundColor: '#F5EFE6',
    borderRadius: Radius.md,
    padding: Spacing.lg,
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
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.ink,
  },
  eyeBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
  },
  errorText: {
    color: '#C0392B',
  },
  submitBtn: {
    backgroundColor: '#F2F2FF',
    borderRadius: Radius.md,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  footerNote: {
    textAlign: 'center',
  },
});