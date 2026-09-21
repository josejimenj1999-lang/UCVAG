import React from 'react';
import {Image} from 'react-native';
import {observer} from 'mobx-react';

import {OnboardingScaffold} from './components/OnboardingScaffold';
import {OnboardingBottomBar} from './components/OnboardingBottomBar';
import {OnboardingContent} from './components/OnboardingContent';
import {ItalicAccentTitle} from './components/ItalicAccentTitle';
import {HighlightText} from './components/HighlightText';
import {useOnboardingHandlers} from './useOnboardingHandlers';

export const Onboarding1Screen: React.FC = observer(() => {
  const {next} = useOnboardingHandlers(1);

  return (
    <OnboardingScaffold
      step={1}
      illustration={
        <Image
          source={require('../../../assets/Imagen generada por Gemini_8zvnhq8zvnhq8zvn.png')}
          style={{width: 120, height: 120}}
          resizeMode="contain"
        />
      }
      content={
        <OnboardingContent
          eyebrow="BIENVENIDA INSTITUCIONAL"
          title={
            <ItalicAccentTitle
              title="Universidad Campesina de Venezuela "
              accent="Argimiro Gabaldón"
            />
          }
          body={
            <HighlightText
              body="Plataforma soberana de inteligencia artificial para la investigación, el estudio y el desarrollo académico del campo venezolano."
              phrases={['Plataforma soberana', 'desarrollo académico']}
            />
          }
        />
      }
      bottomBar={
        <OnboardingBottomBar
          primaryLabel="Comenzar"
          onPrimary={next}
          showBack={false}
          backAccessibilityLabel="Atrás"
        />
      }
    />
  );
});
