import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, Modal , TouchableOpacity} from 'react-native';
import Styles from '../Styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addTransaction, getTransactionsBackup } from '../db_';


const UserModal = ({ visible, onClose, onSave ,user,baseurl, checkServer}) => {
  const [username, setUsername] = useState(user);
  const [baseUrl, setBaseUrl] = useState(baseurl);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      const storedUrl = await AsyncStorage.getItem('baseUrl');
      if (storedUser && storedUrl) {
        setUsername(storedUser);
        setBaseUrl(storedUrl);
        checkServer(storedUrl)
      }
    };

    loadUser();
  }, []);

  const handleBackup = async () => {
    if (!!username){
    try{
      const storedTransactions = await getTransactionsBackup(user);
      const storedTrans = JSON.parse(storedTransactions);

    console.log('Backup',baseUrl,{ "transactions": storedTrans})
      const response = await fetch(`${baseUrl}/transactions/${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "transactions": storedTrans})
      });

      const data = await response.json();
      Alert.alert("Success", "Backup complete");
    } catch (error) {
      Alert.alert("Error", "Error backing up transactinos:"+error);
    }
    

    }else {
      Alert.alert("Error", "No User");
    }
  }
  const handleRestore = async () =>{
    if (!!username){
    console.log('restore')
    try {
      const response = await fetch(`${baseUrl}/transactions/${username}`, {
        method: 'Get',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log("Restoring",username,data)
      data.transactions.forEach(t => {
        addTransaction(t.Date, t.Description,t.Amount,t.Category,id,username)
      });

      Alert.alert("Success", "Restore complete. Please Refresh individual screens to get latest results");
    } catch (error) {
       Alert.alert("Error","Error Restoring Transactions:"+ error);
    }
    } else {
      Alert.alert("Error", "No User");
    }
  }

  const handleSave = () => {
    if (!!username){
    onSave(username,baseUrl);
    onClose();}else {
      Alert.alert("Error", "No User");
    }
  };
  const handleCancel = () => {
    if (!!username){
    onClose();}else {
      Alert.alert("Error", "No User");
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Enter Username</Text>
          <TextInput
            style={[styles.input,{textAlign:'center'}]}
            value={username}
            onChangeText={setUsername}
            placeholder="Username.."
          />
          <Text style={styles.modalText}>Enter URL</Text>
          <TextInput
            style={styles.input}
            value={baseUrl}
            onChangeText={setBaseUrl}
            placeholder="http://192.168.100.19:8000"
          />
          <View style={Styles.row} >
            <TouchableOpacity style={styles.smallButton} onPress={handleBackup}>
            <Text style={styles.buttonText}>Backup</Text>
          </TouchableOpacity>  
          <TouchableOpacity style={styles.smallButton} onPress={handleRestore}>
            <Text style={styles.buttonText}>Restore</Text>
          </TouchableOpacity> 
          </View>
          <View style={Styles.row} ><TouchableOpacity style={styles.smallButton} onPress={handleCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>  
          <TouchableOpacity style={styles.smallButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity> 
          </View>
           
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'black',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    color: 'black',
    borderWidth: 1,
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  smallButton: {
    backgroundColor: '#d2afff',
    padding: 15,
    borderRadius: 20,
    marginLeft: 10,
    marginTop: 10,
    width: 100,
    textAlign:"center"
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    textAlign:"center"
  },
});

export default UserModal;
