// import UnityView from '@azesmway/react-native-unity'
// import React, { useEffect, useRef, useState } from 'react'
// import { View } from 'react-native'


// interface IMessage {
//   gameObject: string
//   methodName: string
//   message: string
// }

// const Unity = () => {
//   const unityRef = useRef<UnityView>(null);
//   const [lastReceivedTime, setLastReceivedTime] = useState<number>(0);

//   // message to send to Unity
//   const message: IMessage = {
//     gameObject: '[Scripts]',
//     methodName: 'InitModule',
//     message: '{"scene": "GeoPoints"}'
//   }

//   // send message to Unity after 6 seconds
//   useEffect(() => {
//     setTimeout(() => {
//       if (unityRef && unityRef.current) {
//         // @ts-ignore
//         unityRef.current.postMessage(message.gameObject, message.methodName, message.message)
//       }
//     }, 6000)

//     return () => console.log('unmount')
//   }, [])

//   // handle message from Unity
//   const handleUnityMessage = (result: any) => {
//     const currentTime = Date.now();
//     if (currentTime - lastReceivedTime >= 5000) { // 5000 ms = 5 seconds
//       const message = result.nativeEvent.message;
//       console.log('GPS Data ===> ', message);
//       setLastReceivedTime(currentTime);
//     }
//   };

//   return (
//     // If you wrap your UnityView inside a parent, please take care to set dimensions to it (with `flex:1` for example).
//     // See the `Know issues` part in the README.
//     <View style={{ flex: 1 }}>
//       <UnityView
//         // @ts-ignore
//         ref={unityRef}
//         style={{ flex: 1 }}
//         onUnityMessage={handleUnityMessage}
//       />
//     </View>
//   )
// }

// export default Unity


import UnityView from '@azesmway/react-native-unity';
import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import RNFS from 'react-native-fs';

interface IMessage {
  gameObject: string;
  methodName: string;
  message: string;
}

const Unity = () => {
  const unityRef = useRef<UnityView>(null);
  const [lastReceivedTime, setLastReceivedTime] = useState<number>(0);
  const [gpsData, setGpsData] = useState<any[]>([]);

  // message to send to Unity
  const message: IMessage = {
    gameObject: '[Scripts]',
    methodName: 'InitModule',
    message: '{"scene": "GeoPoints"}'
  };

  // send message to Unity after 6 seconds
  useEffect(() => {
    setTimeout(() => {
      if (unityRef && unityRef.current) {
        // @ts-ignore
        unityRef.current.postMessage(message.gameObject, message.methodName, message.message);
      }
    }, 6000);

    return () => console.log('unmount');
  }, []);

  // function to write data to JSON file
  const writeDataToFile = async (data: any) => {
    const path = RNFS.DocumentDirectoryPath + '/gpsData.json';

    try {
      // Write the file
      // copy to local: adb exec-out run-as com.questaratest2rn cat /data/user/0/com.questaratest2rn/files/gpsData.json > /Users/tanx/Desktop/gpsData.json
      await RNFS.writeFile(path, JSON.stringify(data, null, 2), 'utf8');
      console.log('GPS data saved to file:', path);
    } catch (error) {
      console.error('Error writing file:', error);
    }
  };

  // handle message from Unity
  const handleUnityMessage = (result: any) => {
    const currentTime = Date.now();
    if (currentTime - lastReceivedTime >= 5000) { // 5000 ms = 5 seconds
      const message = result.nativeEvent.message;
      console.log('GPS Data ===> ', message);

      // Update the GPS data state
      setGpsData(prevData => {
        const newData = [...prevData, JSON.parse(message)];
        // Save updated data to file
        writeDataToFile(newData);
        return newData;
      });

      setLastReceivedTime(currentTime);
    }
  };

  return (
    // If you wrap your UnityView inside a parent, please take care to set dimensions to it (with `flex:1` for example).
    // See the `Know issues` part in the README.
    <View style={{ flex: 1 }}>
      <UnityView
        // @ts-ignore
        ref={unityRef}
        style={{ flex: 1 }}
        onUnityMessage={handleUnityMessage}
      />
    </View>
  );
};

export default Unity;
