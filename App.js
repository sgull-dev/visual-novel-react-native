//HORG2 Visual Novel Game for Android
//Author: Lauri Nurmi

import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { Text, View, ScrollView, TouchableOpacity, StyleSheet, BackHandler, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { myStyles } from './src/styles';

//Main Menu Component with menu buttons. Handle the quit-button behaviour.
//Send click data back to main App from other buttons.
const MainMenu = ({ onStartChapter, onStartEndings }) => {

  //quit button
  const handleButtonQuit = () => {
    //quit game
    BackHandler.exitApp();
    return true;
  };

  return (
    <View style={myStyles.content}>
      <Text style={myStyles.title}>HORG2</Text>

      <TouchableOpacity
        style={myStyles.button}
        onPress={onStartChapter}
      >
        <Text style={myStyles.buttonText}>Chapter 1</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={myStyles.button}
        onPress={onStartEndings}
      >
        <Text style={myStyles.buttonText}>Endings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={myStyles.button}
        onPress={handleButtonQuit}
      >
        <Text style={myStyles.buttonText}>Quit</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
};

//Chapter Component. This loads JSON dialogue data and then renders the page with the data.
const ChapterComponent = ({ onEnding, dialogueIndex }) => {
  //holds all the dialogue data
  const [jsonData, setJsonData] = useState(null);
  const [currentDialogue, setCurrentDialogue] = useState(dialogueIndex);

  const handleEndingPress = (endingIndex) => {
    onEnding({key:endingIndex.toString()});
  };

  const handleChoicePress = (index) => {
    setCurrentDialogue(index);
  }

  //load JSON data on first time this component renders
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = require('./data/dial.json');
        setJsonData(data);
      } catch(error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); //empty dependency array ensures that this effect runs once

  return (
    <View style={myStyles.content}>
      <ScrollView style={myStyles.scroll}>
        {jsonData && (
          <View style={myStyles.dialogueBox}>
            <Text style={myStyles.dialogueText}>{jsonData[currentDialogue.toString()]["dialogue"]}</Text>
          </View>
        )}

      </ScrollView>

      <View style={myStyles.buttonHolder}>
        {jsonData && (
          jsonData[currentDialogue.toString()].hasOwnProperty("choice_1") ? (
            <TouchableOpacity
              style={myStyles.button}
              onPress={() => handleChoicePress(jsonData[currentDialogue.toString()]["choice_1"][0])}
            >
              <Text style={myStyles.buttonText}>{jsonData[currentDialogue.toString()]["choice_1"][1]}</Text>
            </TouchableOpacity>
          ) : null
        )}
        {jsonData && (
          jsonData[currentDialogue.toString()].hasOwnProperty("choice_2") ? (
            <TouchableOpacity
              style={myStyles.button}
              onPress={() => handleChoicePress(jsonData[currentDialogue.toString()]["choice_2"][0])}
            >
              <Text style={myStyles.buttonText}>{jsonData[currentDialogue.toString()]["choice_2"][1]}</Text>
            </TouchableOpacity>
          ) : null
        )}
        {jsonData && (
          jsonData[currentDialogue.toString()].hasOwnProperty("ending") ? (
            <TouchableOpacity
              style={myStyles.button}
              onPress={() => handleEndingPress(jsonData[currentDialogue.toString()]["ending"][0])}
            >
              <Text style={myStyles.buttonText}>{jsonData[currentDialogue.toString()]["ending"][1]}</Text>
            </TouchableOpacity>
          ) : null
        )}
      </View>

    </View>
  );
};

//TO-DO:
//Endings Component. Handles the page for showing all the acquired endings.
//If a ending hasn't been gotten yet, instead it renders a locked-icon
const EndingsComponent = ({ onReturn, eData }) => {
  console.log("Entering EndingsComponent");
  console.log("EndingsData:", eData);
  const endingsData = eData

  const [jsonData, setJsonData] = useState(null);
  //load JSON data on first time this component renders
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = require('./data/endings.json');
        setJsonData(data);
      } catch(error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); //empty dependency array ensures that this effect runs once

  return (
    <View style={myStyles.content}>
      <ScrollView style={myStyles.scroll}>
        {jsonData &&
          Object.keys(endingsData).map((key) => (
            endingsData[key] ? (
              <View key={key} style={myStyles.dialogueBox}>
                <Text style={myStyles.endingText}>{jsonData[key]}</Text>
              </View>
            ) : (
              <View key={key} style={myStyles.dialogueBox}>
                <Text style={myStyles.endingText}>???</Text>
              </View>
            )
          ))
        }
      </ScrollView>
      <TouchableOpacity
        style={myStyles.button}
        onPress={onReturn}
      >
        <Text style={myStyles.buttonText}>Return</Text>
      </TouchableOpacity>
    </View>
  );
};

//Main App export. Keep track of app state with isDialogue and isEndings.
//Handle switching active page/component.
//Handle EndingsData
export default function App() {
  const [isDialogue, setIsDialogue] = useState(false);
  const [isEndings, setIsEndings] = useState(false);
  //structure for keeping track of acquired Endings
  const initialEndings = {
    "100": false,
    "101": false,
    "102": false,
    //add more endings as needed
  };
  const [endingsData, setEndingsData] = useState(initialEndings);
  //AsyncStorage saving for endingsData
  //Attempt to load saved data on startup
  useEffect(() => {
    const loadEndingsData = async () => {
      try {
        const savedEndingsData = await AsyncStorage.getItem('endingsData');

        if (savedEndingsData !== null) {
          setEndingsData(JSON.parse(savedEndingsData));
        }
      } catch (error) {
        console.error('Error loading endingsData:', error);
      }
    };

    //loadEndingsData(); //<-UNCOMMENT THIS TO GET LOADING TO WORK!! OFF FOR DEBUG
  }, []);

  //Save Endings Data when it changes
  useEffect(() => {
    const saveEndingsData = async () => {
      try {
        const jsonData = JSON.stringify(endingsData);
        await AsyncStorage.setItem('endingsData', jsonData);
      } catch (error) {
        console.error('Error saving endingsData:', error);
      }
    };

    saveEndingsData();
  }, [endingsData]);

  const startChapter = () => {
    setIsDialogue(true);
    setIsEndings(false);
  };

  const startEndings = () => {
    setIsDialogue(false);
    setIsEndings(true);
  };

  const startMenu = () => {
    setIsDialogue(false);
    setIsEndings(false);
  };

  //Set a ending to be achieved.
  const achieveEnding = ({ key }) => {
    // Create a copy of the current state
    const newData = {...endingsData};

    //Check if key is in object
    if (newData.hasOwnProperty(key)) {
      // Modify the desired value
      newData[key] = true;
      // Set the updated object back into the state
      console.log(`Setting key '${key}' to be true in the EndingsData`);
      setEndingsData(newData);

    } else {
      console.error(`Key '${key}' does not exist in endingsData`);
    }
    startMenu();
  };

  //Handle rendering correct page
  return (
    <SafeAreaView style={myStyles.container}>
    {
      isDialogue ? (
        <ChapterComponent onEnding={achieveEnding} dialogueIndex={1} />
      ) : isEndings ? (
        <EndingsComponent onReturn={startMenu} eData={endingsData}/>
      ) : (
        <MainMenu onStartChapter={startChapter} onStartEndings={startEndings} />
      )
    }
    <StatusBar style='#524133' />
    </SafeAreaView>
  )
};
