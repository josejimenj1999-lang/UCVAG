import {StyleSheet} from 'react-native';

import type {Theme} from '../../../utils/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      // Identidad visual UCVAG: Fondo negro institucional soberano
      backgroundColor: '#000000',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
