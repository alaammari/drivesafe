import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';

const SafetyTipsScreen = () => {
  return (
    <ImageBackground
      source={require('./assets/background.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover">
      <View style={styles.container}>
        <Text style={styles.title}>Safety Tips</Text>
        <Text style={styles.tips}>
          • Do not drink and drive{'\n'}
          • Keep a safe distance from vehicles!{'\n'}
          • Buckle up before you drive{'\n'}
          • Do not drive on the wrong side{'\n'}
          • Always wear a helmet!{'\n'}
          • Always give an indicator while changing lanes{'\n'}
          • Drive within the speed limits{'\n'}
          • Don't use mobile phones while driving.{'\n'}
          • Do not jaywalk. Cross the road safely and use the zebra crossing{'\n'}
          • Be patient while driving!{'\n'}
          • Do not honk unnecessarily!{'\n'}
        </Text>
      </View>
    </ImageBackground>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20, 
    color: '#fff', 
  },
  tips: {
    fontSize: 16,
    color: '#fff', 
    textAlign: 'left',
    marginHorizontal: 20, 
    marginBottom: 50,
  },
});

export default SafetyTipsScreen;

