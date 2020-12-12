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


===

Unconfirmed notes:
 - Download Android Studio -> Run virtual device (or usb connect android phone)


## Android Notification Listener
 - https://github.com/leandrosimoes/react-native-android-notification-listener
 