/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  AppState,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import RNAndroidNotificationListener from 'react-native-android-notification-listener';

const App: () => React$Node = () => {
  console.log("Started.");
  const [hasPermission, setHasPermission] = useState(false);
  const [lastNotification, setLastNotification] = useState(null);

  // console.log("HasPermission = " + hasPermission);

  const handleOnPressPermissionButton = async () => {
    RNAndroidNotificationListener.requestPermission();
  };

  const handleAppStateChange = async nextAppState => {
    // console.log("handleAppStateChange1");
    RNAndroidNotificationListener.getPermissionStatus().then(status => {
      // console.log("handleAppStateChange2");
      setHasPermission(status !== 'denied');
    });
  };

  const handleNotificationReceived = notification => {
    console.log(notification);
    setLastNotification(JSON.stringify(notification));
  };

  useEffect(() => {
    RNAndroidNotificationListener.getPermissionStatus().then(status => {
      console.log("Status = " + status);
      setHasPermission(status !== 'denied');
      console.log("HasPermission = " + hasPermission);

      if(status == 'denied'){
        RNAndroidNotificationListener.requestPermission();
      }
    });

    RNAndroidNotificationListener.onNotificationReceived(
      handleNotificationReceived,
    );

    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text>hasPermission</Text>
              <Text>{hasPermission}</Text>
              <Text>lastNotification: </Text>
              <Text>{lastNotification}</Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Step One</Text>
              <Text style={styles.sectionDescription}>
                Edit <Text style={styles.highlight}>App.js</Text> to change this
                screen and then come back to see your edits.
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>See Your Changes</Text>
              <Text style={styles.sectionDescription}>
                <ReloadInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Debug</Text>
              <Text style={styles.sectionDescription}>
                <DebugInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Learn More</Text>
              <Text style={styles.sectionDescription}>
                Read the docs to discover what to do next:
              </Text>
            </View>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
