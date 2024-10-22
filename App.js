import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AsyncStorage from '@react-native-async-storage/async-storage';
import RecordScreen from './screens/RecordScreen';
import TransactionList from './screens/TransactionList';
import UserModal from './components/UserModal';

const Tab = createBottomTabNavigator();

const App = () => {
  const [user, setUser] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  const checkServer = async (url) =>{
    try { 
      const response = await fetch(`${url}/`, {
      method: 'Get',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    Alert.alert("Success","Server is online, you may use the Network features.")
    } catch (error) {
      Alert.alert("Note","Server is offline, Please confirm the URL is correct, and then Contact Joe.\n\nDW you can continue to use the App manually offline aswell")
    }
  } 

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      const storedUrl = await AsyncStorage.getItem('baseUrl');
      if (storedUser && storedUrl) {
        setUser(storedUser);
        setBaseUrl(storedUrl);
        setModalVisible(false);
        checkServer(storedUrl)
      } else {
        setModalVisible(true);
      }
    };

    loadUser();
  }, []);

  const handleSaveUser = async (username, baseUrl) => {
    await AsyncStorage.setItem('user', username);
    await AsyncStorage.setItem('baseUrl', baseUrl);
    setUser(username);
    setBaseUrl(baseUrl);
    checkServer(baseUrl)
  };

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  return (
    <NavigationContainer>
      <View style={styles.header}>
        <Text style={{color:"black",fontSize:18}}>Hiii {user}!</Text>
        {user === "Meena" && <Text style={styles.username}>{"\n"} I'm always Here for you My Love :*</Text>}
        <TouchableOpacity style={styles.smallButton} onPress={handleOpenModal}>
          <Text style={styles.buttonText}>Configure</Text>
        </TouchableOpacity>      
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarIcon: () => null,
          tabBarLabelStyle: { fontSize: 16, textAlign: 'center', paddingBottom: 10 },
          tabBarItemStyle: { paddingVertical: 5, height: 50, justifyContent: 'center' },
          tabBarLabel: ({ focused, color, position , children}) => (
            <Text style={{textAlignVertical:"center", paddingTop:10, textAlign: 'center', color: focused ? '#2196F3' : '#222', fontSize: 16, lineHeight: 20 }}>
              {children.split(' ').map((word, index) => (
                <Text key={index}>{word}{"\n"}</Text>
              ))}
            </Text>
          )
        }}
      >
        <Tab.Screen name="Record" children={() => <RecordScreen user={user} baseUrl={baseUrl}/>} />
        <Tab.Screen name="Personal" children={() => <TransactionList type="Personal Expenses" user={user} baseUrl={baseUrl} />} />
        <Tab.Screen name="Shared" children={() => <TransactionList type="Shared Expenses" user={user} baseUrl={baseUrl} />} />
        <Tab.Screen name="Borrowed" children={() => <TransactionList type="Debt" user={user} baseUrl={baseUrl} />} />
      </Tab.Navigator>
      <UserModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveUser}
        baseurl={baseUrl}
        user={user}
        checkServer={checkServer}
      />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  username: {
    fontSize: 10,
    color: 'black',
  },
  smallButton: {
    backgroundColor: '#d2afff',
    padding: 7,
    borderRadius: 20,
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
  },
});

export default App;
