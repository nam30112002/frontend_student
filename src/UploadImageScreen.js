import React, { useEffect, useState } from 'react';
import { View, Button, Image, Alert, StyleSheet, Text } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { API_URL } from '@env'; // Import API_URL from .env file
import { getData } from './Utility'; // Custom utility function to get data from AsyncStorage

const UploadImageScreen = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [apiStatus, setApiStatus] = useState(null);

  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]); // Lấy phần base64
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const getImage = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + await getData("accessToken")); // Get access token from AsyncStorage

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(`${API_URL}/student/get-my-image`, requestOptions);

      setApiStatus(response.status); // Set the API status for conditional rendering

      if (response.status === 200) {
        const blob = await response.blob();
        const base64Data = await convertBlobToBase64(blob);
        return `data:image/jpeg;base64,${base64Data}`;
      } else if (response.status === 404) {
        return null; // Return null for 404 status to show the upload buttons
      }
    } catch (error) {
      console.error("Error fetching image: ", error);
    }
  };

  const loadImage = async () => {
    const uri = await getImage();
    setImageUri(uri);
  };

  useEffect(() => {
    loadImage();
  }, []);

  const handleChoosePhoto = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.error('Image Picker Error: ', response.errorCode);
      } else if (response.assets && response.assets.length > 0) {
        setSelectedImage(response.assets[0]);
      }
    });
  };

  const handleTakePhoto = () => {
    launchCamera({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.error('Camera Error: ', response.errorCode);
      } else if (response.assets && response.assets.length > 0) {
        setSelectedImage(response.assets[0]);
      }
    });
  };

  const handleUploadPhoto = async () => {
    if (!selectedImage) {
      Alert.alert('No photo selected', 'Please select or take a photo first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', {
      uri: selectedImage.uri,
      name: selectedImage.fileName || `photo.jpg`,
      type: selectedImage.type || 'image/jpeg',
    });

    try {
      const myHeaders = new Headers();
      myHeaders.append('Authorization', 'Bearer ' + await getData('accessToken'));

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formData,
        redirect: 'follow',
      };

      const response = await fetch(`${API_URL}/student/upload-my-image`, requestOptions);
      console.log(response);
      const result = await response.text();
      console.log(result);
      if (response.status === 413) {
        Alert.alert('Upload Failed', 'File size is too large. Please choose a smaller file. (<10MB)');
        return;
      }
      Alert.alert('Upload Successful', 'Photo has been uploaded successfully.');
      loadImage(); // Refresh the image after uploading
    } catch (error) {
      console.error('Error uploading photo: ', error);
      Alert.alert('Upload Failed', 'Failed to upload photo.');
    }
  };

  return (
    <View style={styles.container}>
      {apiStatus === 404 ? (
        <>
          <View style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>
              <Button title="Chọn ảnh thư viện" onPress={handleChoosePhoto} />
            </View>
            <View style={styles.buttonWrapper}>
              <Button title="Chụp ảnh" onPress={handleTakePhoto} />
            </View>
          </View>
          <View style={styles.uploadButton}>
            <Button title="Tải ảnh lên" onPress={handleUploadPhoto} disabled={!selectedImage} />
          </View>
        </>
      ) : (
        imageUri ? (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
            />
            <Text style={styles.infoText}>Bạn đã chụp ảnh. Bạn không thể tự thay đổi ảnh.</Text>
          </View>
        ) : (
          <Text>Loading...</Text>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 10,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  uploadButton: {
    width: '100%',
    marginTop: 20,
  },
  infoText: {
    textAlign: 'center',
    color: 'gray',
  },
});

export default UploadImageScreen;
