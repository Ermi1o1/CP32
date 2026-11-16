import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * One light tick for a deliberate action.
 *
 * On Android this uses the system haptic-feedback call, which needs NO
 * permission — the app's vibrate permission is removed on purpose (minimal
 * permissions, D21), and the older vibration calls would silently fail without
 * it. "Confirm" exists from Android 11; on older phones nothing happens.
 * Never throws; does nothing on the web.
 */
export function tick(kind: 'confirm' | 'undo' | 'select'): void {
  if (Platform.OS === 'web') return;
  const run =
    Platform.OS === 'android'
      ? Haptics.performAndroidHapticsAsync(kind === 'confirm' ? Haptics.AndroidHaptics.Confirm : Haptics.AndroidHaptics.Virtual_Key)
      : Haptics.impactAsync(kind === 'confirm' ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light);
  void run.catch(() => {});
}
