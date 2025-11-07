 import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {View, StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

// Screens
import {SettingsScreen} from '../screens/SettingsScreen';
import {TrackList} from '../components/TrackList';
import {NowPlaying} from '../components/NowPlaying';
import {Header} from '../components/Header';
import {useTrackPlayerSetup} from '../hooks/useTrackPlayerSetup';
import {useTrackPlayerEventsLogger} from '../hooks/useTrackPlayerEvents';

const Stack = createNativeStackNavigator();

const MainScreen = () => {
  const tracks = useTrackPlayerSetup();
  useTrackPlayerEventsLogger();

  return (
    <View style={styles.container}>
      <Header />
      <TrackList tracks={tracks} />
      <NowPlaying />
    </View>
  );
};

export const AppNavigator = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}>
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    paddingTop: 10,
  },
});
