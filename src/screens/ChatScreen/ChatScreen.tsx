// @ts-nocheck
/* eslint-disable */
import React, {useRef, ReactNode, useState} from 'react';

import {observer} from 'mobx-react';
import {runInAction} from 'mobx';
import {Alert, View, StyleSheet} from 'react-native';
import {Chip, Text} from 'react-native-paper';
import {pick, types} from '@react-native-documents/picker';

import {
  Bubble,
  ChatView,
  ErrorSnackbar,
  ModelErrorReportSheet,
} from '../../components';
import {PalSheet} from '../../components/PalsSheets';

import {useChatSession} from '../../hooks';
import {usePendingMessage} from '../../hooks/useDeepLinking';
import {Pal} from '../../types/pal';

import {
  modelStore,
  chatSessionStore,
  palStore,
  serverStore,
  uiStore,
} from '../../store';
import {hasVideoCapability} from '../../utils/pal-capabilities';

import {L10nContext} from '../../utils';
import {resolveReasoningCapability} from '../../utils/reasoningCapability';
import {MessageType} from '../../utils/types';
import {ErrorState} from '../../utils/errors';
import {user, assistant} from '../../utils/chat';
import {
  loadDocumentForChat,
  buildDocumentPrompt,
  LoadedDocument,
} from '../../utils/documentContext';

import {VideoPalScreen} from './VideoPalScreen';

const renderBubble = ({
  child,
  message,
  nextMessageInGroup,
  scale,
}: {
  child: ReactNode;
  message: MessageType.Any;
  nextMessageInGroup: boolean;
  scale?: any;
}) => (
  <Bubble
    child={child}
    message={message}
    nextMessageInGroup={nextMessageInGroup}
    scale={scale}
  />
);

