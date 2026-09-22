/* eslint-disable */
import {StyleSheet} from 'react-native';
import {EdgeInsets} from 'react-native-safe-area-context';
import {Theme} from '../../utils/types';

export const createStyles = (theme: Theme, insets: EdgeInsets) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#000000', // Fondo negro institucional soberano
    },
    container: {
      flexGrow: 1,
      padding: theme.spacing.default,
      paddingBottom: theme.spacing.default + insets.bottom,
    },
    card: {
      backgroundColor: '#121212', // Superficie oscura elegante
      borderRadius: theme.borders.default,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: '#CC0000', // Detalle sutil en rojo institucional en los bordes
      shadowColor: '#CC0000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    header: {
      padding: theme.spacing.default * 2,
      backgroundColor: '#1A0000', // Contenedor de cabecera con matiz rojo sobrio
      borderBottomWidth: 1,
      borderBottomColor: '#CC0000', // Línea divisoria en rojo UCVAG
    },
    headerContent: {
      gap: theme.spacing.default,
    },
    title: {
      ...theme.fonts.headlineLarge,
      color: '#FFFFFF', // Blanco puro institucional
      marginBottom: theme.spacing.default / 2,
      letterSpacing: -0.5,
      fontWeight: 'bold',
    },
    description: {
      color: '#E0E0E0', // Blanco humo para una lectura cómoda y formal
      marginBottom: theme.spacing.default,
      lineHeight: 24,
    },
    versionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.default / 2,
    },
    versionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#000000',
      paddingHorizontal: theme.spacing.default,
      paddingVertical: theme.spacing.default / 2,
      borderRadius: theme.borders.default,
      gap: theme.spacing.default / 2,
      borderWidth: 1,
      borderColor: '#CC0000', // Botón con acento rojo institucional
    },
    versionText: {
      ...theme.fonts.bodyMedium,
      color: '#FFFFFF',
    },
    llamaBuildText: {
      ...theme.fonts.bodySmall,
      color: '#B0B0B0',
      marginTop: theme.spacing.default / 2,
      opacity: 0.8,
    },
    section: {
      padding: theme.spacing.default * 2,
      borderBottomWidth: 1,
      borderBottomColor: '#262626',
      backgroundColor: '#0A0A0A',
    },
    sectionTitle: {
      ...theme.fonts.titleMedium,
      color: '#FFFFFF', // Títulos en blanco nítido
      marginBottom: theme.spacing.default,
      fontWeight: 'bold',
    },
    actionButton: {
      borderWidth: 1,
      borderColor: '#CC0000',
      backgroundColor: '#1A0000',
    },
    orText: {
      ...theme.fonts.bodyMedium,
      color: '#B0B0B0',
      textAlign: 'center',
      marginVertical: theme.spacing.default,
      opacity: 0.7,
    },
    feedbackButtonContent: {
      flexDirection: 'row-reverse',
    },
    feedbackForm: {
      padding: theme.spacing.default,
    },
    field: {
      marginBottom: theme.spacing.default,
    },
    label: {
      ...theme.fonts.labelMedium,
      color: '#FFFFFF',
      marginBottom: theme.spacing.default / 2,
    },
    segmentedButtons: {
      marginTop: theme.spacing.default / 2,
    },
    submitButton: {
      marginTop: theme.spacing.default,
      backgroundColor: '#CC0000', // Botón de acción principal en rojo UCVAG
    },
    secondaryButtons: {
      flexDirection: 'row',
    },
    legalRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: theme.spacing.default * 1.5,
      gap: theme.spacing.default / 2,
      backgroundColor: '#000000',
    },
    legalLink: {
      ...theme.fonts.bodySmall,
      color: '#FFFFFF', // Enlaces legales en blanco visible
    },
    legalSeparator: {
      ...theme.fonts.bodySmall,
      color: '#CC0000', // Separadores en rojo institucional
      opacity: 0.7,
    },
  });
