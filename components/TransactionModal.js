import React from 'react';
import { View, Text, TextInput, Button, Modal , TouchableOpacity} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../Styles';

const TransactionModal = ({ modalVisible, handleCancel, handleChange ,handleSave, editedTransaction}) => {
    return (<Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={handleCancel}
    >
    <View style={styles.modalContainer}>
    <View style={styles.modalView}>
        <View style={styles.modalRow}>
        <Text style={styles.label}>Date:</Text>
        <TextInput
            style={styles.input}
            value={editedTransaction.Date}
            onChangeText={(value) => handleChange('Date', value)}
        />
        </View>
        <View style={styles.modalRow}>
        <Text style={styles.label}>Description:</Text>
        <TextInput
            style={styles.input}
            value={editedTransaction.Description}
            onChangeText={(value) => handleChange('Description', value)}
        />
        </View>
        <View style={styles.modalRow}>
        <Text style={styles.label}>Amount:</Text>
        <TextInput
            style={styles.input}
            value={String(editedTransaction.Amount)}
            onChangeText={(value) => handleChange('Amount', value)}
            keyboardType="numeric"
        />
        </View>
        <View style={styles.modalRow}>
        <Text style={styles.label}>Category:</Text>
        <Picker
            selectedValue={editedTransaction.Category}
            style={styles.input}
            onValueChange={(value) => handleChange('Category', value)}
        >
            <Picker.Item label="Personal Expenses" value="Personal Expenses" />
            <Picker.Item label="Shared Expenses" value="Shared Expenses" />
            <Picker.Item label="Debt" value="Debt" />
        </Picker>
        </View>
        <View style={styles.modalButtonRow}>
        <TouchableOpacity style={styles.smallButton} onPress={handleCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        </View>
    </View>
    </View>
    </Modal>);
    };

export default TransactionModal;

