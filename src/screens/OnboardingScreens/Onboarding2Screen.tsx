// @ts-nocheck
// @ts-nocheck
/* eslint-disable */
import React from 'react';
import {Image} from 'react-native';
import {observer} from 'mobx-react';

import {OnboardingScaffold} from './components/OnboardingScaffold';
import {OnboardingBottomBar} from './components/OnboardingBottomBar';
import {OnboardingContent} from './components/OnboardingContent';
import {ItalicAccentTitle} from './components/ItalicAccentTitle';
import {HighlightText} from './components/HighlightText';
import {useOnboardingHandlers} from './useOnboardingHandlers';

export const Onboarding2Screen: React.FC = observer(() => {
  const {next, goBack} = useOnboardingHandlers(2);

  return (
    <OnboardingScaffold
      step={2}
      illustration={
        <Image
          source={require('../../../assets/Imagen generada por Gemini_8zvnhq8zvnhq8zvn.png')}
          style={{width: 110, height: 110}}
          resizeMode="contain"
        />
      }
      content={
        <OnboardingContent
          eyebrow="ASISTENCIA ACADÉMICA"
          title={
            <ItalicAccentTitle
              title="Formación y Saber "
              accent="Agroecológico"
            />
          }
          body={
            <HighlightText
              body="Interactúa con tutores inteligentes especializados en ciencias agrícolas, soberanía alimentaria y gestión comunitaria."
              phrases={['tutores inteligentes', 'soberanía alimentaria']}
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
