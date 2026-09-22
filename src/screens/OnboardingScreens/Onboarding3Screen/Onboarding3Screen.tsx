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

export const Onboarding3Screen: React.FC = observer(() => {
  const {next, goBack} = useOnboardingHandlers(3);

  return (
    <OnboardingScaffold
      step={3}
      illustration={
        <Image
          source={require('../../../assets/Imagen generada por Gemini_8zvnhq8zvnhq8zvn.png')}
          style={{width: 110, height: 110}}
          resizeMode="contain"
        />
      }
      content={
        <OnboardingContent
          eyebrow="INVESTIGACIÓN Y SABER"
          title={
            <ItalicAccentTitle
              title="Herramientas para la "
              accent="Gestión del Conocimiento"
            />
          }
          body={
            <HighlightText
              body="Accede a recursos de análisis documental, síntesis de saberes y procesamiento de información académica al servicio del pueblo."
              phrases={['análisis documental', 'servicio del pueblo']}
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
