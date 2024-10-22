import React from 'react';
import {StyleSheet} from 'react-native';


export default  styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white"
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  text: {
    flex: 1,
    fontSize: 16,
    paddingRight: 5,
    color: 'black',
  },
  input: {
    flex: 2,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 5,
    color: 'black',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "black",
    marginTop: 10,
  },
  smallButton: {
    backgroundColor: '#d2afff',
    padding: 10,
    borderRadius: 20,
    marginLeft: 10,
    minWidth:40,
    textAlign: "center"
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    textAlign: "center"
  },
  floatingButtonR: {
    backgroundColor: '#008080',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 75,
    right: 35,
  },
  floatingButton: {
    backgroundColor: '#2196F3',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    right: 35,
  },
  floatingButtonText: {
    color: 'white',
    fontSize: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  floatingButtonTextR: {
    color: 'white',
    fontSize: 14,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
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
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
  modalButtonRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
});
