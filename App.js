import React, {useEffect} from 'react';
import {Button, SafeAreaView, Text, View, Platform} from 'react-native';
import {fcmService} from './src/services/FCMService';
import {localNotificationService} from './src/services/LocalNotificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BannerAd,
  TestIds,
  BannerAdSize,
  InterstitialAd,
  AdEventType,
} from '@react-native-firebase/admob';

// const adUnitId = 'ca-app-pub-2057789293697798/3769008057';
// const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL);
//   , {
//   requestNonPersonalizedAdsOnly: true,
//   keywords: ['fashion', 'clothing'],
// });
const App = () => {
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

  // useEffect(() => {
  //   console.log('testing interstitial ad');
  //   const eventListener = interstitial.onAdEvent(type => {
  //     if (type === AdEventType.LOADED) {
  //       // setLoaded(true);
  //     }
  //   });

  //   // Start loading the interstitial straight away
  //   interstitial.load();

  //   // Unsubscribe from events on unmount
  //   return () => {
  //     eventListener();
  //   };
  // }, []);

    // interstitial.onAdEvent((type, error) => {
    //   if (type === AdEventType.LOADED) {
    //     interstitial.show();
    //   }

    //   interstitial.load();
    // });
  // });

  // useEffect(() => {
  //   admob()
  //     .setRequestConfiguration({
  //       // Update all future requests suitable for parental guidance
  //       maxAdContentRating: MaxAdContentRating.PG,

  //       // Indicates that you want your content treated as child-directed for purposes of COPPA.
  //       tagForChildDirectedTreatment: true,

  //       // Indicates that you want the ad request to be handled in a
  //       // manner suitable for users under the age of consent.
  //       tagForUnderAgeOfConsent: true,
  //     })
  //     .then(() => {
  //       // Request config successfully set!
  //       console.log('request fulfilled');
  //     });
  // }, []);

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
    console.log('onOpenNotification is Messages', notify);

    let notifyData = notify;
    if (Platform.OS === 'ios') {
      let typeData = await AsyncStorage.getItem('iOSForeground');
      if (typeData === 'true') {
        notifyData = notify?.item;
        await AsyncStorage.setItem('iOSForeground', 'false');
      }
    }
    alert('Message', notify.body);

    switch (notifyData.type) {
      case 'New Message':
        //navigate to message detailed screen

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
  // unitId={'ca-app-pub-9152919921144751/3203053032'}

  return (
    <SafeAreaView style={{flex: 1}}>
      <BannerAd
        size={BannerAdSize.ADAPTIVE_BANNER}
        unitId={'ca-app-pub-9152919921144751/3203053032'}
      />
      <Text style={{fontSize: 30, color: 'purple'}}>
        Sample Notification App
      </Text>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginVertical: 2,
        }}>
        <Button
          title="Press Me!!!"
          onPress={() => localNotificationService.cancelAllLocalNotifications()}
        />
        <BannerAd size={BannerAdSize.BANNER} unitId={TestIds.BANNER} />
        <Button
          title="Press Me for ad"
          onPress={() => {
            console.log('blabka');
            // interstitial.show();
          }}
        />
      </View>
    </SafeAreaView>
  );
};
export default App;

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

// useEffect(() => {
//   admob()
//     .setRequestConfiguration({
//       // Update all future requests suitable for parental guidance
//       maxAdContentRating: MaxAdContentRating.PG,

//       // Indicates that you want your content treated as child-directed for purposes of COPPA.
//       tagForChildDirectedTreatment: true,

//       // Indicates that you want the ad request to be handled in a
//       // manner suitable for users under the age of consent.
//       tagForUnderAgeOfConsent: true,
//     })
//     .then(() => {
//       // Request config successfully set!
//       console.log('request fulfilled');
//     });
// }, []);
