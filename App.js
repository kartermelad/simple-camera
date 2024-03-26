import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export default function App() {
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [permission, askForPermission] = Camera.useCameraPermissions();
  const [photos, setPhotos] = useState([]);
  let cameraRef = null;

  useEffect(() => {
    askForPermission();
  }, []);

  if (!permission) return <View />;
  if (!permission.granted) return <Text>No access to camera</Text>;

  async function takePhoto() {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      setPhotos([...photos, photo.uri]);
      Alert.alert(
        'Save Photo',
        'Do you want to save this photo to your gallery?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Save',
            onPress: () => saveToGallery(photo.uri),
          },
        ],
        { cancelable: false }
      );
    }
  }

  async function saveToGallery(uri) {
    await MediaLibrary.saveToLibraryAsync(uri);
    Alert.alert('Photo saved to gallery');
  }

  function toggleCameraType() {
    setType((currentType) =>
      currentType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={(ref) => (cameraRef = ref)}>
        <View style={styles.cameraBottomContainer}>
          <TouchableOpacity style={styles.cameraButton} onPress={toggleCameraType}>
            <Text style={styles.cameraButtonText}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cameraButton} onPress={takePhoto}>
            <Text style={styles.cameraButtonText}>Take Photo</Text>
          </TouchableOpacity>
        </View>
      </Camera>
      <View style={styles.listContainer}>
        {photos.map((photoUri, index) => (
          <View key={index} style={styles.photoContainer}>
            <Image source={{ uri: photoUri }} style={styles.photo} />
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => setPhotos(photos.filter((_, i) => i !== index))}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraBottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 10,
  },
  cameraButton: {
    marginHorizontal: 20,
  },
  cameraButtonText: {
    color: 'white',
    fontSize: 20,
  },
  listContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  photoContainer: {
    margin: 10,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  deleteText: {
    color: 'white',
    textAlign: 'center',
  },
});