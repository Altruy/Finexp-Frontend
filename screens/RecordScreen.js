import React, { useState, useRef } from 'react';
import { Button, View, TextInput,TouchableOpacity, FlatList, Text, ActivityIndicator, StyleSheet, Modal, Alert } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { launchImageLibrary } from 'react-native-image-picker';
import { addTransaction } from '../db_';



function getFormattedDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear()).slice(-2);
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `_t-${day}-${month}-${year}-${hours}-${minutes}`;
}

const RecordScreen = ({ user,baseUrl }) => {
  const [textMessage, setTextMessage] = useState('');
  const [audioUri, setAudioUri] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);

  const appendTrans = async (transactions) => {
    transactions.forEach((tr) => addTransaction(tr.Date, tr.Description,tr.Amount, tr.Category, tr.id, user))
  }

  const startRecording = async () => {
    try {
      const result = await audioRecorderPlayer.startRecorder();
      setAudioUri(result);
      setIsRecording(true);
    } catch (error) {
      console.error(error);
    }
  };

  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      setAudioUri(result);
      setIsRecording(false);
    } catch (error) {
      console.error(error);
    }
  };

  const uploadAudio = async () => {
    if (audioUri) {
      const formData = new FormData();
      formData.append('file', {
        uri: audioUri,
        type: 'audio/mp4',
        name: user + getFormattedDate() + '.mp4',
      });

      try {
        Alert.alert("Success", "Audio uploaded for processing");
        const response = await fetch(`${baseUrl}/audio`, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        Alert.alert("Success", "Audio processing completed, Reload page to view updated Transactions");
        setTransactions(data.transactions);
        appendTrans(data.transactions)
      } catch (error) {
        Alert.alert("Error", "Failed to upload audio:"+ error);
        console.error(error);
      }
    }
  };

  const sendTextMessage = async () => {
    if (!!textMessage) {try {
      toSend = textMessage
      Alert.alert("Success", "Text uploaded for processing");
      setTextMessage('')
      const response = await fetch(`${baseUrl}/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textMessage, who: user })
      });

      const data = await response.json();
      console.log("ALLL ",data.transactions)
      Alert.alert("Success", "Text processing completed, Reload page to view updated Transactions");
      setTransactions(data.transactions);
      appendTrans(data.transactions)
    } catch (error) {
      Alert.alert("Error", "Failed to send text message:"+ error);
      console.error(error);
    }
  };}
    

  const uploadImage = async () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };
    launchImageLibrary(options, async (response) => {
      if (response.assets && response.assets.length > 0) {
        const { uri, type, fileName } = response.assets[0];
        setImageUri(uri);

        const formData = new FormData();
        formData.append('file', {
          uri,
          type: 'image/jpeg',
          name: user + getFormattedDate() + '.jpg',
        });

        try {
          Alert.alert("Success", "Image uploaded for processing");
          const response = await fetch(`${baseUrl}/image`, {
            method: 'POST',
            body: formData,
          });

          const data = await response.json();
          Alert.alert("Success", "Image processing completed, Reload page to view updated Transactions");
          setTransactions(data.transactions);
          appendTrans(data.transactions)
        } catch (error) {
          Alert.alert("Error", "Failed to upload image:"+ error);
          console.error(error);
        }
      }
    });
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={loading}
        onRequestClose={() => {
          setLoading(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.modalText}>Response Loading...</Text>
          </View>
        </View>
      </Modal>
      <TextInput
        style={styles.input}
        placeholder="Enter text message"
        value={textMessage}
        onChangeText={setTextMessage}
      />

      <TouchableOpacity style={styles.smallButton} onPress={sendTextMessage}>
        <Text style={styles.buttonText}>Send Text Message</Text>
      </TouchableOpacity>  

      <View style={{marginTop:10}}></View>

      <TouchableOpacity style={styles.smallButton} onPress={isRecording ? stopRecording : startRecording}>
        {!!isRecording && <Text style={styles.buttonText}>Stop Recording</Text>}
        {!isRecording && <Text style={styles.buttonText}>Start Recording</Text>}
      </TouchableOpacity>  
      
      <View style={{marginTop:10}}></View>
      {audioUri && (
        <TouchableOpacity style={styles.smallButton} onPress={uploadAudio}>
        <Text style={styles.buttonText}>Upload Voice Note</Text>
      </TouchableOpacity>  
      )}
      { audioUri &&     <View style={{marginTop:10}}></View>}
       <TouchableOpacity style={styles.smallButton} onPress={uploadImage}>
         <Text style={styles.buttonText}>Upload Image from Gallery</Text>
      </TouchableOpacity>  
      
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text>{item.Date} - {item.Description}: ${item.Amount} ({item.Category})</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor:"white"
  },
  input: {
    height: 40,
    color: 'black',
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    color: 'black',
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
    textAlign: 'center',
    marginBottom: 15,
    color: 'black',
  },
  smallButton: {
    backgroundColor: '#d2afff',
    padding: 15,
    borderRadius: 20,
    textAlign:"center"
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    textAlign:"center"
  },
});

export default RecordScreen;
