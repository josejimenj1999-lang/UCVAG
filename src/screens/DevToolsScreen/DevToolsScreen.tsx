// @ts-nocheck
/* eslint-disable */
import React from 'react';
import {View, ScrollView, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Card, Text, Button, IconButton} from 'react-native-paper';
import {createStackNavigator} from '@react-navigation/stack';
import {useNavigation, ParamListBase} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';

import {useTheme} from '../../hooks';
import {createStyles} from './styles';
import {chatSessionRepository} from '../../repositories/ChatSessionRepository';
import {TestCompletionScreen, DatabaseInspectorScreen} from './screens';

// Define the stack navigator param list
type DevToolsStackParamList = {
  DevToolsHome: undefined;
  TestCompletion: undefined;
  DatabaseInspector: undefined;
};

const Stack = createStackNavigator<DevToolsStackParamList>();

// Define the navigation type
type DevToolsScreenNavigationProp = DrawerNavigationProp<ParamListBase>;

// Header button components
const BackButton = ({
  canGoBack,
  onPress,
  navigation,
}: {
  canGoBack?: boolean;
  onPress?: () => void;
  navigation: DevToolsScreenNavigationProp;
}) => (
  <IconButton
    icon="arrow-left"
    onPress={() => {
      if (canGoBack && onPress) {
        onPress();
      } else {
        navigation.goBack();
      }
    }}
  />
);

const MenuButton = ({
  navigation,
}: {
  navigation: DevToolsScreenNavigationProp;
}) => <IconButton icon="menu" onPress={() => navigation.openDrawer()} />;

// Main DevTools Home Screen
const DevToolsHomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const styles = createStyles(theme);

  const resetMigration = async () => {
    try {
      await chatSessionRepository.resetMigration();
      Alert.alert(
        'Éxito',
        'Reinicio de migración exitoso. Por favor reinicie la aplicación.',
      );
    } catch (error) {
      console.error('Failed to reset migration:', error);
      Alert.alert(
        'Error',
        'Fallo al reiniciar la migración: ' + (error as Error).message,
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        <Card elevation={1} style={styles.card}>
          <Card.Title title="Herramientas de Desarrollo UCVAG" />
          <Card.Content>
            <Text variant="bodyMedium" style={styles.description}>
              Estas herramientas son exclusivas para labores de desarrollo,
              soporte técnico y depuración institucional. No estarán disponibles
              en la versión de producción pública.
            </Text>
          </Card.Content>
        </Card>

        {/* Test Completion Card */}
        <Card elevation={1} style={styles.card}>
          <Card.Title title="Prueba de Completado de IA" />
          <Card.Content>
            <Text variant="bodyMedium" style={styles.description}>
              Prueba la API de completado con diversos parámetros y observa los
              resultados. Útil para verificar el comportamiento de los modelos
              locales.
            </Text>
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('TestCompletion' as never)}
                style={styles.button}>
                Abrir Prueba de Completado
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Database Inspector Card */}
        <Card elevation={1} style={styles.card}>
          <Card.Title title="Inspector de Base de Datos" />
          <Card.Content>
            <Text variant="bodyMedium" style={styles.description}>
              Visualiza e inspecciona el contenido de las tablas locales. Útil
              para verificar la persistencia de datos y la estructura interna.
            </Text>
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={() =>
                  navigation.navigate('DatabaseInspector' as never)
                }
                style={styles.button}>
                Abrir Inspector de Base de Datos
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Database Migration Card */}
        <Card elevation={1} style={styles.card}>
          <Card.Title title="Migración de Base de Datos" />
          <Card.Content>
            <Text variant="bodyMedium" style={styles.description}>
              Reinicia el indicador de migración y limpia la base de datos
              local. Útil para probar el proceso de transición hacia
              almacenamiento estructurado.
            </Text>
            <Text variant="bodyMedium" style={styles.warningText}>
              Advertencia: ¡Esto eliminará todos los datos almacenados en la
              base de datos!
            </Text>
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={() => {
                  Alert.alert(
                    'Reiniciar Migración',
                    'Esta acción eliminará todos los datos almacenados. ¿Está seguro de que desea continuar?',
                    [
                      {
                        text: 'Cancelar',
                        style: 'cancel',
                      },
                      {
                        text: 'Reiniciar',
                        style: 'destructive',
                        onPress: resetMigration,
                      },
                    ],
                  );
                }}
                style={styles.button}>
                Reiniciar Migración
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

// Stack Navigator for DevTools
export const DevToolsScreen: React.FC = () => {
  const theme = useTheme();
  const drawerNavigation = useNavigation<DevToolsScreenNavigationProp>();

  // Create header left component function
  const createHeaderLeft = (props: any) => (
    <BackButton
      navigation={drawerNavigation}
      canGoBack={props.canGoBack}
      onPress={props.onPress}
    />
  );

  // Create header options
  const screenOptions = {
    headerStyle: {
      backgroundColor: theme.colors.background,
    },
    headerTintColor: theme.colors.onBackground,
    headerLeft: createHeaderLeft,
  };

  // Create header menu component function
  const createHeaderMenu = () => <MenuButton navigation={drawerNavigation} />;

  // Create home screen options
  const homeScreenOptions = {
    title: 'Herramientas UCVAG',
    headerLeft: createHeaderMenu,
  };

  return (
    <Stack.Navigator
      initialRouteName="DevToolsHome"
      screenOptions={screenOptions}>
      <Stack.Screen
        name="DevToolsHome"
        component={DevToolsHomeScreen}
        options={homeScreenOptions}
      />
      <Stack.Screen
        name="TestCompletion"
        component={TestCompletionScreen}
        options={{
          title: 'Prueba de Completado',
        }}
      />
      <Stack.Screen
        name="DatabaseInspector"
        component={DatabaseInspectorScreen}
        options={{
          title: 'Inspector de Base de Datos',
        }}
      />
    </Stack.Navigator>
  );
};
