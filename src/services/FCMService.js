import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FCMService {
  register = (onRegister, onNotification, onOpenNotification) => {
    this.checkPermission(onRegister);
    this.createNotificationListeners(
      onRegister,
      onNotification,
      onOpenNotification,
    );
  };

  registerAppWithFCM = async () => {
    if (Platform.OS === 'ios') {
      await messaging().registerDeviceForRemoteMessages();
      await messaging().setAutoInitEnabled(true);
    }
  };

  checkPermission = onRegister => {
    messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          // User has permissions
          this.getToken(onRegister);
        } else {
          // User doesn't have permission
          this.requestPermission(onRegister);
        }
      })
      .catch(error => {});
  };

  getToken = onRegister => {
    messaging()
      .getToken()
      .then(fcmToken => {
        if (fcmToken) {
          onRegister(fcmToken);
        } else {
        }
      })
      .catch(error => {});
  };

  requestPermission = onRegister => {
    messaging()
      .requestPermission()
      .then(() => {
        this.getToken(onRegister);
      })
      .catch(error => {});
  };

  deleteToken = () => {
    messaging()
      .deleteToken()
      .catch(error => {});
  };

  createNotificationListeners = (
    onRegister,
    onNotification,
    onOpenNotification,
  ) => {
    // When the application is running, but in the background
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        '[FCMService] onNotificationOpenedApp Notification caused app to open from background state:',
        remoteMessage,
      );
      if (remoteMessage) {
        const notification = remoteMessage.notification;
        let messageObject = {
          ...remoteMessage.data,
          ...notification,
        };
        onOpenNotification(messageObject, remoteMessage);
        // this.removeDeliveredNotification(notification.notificationId)
      }
    });

    // When the application is opened from a quit state.
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        console.log(
          '[FCMService] getInitialNotification Notification caused app to open from quit state:',
          remoteMessage,
        );

        if (remoteMessage) {
          const notification = remoteMessage.notification;
          let messageObject = {
            ...remoteMessage.data,
            ...notification,
          };
          onOpenNotification(messageObject, remoteMessage);
          //  this.removeDeliveredNotification(notification.notificationId)
        }
      });

    // Foreground state messages
    this.messageListener = messaging().onMessage(async remoteMessage => {
      console.log(
        'fcm message in foreground   [called twice]  ',
        remoteMessage,
      );
      if (remoteMessage) {
        let notification = null;
        if (Platform.OS === 'ios') {
          notification = remoteMessage.notification;
          await AsyncStorage.setItem('iOSForeground', 'true');
        } else {
          notification = remoteMessage.data;
        }
        onNotification(notification, remoteMessage);
      }
    });

    // Triggered when have new token
    messaging().onTokenRefresh(fcmToken => {
      onRegister(fcmToken);
    });
  };

  unRegister = () => {
    this.messageListener();
  };
}

export const fcmService = new FCMService();
