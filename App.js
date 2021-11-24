import React, {useEffect} from 'react';
import {Button, SafeAreaView, Text, View, Platform} from 'react-native';
import {fcmService} from './src/services/FCMService';
import {localNotificationService} from './src/services/LocalNotificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  // useEffect(() => {
  //   fcmService.registerAppWithFCM();
  //   fcmService.register(onRegister, onNotification, onOpenNotification);
  //   localNotificationService.configure(onOpenNotification);

  //   function onRegister(token) {
  //     console.log('App onRegister ', token);
  //   }

  //   function onNotification(notify) {
  //     console.log('App onNotification ', notify);
  //     const options = {
  //       playSound: true,
  //       soundName: 'default',
  //     };

  //     localNotificationService.showNotification(
  //       0,
  //       notify.title,
  //       notify.body,
  //       notify,
  //       options,
  //     );
  //   }

  //   function onOpenNotification(notify) {
  //     console.log('App onOpenNotification ', notify);
  //     alert('Message', notify.body);
  //   }

  //   return () => {
  //     console.log('App unRegister');
  //     fcmService.unRegister();
  //     localNotificationService.unregister();
  //   };
  // }, []);
  //useEffect for FCM
  useEffect(() => {
    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(onOpenNotification);
    return () => {
      fcmService.unRegister();
      localNotificationService.unregister();
    };
  }, []);

  // Starts notification work
  const onRegister = async token => {
    const data = new FormData();
    data.append('mobile_device_t', token);

    console.log('TOKEN IS ==> ', token);
    //When api is successfull
    // const cbSuccess = message => {};
    // //When api is not successfull
    // const cbFailure = message => {
    //   alert(message);
    // };
    // dispatch(fcmTokenRequest(data, {token: headerData}, cbSuccess, cbFailure));
  };

  const onNotification = async (notifyRes, remoteMessage) => {
    if (Platform.OS === 'android') {
      onNotificationAndroid(remoteMessage);
    } else {
      // onNotificationIOS(remoteMessage);
    }
  };

  const onNotificationAndroid = remoteMessage => {
    console.log('onNotification in Message');
    let notify = {
      ...remoteMessage.data,
      ...remoteMessage.notification,
    };
    const options = {
      soundName: 'default',
      playSound: true,
    };
    localNotificationService.showNotification(
      0,
      notify.title,
      notify.body,
      notify,
      options,
    );
  };

  const onOpenNotification = async (notify, remoteMessage) => {
    // count = 1;

    console.log('onOpenNotification is Messages', notify);

    let notifyData = notify;
    if (Platform.OS === 'ios') {
      let typeData = await AsyncStorage.getItem('iOSForeground');
      if (typeData === 'true') {
        notifyData = notify?.item;
        await AsyncStorage.setItem('iOSForeground', 'false');
      }
    }

    switch (notifyData.type) {
      case 'New Message':
        //navigate to message detailed screen
        alert('Message', notify.body);

        // navigation.navigate('SendMessage', {
        //   name: notifyData?.contact_name,
        //   id: notifyData?.contact_id,
        // });
        break;
      default:
        return;
    }
    return;
  };
  //notification module ends here

  return (
    <SafeAreaView style={{justifyContent: 'center'}}>
      <Text>Sample Notitificaion App</Text>
      <Button
        title="Press Me!!!"
        onPress={() => localNotificationService.cancelAllLocalNotifications()}
        style={{width: '30% '}}
      />
    </SafeAreaView>
  );
};
export default App;
