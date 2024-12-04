import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as Location from 'expo-location';

const ReportIncidentScreen = () => {
  const [incidentDetails, setIncidentDetails] = useState({
    name: '',
    incident: '',
    details: '',
    latitude: null, // Use null instead of ''
    longitude: null, // Use null instead of ''
  });
  const handleChangeName = (text) => {
    setIncidentDetails((prevState) => ({ ...prevState, name: text }));
  };

  const handleChangeIncident = (text) => {
    setIncidentDetails((prevState) => ({ ...prevState, incident: text }));
  };

  const handleChangeDetails = (text) => {
    setIncidentDetails((prevState) => ({ ...prevState, details: text }));
  };

  const handleGetPosition = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied.');
        return;
      }
  
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      console.log('Latitude:', latitude);
      console.log('Longitude:', longitude);
  
      // Set latitude and longitude in the state
      setIncidentDetails((prevState) => ({
        ...prevState,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      }));
  
      Alert.alert('Success', 'Current position obtained successfully!');
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Error getting current location.');
    }
  };
  
  const handleSubmit = async () => {
    if (!incidentDetails.name.trim() || !incidentDetails.incident.trim() || !incidentDetails.details.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
  
    // Include latitude and longitude in the incidentDetails object
    const { latitude, longitude, ...data } = incidentDetails;
  
    // Log latitude and longitude before sending
    console.log('Latitude before sending:', latitude);
    console.log('Longitude before sending:', longitude);
  
    fetch('http://192.168.1.3:7027/Products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...data, latitude, longitude }) // Include latitude and longitude here
    })
    .then(response => {
      if (response.ok) {
        console.log('Incident reported successfully');
        Alert.alert('Success', 'Incident reported successfully!');
        setIncidentDetails({ name: '', incident: '', details: '', latitude: '', longitude: '' });
      } else {
        console.error('Failed to report incident');
        Alert.alert('Error', 'Failed to report incident. Please try again later.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to report incident. Please check your internet connection and try again.');
    });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Report Incident</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={incidentDetails.name}
        onChangeText={handleChangeName}
      />
      <TextInput
        style={styles.input}
        placeholder="Incident"
        value={incidentDetails.incident}
        onChangeText={handleChangeIncident}
      />
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Details"
        multiline
        numberOfLines={4}
        value={incidentDetails.details}
        onChangeText={handleChangeDetails}
      />
      <TouchableOpacity style={styles.getPositionButton} onPress={handleGetPosition}>
        <Text style={styles.getPositionButtonText}>Get Position</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
        <AntDesign name="arrowright" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: '100%',
    height: 40,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  descriptionInput: {
    height: 100,
  },
  getPositionButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  getPositionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    marginRight: 10,
  },
});

export default ReportIncidentScreen;
