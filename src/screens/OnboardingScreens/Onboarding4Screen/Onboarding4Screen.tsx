/* eslint-disable */
import React from 'react';
import {Image, View} from 'react-native';
import {observer} from 'mobx-react';

import {OnboardingScaffold} from './components/OnboardingScaffold';
import {OnboardingBottomBar} from './components/OnboardingBottomBar';
import {OnboardingContent} from './components/OnboardingContent';
import {ItalicAccentTitle} from './components/ItalicAccentTitle';
import {HighlightText} from './components/HighlightText';
import {useOnboardingHandlers} from './useOnboardingHandlers';
import {styles} from './styles';

export const Onboarding4Screen: React.FC = observer(() => {
  const {next, goBack} = useOnboardingHandlers(4);

  return (
    <OnboardingScaffold
      step={4}
      illustration={
        <View style={styles.illustrationWrap}>
          <Image
            source={require('../../../assets/Imagen generada por Gemini_8zvnhq8zvnhq8zvn.png')}
            style={{width: 110, height: 110}}
            resizeMode="contain"
          />
        </View>
      }
      content={
        <OnboardingContent
          eyebrow="SOBERANÍA TECNOLÓGICA"
          title={
            <ItalicAccentTitle
              title="Privacidad y Control "
              accent="Absoluto de Datos"
            />
          }
          body={
            <HighlightText
              body="Garantizamos la seguridad de la información institucional con modelos locales y total independencia tecnológica."
              phrases={[
                'independencia tecnológica',
                'seguridad de la información',
              ]}
            />
          }
        />
      }
      bottomBar={
        <OnboardingBottomBar
          primaryLabel="Continuar"
          onPrimary={next}
          onBack={goBack}
          backAccessibilityLabel="Atrás"
        />
      }
    />
  );
});
