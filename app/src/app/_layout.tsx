import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router/stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, usePrefs, useTheme } from '@/theme/ThemeProvider';
import { FONT_FILES } from '@/theme/fonts';
import Welcome from '@/screens/Welcome';
import { AgendaProvider } from '@/state/agenda';

void SplashScreen.preventAutoHideAsync().catch(() => {});

function Shell() {
  const { c, dark } = useTheme();
  const { prefs, ready } = usePrefs();
  // Fonts come from the app package. A failure must never leave a blank screen,
  // so the app renders on error too (system font) and the release check catches it.
  const [fontsLoaded, fontError] = useFonts(FONT_FILES);
  const up = ready && (fontsLoaded || !!fontError);

  useEffect(() => {
    if (up) void SplashScreen.hideAsync().catch(() => {});
  }, [up]);

  if (!up) return <View style={{ flex: 1, backgroundColor: c.heroTo }} />;

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <StatusBar style={dark ? 'light' : 'dark'} />
      {prefs.welcomed ? (
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.bg }, animation: prefs.reduceMotion ? 'none' : 'default' }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
        </Stack>
      ) : (
        <Welcome />
      )}
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <AgendaProvider>
          <Shell />
        </AgendaProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
