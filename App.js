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
  Button,
  PermissionsAndroid
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import RNAndroidNotificationListener from 'react-native-android-notification-listener';
import SmsAndroid from 'react-native-get-sms-android';

const App: () => React$Node = () => {
  // SMS
  const [smsList, setSmsList] = useState([]);

  async function checkPermissions() {
    console.log("Checking SMS permissions");
    let hasPermissions = false;
    try {
      // Check ReadSMS permission.
      hasPermissions = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_SMS
      );
      if (!hasPermissions) return false;

      // Check SendSMS permission.
      hasPermissions = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.SEND_SMS
      );
      if (!hasPermissions) return false;
    } catch (e) {
      console.error(e);
    }
    return hasPermissions;
  };
  
  async function requestPermissions() {
    let granted = {};
    try {
      console.log("Requesting SMS permissions");
      granted = await PermissionsAndroid.requestMultiple(
        [
          PermissionsAndroid.PERMISSIONS.READ_SMS,
          PermissionsAndroid.PERMISSIONS.SEND_SMS
        ],
        {
          title: "Example App SMS Features",
          message: "Example SMS App needs access to demonstrate SMS features",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      console.log(granted);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use SMS features");
      } else {
        console.log("SMS permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };
  
  async function handleOnPressListSMSButton(){
    console.log("handleOnPressListSMSButton");
    if (Platform.OS === "android") {
      try {
        // Request permission is no permission yet.
        if (!(await checkPermissions())) {
          await requestPermissions();
        }
  
        // List SMS if have permission.
        if (await checkPermissions()) {
          listSMS();
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      console.error("ListSMS feature is not available on iOS.");
    }
  };
  
  function listSMS(){
    // For full list of filter options, refer to Github Page's "List SMS Messages" section. (Github page: https://github.com/briankabiro/react-native-get-sms-android)
    let filter = {
      box: "inbox",
      maxCount: 5
    };
  
    SmsAndroid.list(
      JSON.stringify(filter),
      fail => {
        console.log("Failed with this error: " + fail);
      },
      (count, smsList) => {
        let arr = JSON.parse(smsList);
        console.log("Listing SMS (maxCount = 5):");
        console.log(arr);
        setSmsList(arr);
      }
    );
  };

  // function renderShowSMS() {
  //   setSmsList([]);

  //   console.log("smsList = ");
  //   console.log(smsList);
    
  //   return smsList.map(sms => {
  //     return (
  //       <View style={{ borderColor: "#bbb", borderWidth: 1 }} key={sms._id}>
  //         <Text>From: {sms.address}</Text>
  //         <Text>Body: {sms.body}</Text>
  //         <Text>Id: {sms._id}</Text>
  //         <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //           <Text>Date timestamp: {sms.date}</Text>
  //           <Button title="copy date" onPress={() => Clipboard.setString(sms.date.toString())}/>
  //         </View>
  //         <Text>Date (readable): {(new Date(sms.date).toString())}</Text>
  //       </View>
  //     );
  //   });
  // };

  // Android Notification Listener
  const [hasPermission, setHasPermission] = useState(false);
  const [lastNotification, setLastNotification] = useState(null);

  const handleOnPressPermissionButton = async () => {
    // This will request for permission. User will be directed to a page to enable notification access.
    RNAndroidNotificationListener.requestPermission();
  };

  const handleAppStateChange = async nextAppState => {
    // When there is a change in app state, we check permission status and update hasPermission.
    RNAndroidNotificationListener.getPermissionStatus().then(status => {
      setHasPermission((status !== 'denied').toString());
    });
  };

  const handleNotificationReceived = notification => {
    // When we receive a notification, we log it and set it to lastNotification.
    console.log(notification);
    setLastNotification(JSON.stringify(notification));
  };

  useEffect(() => {
    // Check permission status once screen is rendered.
    RNAndroidNotificationListener.getPermissionStatus().then(status => {
      setHasPermission((status !== 'denied').toString());
      if(status == 'denied'){
        console.error("hasPermission is denied. Need to request for notification permission.");
      }
    });

    // Link handleNotificationReceived function.
    RNAndroidNotificationListener.onNotificationReceived(
      handleNotificationReceived,
    );

    // Link handleAppStateChange function.
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  // JSX
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
              <Button title="Request Permission" onPress={handleOnPressPermissionButton}/>
            </View>
            <View style={styles.sectionContainer}>
              <Button title="List SMS" onPress={handleOnPressListSMSButton}/>
              <Text>{JSON.stringify(smsList)}</Text>
              {/* <ScrollView>{renderShowSMS()}</ScrollView> */}
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
