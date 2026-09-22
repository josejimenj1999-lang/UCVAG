/* eslint-disable */
import React, {useEffect} from 'react';
import {Text, View, Image} from 'react-native';
import {observer} from 'mobx-react';

import {modelStore, uiStore} from '../../../store';
import {useTheme} from '../../../hooks';
import {
  entryId,
  resolvePalForTopic,
} from '../../../store/onboarding/onboardingPals';
import {OnboardingScaffold} from './components/OnboardingScaffold';
import {OnboardingBottomBar} from './components/OnboardingBottomBar';
import {ItalicAccentTitle} from './components/ItalicAccentTitle';
import {DeviceInfoChip} from './components/DeviceInfoChip';
import {ModelRadioGroup, type ModelOption} from './components/ModelRadioGroup';
import {useOnboardingHandlers} from './useOnboardingHandlers';
import {createStyles} from './styles';

const formatSize = (bytes: number | undefined): string => {
  if (!bytes || bytes <= 0) {
    return '';
  }
  const gb = bytes / (1024 * 1024 * 1024);
  if (gb >= 1) {
    return `${gb.toFixed(1)} GB`;
  }
  return `${Math.round(bytes / (1024 * 1024))} MB`;
};

export const Onboarding6Screen: React.FC = observer(() => {
  const {goBack, finish, isFinishing} = useOnboardingHandlers(6);
  const theme = useTheme();
  const styles = createStyles(theme);
  const topic = uiStore.onboardingState.selectedTopic;
  const pal = resolvePalForTopic(topic);
  const selectedId = uiStore.onboardingState.selectedModelId;

  useEffect(() => {
    const inPalList = pal.models.some(m => entryId(m) === selectedId);
    if (!inPalList) {
      const recommended = pal.models.find(m => m.recommended);
      if (recommended) {
        uiStore.setOnboardingModelId(entryId(recommended));
      }
    }
  }, [pal.key, selectedId]);

  const canFinish = selectedId !== null && !isFinishing;
  const isDownloaded = (id: string): boolean =>
    !!modelStore.models.find(m => m.id === id)?.isDownloaded;

  const options: ModelOption[] = pal.models.map(entry => {
    const id = entryId(entry);
    const sizeSegment = formatSize(entry.sizeBytes);
    const downloaded = isDownloaded(id);
    const segments = [entry.displayName];
    if (sizeSegment) {
      segments.push(sizeSegment);
    }
    if (downloaded) {
      segments.push('Descargado');
    }
    return {
      id,
      title: `Modelo ${entry.tier}`,
      subtitle: segments.join(' · '),
      recommended: entry.recommended,
    };
  });

  const pickedEntry = selectedId
    ? pal.models.find(m => entryId(m) === selectedId)
    : undefined;
  const pickedDownloaded = selectedId ? isDownloaded(selectedId) : false;
  const sizeLabel = formatSize(pickedEntry?.sizeBytes);

  const primaryLabel = pickedDownloaded
    ? `Iniciar con ${pal.name}`
    : sizeLabel
      ? `Descargar y Configurar (${sizeLabel})`
      : `Configurar ${pal.name}`;

  return (
    <OnboardingScaffold
      step={6}
      layout="top"
      content={
        <>
          <View style={styles.header}>
            <Image
              source={require('../../../assets/Imagen generada por Gemini_8zvnhq8zvnhq8zvn.png')}
              style={{width: 75, height: 75, marginBottom: 10}}
              resizeMode="contain"
            />
            <ItalicAccentTitle title="Motor de IA UCVAG" align="center" />
            <Text style={styles.palBody}>
              Selecciona el modelo de procesamiento local adecuado para tu
              dispositivo y comienza tu experiencia académica soberana.
            </Text>
          </View>
          <DeviceInfoChip ramSuffix="RAM disponible" freeSuffix="Libre" />
          <View style={styles.options}>
            <Text style={styles.subtitle}>
              Selecciona la capacidad del modelo:
            </Text>
            <ModelRadioGroup
              options={options}
              selectedId={selectedId}
              recommendedBadgeLabel="Recomendado"
              onSelect={id => uiStore.setOnboardingModelId(id)}
            />
          </View>
        </>
      }
      bottomBar={
        <OnboardingBottomBar
          primaryLabel={primaryLabel}
          primaryGlyph={pickedDownloaded ? 'arrow-right' : 'download'}
          primaryGlyphPosition={pickedDownloaded ? 'trailing' : 'leading'}
          primaryDisabled={!canFinish}
          onPrimary={finish}
          onBack={goBack}
          backAccessibilityLabel="Atrás"
        />
      }
    />
  );
});
