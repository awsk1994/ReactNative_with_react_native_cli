# Intro

Following:
 - "React Native - The Practical Guide [2020 Edition]"(Udemy, https://www.udemy.com/course/react-native-the-practical-guide/learn/lecture/15738488#overview), starting at section 13
 - https://reactnative.dev/docs/environment-setup

# Steps
1. Install react-native-cli
```
sudo npm install -g react-native-cli
```

2. Initialize project
```
react-native init <PROJECT_NAME>
```
 - Note that PROJECT_NAME cannot have dashes.etc.

3. Prepare Android Virtual Device (or Apple, but I don't have Apple right now)
 - Download Android Studio -> Set up and Run Virtual Device 
   - (Read more about it in https://reactnative.dev/docs/environment-setup)

4. Run a few terminal commands

```
npx react-native start
```
 - This starts something called Metro (the JavaScript bundler that ships with React Native).

```
npx react-native run-android
```
 - This will install the app onto the virtual android device.

<img src="./img/run-android-loading.png" height="500px"/>
<img src="./img/run-android-done.png" height="500px"/>

```
npx react-native run-ios
```
 - This will start an iPhone simulator, install app and run it.

5. Things to note about the structure of the project.
 - 

# Integrating Android Notification Listener
 - https://github.com/leandrosimoes/react-native-android-notification-listener

```js
const [hasPermission, setHasPermission] = useState(false);
const [lastNotification, setLastNotification] = useState(null);
```
 - First, we create 2 variables(hasPermission and lastNotification) and their setters.

```js
const handleOnPressPermissionButton = async () => {
  // This will request for permission. User will be directed to a page to enable notification access.
  RNAndroidNotificationListener.requestPermission();
};

const handleNotificationReceived = notification => {
  // When we receive a notification, we log it and set it to lastNotification.
  console.log(notification);
  setLastNotification(JSON.stringify(notification));
};
```
 - Then, we create the functions to execute:
   - handleOnPressPermissionButton:
     - This will request for permission. 
     - User will be directed to a page to enable notification access.
   - handleNotificationReceived:
     - Determines what to do with the notification received.
     - In this case, we log it and set it to lastNotification.

```js
const handleAppStateChange = async nextAppState => {
  // When there is a change in app state, we check permission status and update hasPermission.
  RNAndroidNotificationListener.getPermissionStatus().then(status => {
    setHasPermission((status !== 'denied').toString());
  });
};
```
   - handleAppStateChange:
     - When there is a change in app state, we update hasPermission variable.
     - To be honest, this method is kind of use-less; other than updating hasPermission variable.

```js
useEffect(() => {
  // Check permission status once screen is rendered.
  RNAndroidNotificationListener.getPermissionStatus().then(status => {
    setHasPermission((status !== 'denied').toString());
    if(status == 'denied'){
      console.error("hasPermission is denied. Need to request for notification permission.");
      // handleOnPressPermissionButton(); // Uncomment this to request permission when it is denied.
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
```
 - When page is rendered, check permission and link functions to listeners.