export const ChatScreen: React.FC = observer(() => {
  const currentMessageInfo = useRef<{
    createdAt: number;
    id: string;
    sessionId: string;
  } | null>(null);
  const l10n = React.useContext(L10nContext);

  const activePalId = chatSessionStore.activePalId;
  const activePal = activePalId
    ? palStore.pals.find(p => p.id === activePalId)
    : undefined;
  const isVideoPal = activePal && hasVideoCapability(activePal);

  // State for pal sheet
  const [isPalSheetVisible, setIsPalSheetVisible] = useState(false);

  // State for model error report sheet
  const [isErrorReportVisible, setIsErrorReportVisible] = useState(false);
  const [errorToReport, setErrorToReport] = useState<ErrorState | null>(null);

  // State for UCVAG document-based research (RAG)
  const [loadedDocument, setLoadedDocument] = useState<LoadedDocument | null>(
    null,
  );
  const [isPickingDoc, setIsPickingDoc] = useState(false);

  const {handleSendPress, handleStopPress} = useChatSession(
    currentMessageInfo,
    user,
    assistant,
  );

  // Handler to pick documents for research and source citation
  const handlePickDocument = async () => {
    if (isPickingDoc) return;
    try {
      setIsPickingDoc(true);
      const result = await pick({
        type: [types.allFiles],
      });
      const [file] = result;
      if (file) {
        const doc = await loadDocumentForChat(
          file.uri,
          file.name || 'Documento Institucional UCVAG',
        );
        setLoadedDocument(doc);
      }
    } catch (error) {
      console.log('Selección de documento cancelada o fallida:', error);
    } finally {
      setIsPickingDoc(false);
    }
  };

  // Intercept send press to wrap message with document context if available
  const handleCustomSendPress = (messageText: string) => {
    let finalMessage = messageText;
    if (loadedDocument) {
      finalMessage = buildDocumentPrompt(loadedDocument, messageText);
    }
    handleSendPress(finalMessage);
  };

  // Handle deep linking for message prefill
  const {pendingMessage, clearPendingMessage} = usePendingMessage();

  // Callback handler for opening pal sheet
  const handleOpenPalSheet = React.useCallback((_pal: Pal) => {
    setIsPalSheetVisible(true);
  }, []);

  const handleClosePalSheet = React.useCallback(() => {
    setIsPalSheetVisible(false);
  }, []);

  // Handlers for model error report
  const handleReportModelError = React.useCallback(() => {
    if (modelStore.modelLoadError) {
      setErrorToReport(modelStore.modelLoadError);
      setIsErrorReportVisible(true);
      modelStore.clearModelLoadError();
    }
  }, []);

  const handleCloseErrorReport = React.useCallback(() => {
    setIsErrorReportVisible(false);
    setErrorToReport(null);
  }, []);

  const visionEnabled = modelStore.activeModelCaps.visionActive;

  // Resolver is the single source of truth for reasoning capability.
  const reasoningCapability = resolveReasoningCapability(
    modelStore.activeModel,
    serverStore.remoteReasoning,
  );
  const thinkingSupported =
    !!modelStore.activeModel && reasoningCapability.isReasoning !== 'no';

  const [thinkingEnabled, setThinkingEnabled] = useState(true);
  const [reasoningEffort, setReasoningEffort] = useState<string | undefined>(
    undefined,
  );
  const activeSession = chatSessionStore.sessions.find(
    s => s.id === chatSessionStore.activeSessionId,
  );
  React.useEffect(() => {
    let cancelled = false;
    chatSessionStore.getCurrentCompletionSettings().then(settings => {
      if (!cancelled) {
        setThinkingEnabled(settings.enable_thinking ?? true);
        setReasoningEffort(settings.reasoning?.effort);
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    chatSessionStore.activeSessionId,
    activeSession?.settingsSource,
    activeSession?.completionSettings,
    chatSessionStore.newChatCompletionSettings,
    chatSessionStore.newChatThinkingOverride,
    chatSessionStore.newChatReasoningEffort,
    activePalId,
  ]);

  // Tool-compatibility one-time banner
  React.useEffect(() => {
    const palDeclaresTools =
      activePal?.pact?.talents !== undefined &&
      activePal.pact.talents.length > 0;
    if (!palDeclaresTools) {
      return;
    }
    const model = (modelStore.context as any)?.model;
    const modelId = modelStore.activeModelId;
    if (!model || !modelId) {
      return;
    }
    const jinja = model.chatTemplates?.jinja;
    const hasToolSupport =
      !!jinja?.defaultCaps?.tools ||
      !!jinja?.defaultCaps?.toolCalls ||
      !!jinja?.toolUse ||
      !!jinja?.toolUseCaps;
    if (hasToolSupport) {
      return;
    }
    if (uiStore.hasWarnedToolCompat(modelId)) {
      return;
    }
    uiStore.setChatWarning({
      code: 'unknown',
      message: l10n.chat.toolCompatWarning,
      context: 'chat',
      recoverable: true,
      severity: 'warning',
      metadata: {modelId},
    });
    uiStore.markToolCompatWarned(modelId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePalId, modelStore.activeModelId, modelStore.context]);

  const persistReasoning = async (enabled: boolean, effort?: string) => {
    const currentSession = chatSessionStore.sessions.find(
      s => s.id === chatSessionStore.activeSessionId,
    );
    if (currentSession) {
      const resolvedSettings =
        await chatSessionStore.getCurrentCompletionSettings();
      await chatSessionStore.updateSessionCompletionSettings({
        ...resolvedSettings,
        enable_thinking: enabled,
        reasoning: {enabled, effort},
      });
    } else {
      runInAction(() => {
        chatSessionStore.newChatThinkingOverride = enabled;
        chatSessionStore.newChatReasoningEffort = effort;
      });
    }
  };

  const handleThinkingToggle = async (enabled: boolean) => {
    await persistReasoning(enabled);
  };

  const handleEffortCycle = async () => {
    const values = reasoningCapability.effortValues;
    if (values.length === 0) {
      return;
    }
    let nextEnabled: boolean;
    let nextEffort: string | undefined;
    if (!thinkingEnabled) {
      nextEnabled = true;
      nextEffort = values[0];
    } else {
      const idx = reasoningEffort ? values.indexOf(reasoningEffort) : -1;
      if (idx < 0 || idx >= values.length - 1) {
        nextEnabled = false;
        nextEffort = undefined;
      } else {
        nextEnabled = true;
        nextEffort = values[idx + 1];
      }
    }
    setThinkingEnabled(nextEnabled);
    setReasoningEffort(nextEffort);
    await persistReasoning(nextEnabled, nextEffort);
  };

  // If the active pal is a video pal, show the video pal screen
  if (isVideoPal) {
    return <VideoPalScreen activePal={activePal} />;
  }

  // Otherwise, show the regular chat view
  return (
    <>
      {/* Indicador visual de documento institucional adjunto para investigación UCVAG */}
      {loadedDocument && (
        <View style={styles.documentBadgeContainer}>
          <Chip
            icon="file-document-outline"
            onClose={() => setLoadedDocument(null)}
            style={styles.documentChip}>
            Fuente UCVAG: {loadedDocument.name}
          </Chip>
        </View>
      )}

      <ChatView
        renderBubble={renderBubble}
        messages={chatSessionStore.currentSessionMessages}
        activePal={activePal}
        onSendPress={handleCustomSendPress}
        onStopPress={handleStopPress}
        onPalSettingsSelect={handleOpenPalSheet}
        user={user}
        isStopVisible={modelStore.inferencing}
        isStreaming={modelStore.isStreaming}
        sendButtonVisibilityMode="always"
        showImageUpload={true}
        isVisionEnabled={visionEnabled}
        initialInputText={pendingMessage || undefined}
        onInitialTextConsumed={clearPendingMessage}
        inputProps={{
          showThinkingToggle: thinkingSupported,
          isThinkingEnabled: thinkingEnabled,
          onThinkingToggle: handleThinkingToggle,
          supportsEffort: reasoningCapability.supportsEffort,
          effortValues: reasoningCapability.effortValues,
          reasoningEffort,
          onEffortCycle: handleEffortCycle,
          // Añadimos un botón adicional o acción en los props si la vista de chat lo soporta, o puedes invocar handlePickDocument mediante un acceso directo.
        }}
        textInputProps={{
          placeholder: !modelStore.engine
            ? modelStore.isContextLoading
              ? l10n.chat.loadingModel
              : l10n.chat.modelNotLoaded
            : l10n.chat.typeYourMessage,
        }}
      />

      {/* Botón flotante rápido o sección para adjuntar documento UCVAG si se desea */}
      <View style={styles.floatingDocButtonWrapper}>
        <Chip
          icon="book-education-outline"
          mode="outlined"
          onPress={handlePickDocument}
          style={styles.pickDocChip}>
          {loadedDocument
            ? 'Cambiar Documento de Estudio'
            : 'Adjuntar Libro/Documento UCVAG'}
        </Chip>
      </View>

      {uiStore.chatWarning && (
        <ErrorSnackbar
          error={uiStore.chatWarning}
          onDismiss={() => uiStore.clearChatWarning()}
        />
      )}
      {modelStore.modelLoadError && (
        <ErrorSnackbar
          error={modelStore.modelLoadError}
          onDismiss={() => modelStore.clearModelLoadError()}
          onReport={handleReportModelError}
        />
      )}
      <ModelErrorReportSheet
        isVisible={isErrorReportVisible}
        onClose={handleCloseErrorReport}
        error={errorToReport}
      />
      {activePal && (
        <PalSheet
          isVisible={isPalSheetVisible}
          onClose={handleClosePalSheet}
          pal={activePal}
        />
      )}
    </>
  );
});

const styles = StyleSheet.create({
  documentBadgeContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: 'transparent',
  },
  documentChip: {
    alignSelf: 'flex-start',
  },
  floatingDocButtonWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 4,
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
  },
  pickDocChip: {
    marginVertical: 4,
  },
});
