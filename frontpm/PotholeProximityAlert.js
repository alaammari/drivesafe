import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, View, Text, ImageBackground } from 'react-native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Audio } from 'expo-av'; 

const LOCATION_TASK_NAME = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    console.error('Location task error:', error);
    return;
  }
  if (data) {
    const { locations } = data;
    console.log('Received locations:', locations);
  }
});

const PotholeProximityAlert = () => {
  const [potholes, setPotholes] = useState([]);
  const [sound, setSound] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.1.3:7027/Products');
        if (!response.ok) {
          throw new Error('Failed to fetch potholes');
        }
        const data = await response.json();
        setPotholes(data);
      } catch (error) {
        console.error('Error fetching potholes:', error.message);
      }
    };

    fetchData();

    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('./alert.mp3')
      );
      setSound(sound);
    };
    loadSound();

    (async () => {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Highest,
        showsBackgroundLocationIndicator: true,
      });
    })();

    return () => {
      (async () => {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
        if (sound) {
          sound.unloadAsync();
        }
      })();
    };
  }, []);

  useEffect(() => {
    if (potholes.length > 0) {
      Location.getCurrentPositionAsync({}).then(({ coords }) => {
        console.log('User position:', coords.latitude, coords.longitude);
        potholes.forEach((pothole) => {
          const distance = calculateDistance(
            coords.latitude,
            coords.longitude,
            pothole.latitude,
            pothole.longitude
          );
          console.log('Distance to pothole:', distance);
          if (distance < 0.001) { 
            Alert.alert('Proximity Alert', 'You are close to a pothole!');
            if (sound) {
              sound.replayAsync();
            }
          }
        });
      });
    }
  }, [potholes, sound]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; 
    return distance;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  return (
    <ImageBackground source={require('./bg.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.text}>Pothole Proximity Alert</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 0, 0, 0.5)', // Red background with transparency
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    zIndex: 999,
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default PotholeProximityAlert;
