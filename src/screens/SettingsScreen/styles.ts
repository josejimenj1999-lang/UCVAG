// @ts-nocheck
// @ts-nocheck
/* eslint-disable */
import {StyleSheet} from 'react-native';

import {Theme} from '../../utils/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      // Identidad UCVAG: Fondo seguro negro institucional
      backgroundColor: '#000000',
    },
    container: {
      padding: 16,
    },
    scrollViewContent: {
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
    card: {
      marginVertical: 8,
      borderRadius: 12,
      // Tarjetas con fondo sobrio adaptado al entorno institucional
      backgroundColor: '#121212',
    },
    settingItemContainer: {
      marginVertical: 16,
    },
    switchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 8,
    },
    textContainer: {
      flex: 1,
      marginRight: 16,
    },
    labelWithIconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    settingIcon: {
      marginRight: 8,
      // Acento de color institucional rojo para iconos destacados
      color: '#CC0000',
    },
    textLabel: {
      color: '#FFFFFF',
      fontWeight: '600',
    },
    textDescription: {
      color: '#B0B0B0',
    },
    divider: {
      marginVertical: 12,
      backgroundColor: '#2A2A2A',
    },
    slider: {
      //marginVertical: 8,
      //height: 40,
    },
    textInput: {
      marginVertical: 8,
      backgroundColor: '#1E1E1E',
      color: '#FFFFFF',
    },
    invalidInput: {
      borderColor: '#CC0000',
      borderWidth: 1,
    },
    errorText: {
      color: '#CC0000',
      marginTop: 4,
    },
    menuContainer: {
      position: 'relative',
      flexShrink: 1,
      maxWidth: '55%',
    },
    menuButton: {
      minWidth: 100,
      maxWidth: '100%',
    },
    fullRowControl: {
      marginTop: 8,
      alignSelf: 'flex-start',
      maxWidth: '100%',
    },
    consentContainer: {
      marginVertical: 8,
    },
    consentButton: {
      alignSelf: 'flex-end',
      marginTop: 12,
    },
    buttonContent: {
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
    },
    advancedSettingsButton: {
      marginVertical: 8,
    },
    advancedSettingsContent: {
      marginTop: 8,
    },
    advancedAccordion: {
      height: 55,
      backgroundColor: '#121212',
    },
    accordionTitle: {
      fontSize: 14,
      color: '#CC0000',
      fontWeight: 'bold',
    },
    menu: {
      minWidth: 170,
      backgroundColor: '#1E1E1E',
    },
    linkContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
    },
    linkIcon: {
      marginLeft: 4,
    },
    segmentedButtons: {
      marginVertical: 8,
    },
  });
