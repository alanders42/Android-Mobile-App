import React, {useEffect, useState, useRef, useCallback} from 'react';
import { launchCamera } from 'react-native-image-picker';
import { Dimensions, StyleSheet, Image, View, Text, PermissionsAndroid, Button } from 'react-native';

const DeviceWidth = Dimensions.get('window').width;
const DeviceHeight = Dimensions.get('window').height;

const App = () => {
  const [imageSource, setImageSource] = useState(null);
  const [idImageSource, setIdImageSource] = useState(null);

  const requestGalleryPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Read Access',
          message: 'Ithemba wants access your gallery to retrieve photo',
          buttonNeutral: 'Ask Me Later',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.warn(err);
    }
  };
  
  const handleCameraLaunch = (launchCameraEvent) => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
      maxHeight: 2000,
      maxWidth: 2000,
    };
    const permission = requestGalleryPermission();
    if (permission) {
      launchCamera(options, response => {
        if (response.didCancel) {
          console.log('User cancelled camera');
        } else if (response.error) {
          console.log('Camera Error: ', response.error);
        } else {
          launchCameraEvent(response);
        }
      });
    }
  };
  
  const getCameraImage = (data, image) => {
    const uri = {uri: data.assets[0].uri || data.assets[0]?.[0]?.uri};
    image === 'id' ? setIdImageSource(uri) : setImageSource(uri);
  };

  return (
    <>
      <Button
        title="Add Portrait Photo"
        mode="outlined"
        contentStyle={{ height: 50 }}
        style={{ borderRadius: 10 }}
        onPress={() => handleCameraLaunch(data => getCameraImage(data, "image"))}>
        <Text> Add Portrait Photo </Text>
      </Button>
      <View
            style={{
              flexGrow: 0.1,
              alignSelf: 'flex-start',
              flexDirection: 'row',
            }}>
            <Image source={imageSource || null} style={styles.imageStyle} />
          </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageStyle: {
    width: DeviceWidth * 0.4,
    height: DeviceHeight * 0.25,
    borderRadius: 10,
    resizeMode: 'contain',
  },
});

export default App;
