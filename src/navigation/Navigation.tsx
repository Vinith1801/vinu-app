import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {View, StyleSheet, Text, ActivityIndicator} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

// Screens
import {LibraryScreen} from '../screens/LibraryScreen';
import {SettingsScreen} from '../screens/SettingsScreen';
import {NowPlaying} from '../components/NowPlaying';
import {Header} from '../components/Header';
import {SearchScreen} from '../screens/SearchScreen';

// Hooks
import {useSetupTrackPlayer} from '../hooks/useSetupTrackPlayer';
import {useTrackPlayerEventsLogger} from '../hooks/useTrackPlayerEvents';

// Provider
import {PlayerProvider} from '../providers/PlayerProvider';

const Stack = createNativeStackNavigator();

const LibraryWithPlayer = () => {
  const isReady = useSetupTrackPlayer();
  useTrackPlayerEventsLogger();

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1DB954" />
        <Text style={styles.loadingText}>Initializing player...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <LibraryScreen />
      <NowPlaying />
    </View>
  );
};

export const AppNavigator = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <PlayerProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
            }}>
            <Stack.Screen name="Library" component={LibraryWithPlayer} />
            <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
            <Stack.Screen name="SearchScreen" component={SearchScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PlayerProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    paddingTop: 10,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
});
