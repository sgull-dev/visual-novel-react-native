//StyleSheet for HORG2 Visual Novel game
//Author: Lauri Nurmi
//Date: 24.11.2023
import { StyleSheet } from 'react-native';

//Color Palette
const primaryBackgroundColor = '#524133';
const primaryTextColor = '#AE8864';
const boxColor = '#72543A';
const borderColor = '#90653D';

//StyleSheet
export const myStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: primaryBackgroundColor,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
    marginTop: 20,
  },
  buttonHolder: {
    marginVertical: 15,
  },
  title: {
    fontSize: 60,
    color: primaryTextColor,
    marginBottom: 50,
  },
  text: {
    fontSize: 20,
    color: primaryTextColor,
  },
  button: {
    lineHeight: 40,
    backgroundColor: boxColor,
    padding: 10,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: borderColor,
    textAlign: 'center',
    marginTop: 15,
  },
  buttonText: {
    fontSize: 30,
    color: primaryTextColor,
  },
  dialogueBox: {
    lineHeight: 40,
    backgroundColor: boxColor,
    padding: 10,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: borderColor,
    textAlign: 'center',
    marginTop: 15,
    marginHorizontal: 5,
    minWidth: 300,
  },
  dialogueText: {
    fontSize: 20,
    color: primaryTextColor,
  },
  endingText: {
    fontSize: 20,
    color: primaryTextColor,
    textAlign: 'center',
  },
  image: {
    alignSelf: 'center',
    width: 350,
    height: 250,
    marginVertical: 20,
  }
});
