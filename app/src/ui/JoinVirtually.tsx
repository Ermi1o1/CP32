import React, { useCallback, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { Text } from './Text';
import { Icon } from './Icon';
import { Button } from './controls';
import { useTheme } from '@/theme/ThemeProvider';
import { useT } from '@/i18n';
import { VEP, vepUrlFor, type VepConfig } from '@/config/vep';

export type JoinState = 'idle' | 'opening' | 'unconfigured' | 'failed';

/**
 * Opens the virtual event platform in the system's in-app browser (Custom
 * Tabs on Android, SFSafariViewController on iOS), falling back to the
 * external browser. The browser makes the network requests, so the app itself
 * still needs no INTERNET permission (D80).
 */
export function useJoinVirtually(sessionId?: string, cfg: VepConfig = VEP) {
  const [state, setState] = useState<JoinState>('idle');
  const url = vepUrlFor(cfg, sessionId);
  const join = useCallback(async () => {
    if (!url) { setState('unconfigured'); return; }
    setState('opening');
    try {
      await WebBrowser.openBrowserAsync(url, {
        showTitle: true,
        enableBarCollapsing: true,
        createTask: false,
      });
      setState('idle');
    } catch {
      try {
        await Linking.openURL(url);
        setState('idle');
      } catch {
        setState('failed');
      }
    }
  }, [url]);
  return { state, join, configured: !!url, reset: () => setState('idle') };
}

/**
 * "Join virtually" button with its loading and error states. Errors render
 * as an explicit message in place, never a blank screen.
 */
export function JoinVirtually({ sessionId, kind = 'dark', wide = true, flex }: { sessionId?: string; kind?: 'dark' | 'primary' | 'tinted'; wide?: boolean; flex?: number }) {
  const { c, radius } = useTheme();
  const { t } = useT();
  const { state, join, reset } = useJoinVirtually(sessionId);

  if (state === 'unconfigured' || state === 'failed') {
    return (
      <View accessibilityLiveRegion="polite" style={{ flex, alignSelf: 'stretch', gap: 8, padding: 14, borderRadius: radius.lg, backgroundColor: c.warningBg }}>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <Icon name="triangle-alert" size={18} color="warning" stroke={2} />
          <Text variant="subhead" weight={700} color="warning" style={{ flexShrink: 1 }}>
            {t(state === 'unconfigured' ? 'vep.unconfigured' : 'vep.failed')}
          </Text>
        </View>
        <Text variant="footnote" color="text">{t(state === 'unconfigured' ? 'vep.unconfiguredSub' : 'vep.failedSub')}</Text>
        <Button kind="plain" label={t(state === 'failed' ? 'vep.retry' : 'vep.dismiss')} onPress={() => { if (state === 'failed') void join(); else reset(); }} />
      </View>
    );
  }

  if (state === 'opening') {
    return (
      <View accessible accessibilityLabel={t('vep.opening')} accessibilityLiveRegion="polite"
        style={{ flex, alignSelf: wide || flex ? 'stretch' : 'flex-start', minHeight: 54, borderRadius: radius.pill, backgroundColor: c.primarySoft, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 22 }}>
        <ActivityIndicator color={c.onPrimarySoft} />
        <Text variant="callout" weight={700} color="onPrimarySoft">{t('vep.opening')}</Text>
      </View>
    );
  }

  return <Button kind={kind} wide={wide} flex={flex} icon="radio" label={t('vep.join')} accessibilityHint={t('vep.joinHint')} onPress={() => { void join(); }} />;
}
