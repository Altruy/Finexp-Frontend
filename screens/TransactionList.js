import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import TransactionModal from '../components/TransactionModal';
import styles from '../Styles';
import {getAllTransactions, addTransaction, updateTransaction, deleteTransaction, getTransactions} from '../db_'

function getForDate() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear()).slice(-2);
  return `${day}/${month}/20${year}`;
}

const TransactionList = ({ type, user, baseUrl }) => {
  const [personalTransactions, setPersonalTransactions] = useState([]);
  const [sharedTransactions, setSharedTransactions] = useState([]);
  const [debtTransactions, setDebtTransactions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedTransaction, setEditedTransaction] = useState({ Date: '', Description: '', Amount: '', Category: type });

  useEffect(() => {
    loadTransactions();
  }, [type,user]);

  const loadTransactions = async () => {
    try {
      const storedTransactions = await getAllTransactions(user);
      const p = await getTransactions('Personal Expenses',user);
      const s = await getTransactions('Shared Expenses',user);
      const d = await getTransactions('Debt',user)
      console.log("p",p)
      console.log("s",s)
      console.log("d",d)

      // const storedTransactions = await ;
      // const storedTransactions = ;
      // console.log('load',storedTransactions)
      // if (storedTransactions) {
        // const parsedTransactions = JSON.parse(storedTransactions);
        setPersonalTransactions(p);
        setSharedTransactions(s);
        setDebtTransactions(d);
      // }
    } catch (error) {
      console.error("Error loading transactions:", error);
    }
  };

  const handleSave = () => {

    if (editingIndex !== null) {
      // Updating transaction
      updateTransaction(editedTransaction.Date,editedTransaction.Description,editedTransaction.Amount,editedTransaction.Category,editingIndex)
    } else {
      // Adding new transaction
      addTransaction(editedTransaction.Date,editedTransaction.Description,editedTransaction.Amount,editedTransaction.Category,uuidv4(),user)
    }
    setModalVisible(false);
    setEditedTransaction({ Date: getForDate(), Description: '', Amount: 0.0, Category: type });
    loadTransactions()
  };

  const handleDelete = (item) => {
    console.log('index',item)
    deleteTransaction(item.id)
    loadTransactions()
  };

  const handleEdit = (item) => {
    setEditedTransaction(item);
    setEditingIndex(item.id);
    setModalVisible(true);
  };

  const handleChange = (key, value) => {
    setEditedTransaction({ ...editedTransaction, [key]: value });
  };

  const handleCancel = () => {
    setModalVisible(false);
    setEditedTransaction({ Date: '', Description: '', Amount: 0.0, Category: type });
    setEditingIndex(null);
  };

  const transactions = type === 'Personal Expenses' ? personalTransactions :
  type === 'Shared Expenses' ? sharedTransactions :
  debtTransactions;

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item, _ }) => (
          <View style={styles.row}>
            <Text style={{ flex: 1, fontSize: 13, paddingRight: 5, color: "black", maxWidth: 50 }}>{item.Date}</Text>
            <Text style={{ flex: 1, fontSize: 14, paddingRight: 5, color: "black" }}>{item.Description}</Text>
            <Text style={{ flex: 1, fontSize: 14, paddingRight: 5, color: "black", maxWidth: 50 }}>€{item.Amount}</Text>
            <TouchableOpacity style={styles.smallButton} onPress={() => handleEdit(item)}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallButton} onPress={() => handleDelete(item)}>
              <Text style={styles.buttonText}>X</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Text style={styles.total}>
        Total: €{transactions.reduce((sum, t) => sum + parseFloat(t.Amount), 0).toFixed(2)}
      </Text>
      <TouchableOpacity
        style={styles.floatingButtonR}
        onPress={loadTransactions}
      >
        <Text style={styles.floatingButtonTextR}>R</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => {
          setEditingIndex(null);
          setEditedTransaction({ Date: getForDate(), Description: '', Amount: 0.0, Category: type });
          setModalVisible(true);
        }}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
      <TransactionModal
        modalVisible={modalVisible}
        handleCancel={handleCancel}
        handleChange={handleChange}
        handleSave={handleSave}
        editedTransaction={editedTransaction}
      />
    </View>
  );
};

export default TransactionList;
