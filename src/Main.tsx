import { StackActions, useNavigation } from '@react-navigation/native'
import * as React from 'react'
import { Button, Text, View, PermissionsAndroid } from 'react-native'

const Main = () => {
  const navigation = useNavigation()

  const requestCameraPermission = async () => {
    const granted = await PermissionsAndroid.requestMultiple([
      // PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    ]);
  
    console.log('granted', granted);
    return granted;
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Unity Screen</Text>
      <Button
        title="Go to Unity"
        onPress={() => {
          requestCameraPermission();

          const pushAction = StackActions.push('Unity', {})
          navigation.dispatch(pushAction)
        }}
      />
    </View>
  )
}

export default Main