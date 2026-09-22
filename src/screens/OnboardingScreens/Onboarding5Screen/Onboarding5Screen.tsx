/* eslint-disable */
import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-paper';
import {observer} from 'mobx-react';

import {uiStore} from '../../../store';
import {useTheme} from '../../../hooks';
import type {TopicKey} from '../../../store/onboarding/types';
import {OnboardingScaffold} from './components/OnboardingScaffold';
import {OnboardingBottomBar} from './components/OnboardingBottomBar';
import {TopicChipGrid} from './components/TopicChipGrid';
import {useOnboardingHandlers} from './useOnboardingHandlers';
import {createStyles} from './styles';

export const Onboarding5Screen: React.FC = observer(() => {
  const {selectTopic, goBack} = useOnboardingHandlers(5);
  const theme = useTheme();
  const styles = createStyles(theme);

  const selected = uiStore.onboardingState.selectedTopic;

  // Temáticas adaptadas a la UCVAG
  const labels: Record<TopicKey, string> = {
    general: 'Agroecología General',
    coding: 'Soberanía Tecnológica',
    writing: 'Investigación Campesina',
    roleplay: 'Gestión Comunitaria',
  };

  const descriptions: Record<TopicKey, string> = {
    general: 'Producción sostenible y técnicas de cultivo tradicional.',
    coding: 'Herramientas libres e inteligencia artificial soberana.',
    writing: 'Sistematización de saberes y redacción académica.',
    roleplay: 'Organización popular y desarrollo colectivo.',
  };

  return (
    <OnboardingScaffold
      step={5}
      layout="top"
      content={
        <>
          <View style={styles.header}>
            <Text style={styles.title}>Áreas de Estudio UCVAG</Text>
            <Text style={styles.body}>
              Selecciona el área de conocimiento o investigación en la que
              deseas profundizar.
            </Text>
          </View>
          <TopicChipGrid
            selected={selected}
            onSelect={key => selectTopic(key)}
            labels={labels}
            descriptions={descriptions}
          />
        </>
      }
      bottomBar={
        <OnboardingBottomBar onBack={goBack} backAccessibilityLabel="Atrás" />
      }
    />
  );
});
