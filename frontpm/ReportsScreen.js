import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Modal, TextInput, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReportsScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAuthStatus();
    getAllProducts();
  }, []);

  const checkAuthStatus = async () => {
    const authToken = await AsyncStorage.getItem('authToken');
    if (authToken) {
      setIsAdmin(true); // Set isAdmin to true if authToken exists
    }
  };

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://192.168.1.3:7027/Products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!isAdmin) {
      setLoginModalVisible(true);
      return;
    }
    try {
      const response = await fetch(`http://192.168.1.3:7027/Products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`
        },
      });
      if (response.ok) {
        console.log('Product deleted successfully');
        // Update the product list after successful deletion
        setProducts(products.filter(product => product.id !== productId));
      } else {
        console.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error.message);
    }
  };

  const getAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      return token;
    } catch (error) {
      console.error('Error getting auth token:', error.message);
      return null;
    }
  };

  const saveAuthToken = async (token) => {
    try {
      await AsyncStorage.setItem('authToken', token);
    } catch (error) {
      console.error('Error saving auth token:', error.message);
    }
  };

  const login = async () => {
    try {
      const response = await fetch('http://192.168.1.3:7027/Authentication/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      if (response.ok) {
        const data = await response.json();
        await saveAuthToken(data.token);
        setLoginModalVisible(false);
        setIsAdmin(true); // Set isAdmin to true upon successful login
      } else {
        console.error('Failed to login');
      }
    } catch (error) {
      console.error('Error logging in:', error.message);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      setIsAdmin(false);
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reported Incidents</Text>
      <TouchableOpacity style={styles.refreshButton} onPress={getAllProducts}>
        <Ionicons name="refresh" size={24} color="white" />
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#007bff" />
      ) : (
        <ScrollView contentContainerStyle={styles.productContainer}>
          {products.map((product, index) => (
            <View key={index} style={styles.productItem}>
              <TouchableOpacity onPress={() => handleDelete(product.id)} style={styles.deleteButton}>
                <Ionicons name="close-circle-outline" size={24} color="red" />
              </TouchableOpacity>
              <View style={styles.productDetails}>
                <Text style={styles.text}>Name: {product.name}</Text>
                <Text style={styles.text}>Incident: {product.incident}</Text>
                <Text style={styles.text}>Details: {product.details}</Text>
                <Text style={styles.text}>Latitude: <Text>{product.latitude}</Text></Text>
                <Text style={styles.text}>Longitude: <Text>{product.longitude}</Text></Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={loginModalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>Please log in</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              onChangeText={setUsername}
              value={username}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              onChangeText={setPassword}
              value={password}
              secureTextEntry
            />
            <Button title="Login" onPress={login} />
          </View>
        </View>
      </Modal>
      {/* Logout button */}
      {isAdmin && (
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  refreshButton: {
    right:120,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 10,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 5,
  },
  loader: {
    marginTop: 20,
  },
  productContainer: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 20,
    backgroundColor: 'white',
  },
  productItem: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productDetails: {
    flex: 1,
    marginLeft: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  deleteButton: {
    padding: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '80%', // Set width to cover 80% of the screen
    maxWidth: 400, // Maximum width for larger screens
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  logoutButton: {
    alignSelf: 'flex-end',
    backgroundColor: 'red',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 10,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ReportsScreen;
