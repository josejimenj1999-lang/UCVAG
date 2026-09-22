// @ts-nocheck
/* eslint-disable */
import React, {useContext} from 'react';
import {View, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {useTheme} from '../../../hooks';
import {L10nContext} from '../../../utils';
import {ROUTES} from '../../../utils/navigationConstants';
import {createStyles} from './styles';

const SPLASH_MIN_DWELL_MS = 600;

/**
 * Brand splash — UCVAG (Universidad Campesina de Venezuela Argimiro Gabaldón).
 * Renders the institutional logo then transitions after `SPLASH_MIN_DWELL_MS`.
 */
export const SplashScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const l10n = useContext(L10nContext);

  React.useEffect(() => {
    const t = setTimeout(() => {
      navigation.replace(ROUTES.ONBOARDING.STEP_1);
    }, SPLASH_MIN_DWELL_MS);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <View testID="onboarding-splash" style={styles.root}>
      <Image
        source={require('../../../assets/Imagen generada por Gemini_8zvnhq8zvnhq8zvn.png')}
        style={{
          width: 220,
          height: 220,
        }}
        resizeMode="contain"
        accessibilityLabel={l10n.onboarding.splash.brand}
        accessibilityRole="image"
      />
    </View>
  );
};
