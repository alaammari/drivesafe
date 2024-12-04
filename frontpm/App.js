import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';

// Import Screens
import SafetyTipsScreen from './SafetyTipsScreen';
import ReportsScreen from './ReportsScreen';
import ReportIncidentScreen from './ReportIncidentScreen';
import PotholeProximityAlert from './PotholeProximityAlert'; // Import the PotholeProximityAlert component

const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('./assets/background.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover">
      <View style={styles.container}>
        <Text style={styles.title}>Safe Drive</Text>
        <Text style={styles.subtitle}>Drive Safely, Arrive Safely</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('SafetyTips')}>
          <Text style={styles.buttonText}>Safety Tips</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ReportsScreen')}>
          <Text style={styles.buttonText}>Reported Incidents</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ReportIncident')}>
          <Text style={styles.buttonText}>Report Incident</Text>
        </TouchableOpacity>
        {/* New button to navigate to PotholeProximityAlert */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('PotholeProximityAlert')}>
          <Text style={styles.buttonText}>Pothole Proximity Alert</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SafetyTips" component={SafetyTipsScreen} />
        <Stack.Screen name="ReportsScreen" component={ReportsScreen} />
        <Stack.Screen name="ReportIncident" component={ReportIncidentScreen} />
        {/* Define a new screen for PotholeProximityAlert */}
        <Stack.Screen name="PotholeProximityAlert" component={PotholeProximityAlert} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff', // Changed to white
    marginBottom: 10,
    bottom: 30,
  },
  subtitle: {
    color: '#fff', // Changed to white
    bottom: 30,
    fontSize: 18,
    marginBottom: 30,
  },
  button: {
    bottom: 30,
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#8b008b', // border color same as title color
  },
  buttonText: {
    color: '#8b008b', // text color same as title color
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default App;
