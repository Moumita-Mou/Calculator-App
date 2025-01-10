import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions, SafeAreaView, TouchableOpacity, Switch } from 'react-native';

//calculatng screen dimension 
const { width: SCREEN_WIDTH } = Dimensions.get('window');

//calculate button size in accordance to screen width
const btnSize = (SCREEN_WIDTH - 14 * 5) / 4;
const btnTextSize = 32;

export default function App() {

  //storing the states
  const [answerValue, setAnswerValue] = useState('0'); 
  const [readyToReplace, setReadyToReplace] = useState(true);
  const [memoryValue, setMemoryValue] = useState('0');
  const [operatorValue, setOperatorValue] = useState('0'); 
  const [problem, setProblem] = useState(''); 
  const [clearProblem, setClearProblem] = useState(false); 
  const [isACMode, setIsACMode] = useState(false); 
  const [isLightTheme, setIsLightTheme] = useState(false); 
  
 //button pressed events
  function buttonPressed(value) {
    //AC or C button
    if (value === (isACMode ? 'AC' : 'C')) {
      setAnswerValue('0');
      setMemoryValue('0');
      setOperatorValue('0');
      setReadyToReplace(true);
      setProblem('');
    }
    //operator buttons
    if (['/', 'x', '-', '+'].includes(value)) {
      if (operatorValue !== '') {
        const ans = calculateEquals();
        setAnswerValue(ans);
        setMemoryValue(ans);
        setReadyToReplace(true);
      }
      setMemoryValue(answerValue);
      setOperatorValue(value);
      setReadyToReplace(true);
    }

    //equal button
    if (value === '=') {
     
      const ans = calculateEquals();
      setAnswerValue(ans);
      setMemoryValue(0);
      setReadyToReplace(true);
      setOperatorValue('');
      setProblem(ans + '');
         
    }

    //excluding certain button being printed in the 'math-problem" area
    if (!['C', '+/-', '%', '=', 'AC'].includes(value)) {
      if (clearProblem) {
        setProblem(value);
        setClearProblem(false);
      } else {
        setProblem((previousValue) => previousValue + value);
      }
    }

   //handling the numbers
    if (!isNaN(value)) {
      setAnswerValue(handleNumber(value));
    }

   // ' +/- ' button
    if (value === '+/-') {
      setAnswerValue(`${parseFloat(answerValue) * -1}`);
    }

   // percentage button
    if (value === '%') {
      setAnswerValue(`${parseFloat(answerValue) / 100}`);
    }

  //point button
    if (value === '.') {
      setAnswerValue((previousValue) => previousValue + '.');
    }

 //zero button
    if (answerValue === '0') {
      return;
    }
  }
  
  //handles the numbers in the answer-value area
  function handleNumber(value) {
    if (readyToReplace) {
      setReadyToReplace(false);
      return value;
    } else {
      return answerValue === '0' ? value : Number(`${answerValue}${value}`);
    }
  }

  //computation for evaluating answer for equal-button clicks 
  function calculateEquals() {
    
    const previous = parseFloat(memoryValue); 
    const current = parseFloat(answerValue);

   //when no operator in use
    if (!operatorValue || operatorValue === '0') 
    {
       return current; //it returns the current value
    }

   //when operators in use
    let answer;
    switch (operatorValue) {
      case '+':
        answer = previous + current;
        return answer;
      case '-':
        answer = previous - current;
        return answer;
      case 'x':
        answer = previous * current;
        return answer;
      case '/':
        answer = previous / current;
        return answer;
    }
  }
 
  return (
    //allowing safe margins
    <SafeAreaView style={[styles.container, { backgroundColor: isLightTheme ? 'white' : 'black' }]}>

     {/*displaying the numbers in use for calculation as per theme*/}
      <Text style={[styles.problemText, { color: isLightTheme ? 'dodgerblue' : 'yellowgreen' }]}>{problem}</Text>

      {/*displaying the answer as per theme*/}
      <Text style={[styles.answerText, { color: isLightTheme ? 'black' : 'white' }]}>{answerValue}</Text>           
     {/*color theme & AC-mode toggle switches*/}
      <View style={styles.switchContainer}>
        <Text style= {[styles.switchText, {color: isLightTheme ? 'black' : 'white'}]}> AC/C </Text> 
        <Switch value={isACMode} onValueChange={(value) => setIsACMode(value)} 
           trackColor={{false: "grey", true: "teal"}}    
        />    
        <Text style= {[styles.switchText, {color: isLightTheme ? 'black' : 'white'}]}> Theme </Text>
        <Switch value={isLightTheme} onValueChange={(value) => setIsLightTheme(value)}
          trackColor={{false: "grey", true: "teal"}}
        />
      </View>

      {/*Calculator buttons*/} 
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.btn, styles.lightGreyButton]}
          onPress={() => buttonPressed(isACMode ? 'AC' : 'C')} 
        > 
          <Text style={styles.lightGreyButtonText}>{isACMode ? 'AC' : 'C'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.lightGreyButton]} onPress={() => buttonPressed('+/-')}>
          <Text style={styles.lightGreyButtonText}>+/-</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.lightGreyButton]} onPress={() => buttonPressed('%')}>
          <Text style={styles.lightGreyButtonText}>%</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.blueButton]} onPress={() => buttonPressed('/')}>
          <Text style={styles.blueButtonText}>/</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.btn, styles.darkGreyButton]} onPress={() => buttonPressed(7)}>
          <Text style={styles.darkGreyButtonText}>7</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.darkGreyButton]} onPress={() => buttonPressed(8)}>
          <Text style={styles.darkGreyButtonText}>8</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.darkGreyButton]} onPress={() => buttonPressed(9)}>
          <Text style={styles.darkGreyButtonText}>9</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.blueButton]} onPress={() => buttonPressed('x')}>
          <Text style={styles.blueButtonText}>x</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.btn, styles.darkGreyButton]} onPress={() => buttonPressed(4)}>
          <Text style={styles.darkGreyButtonText}>4</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.darkGreyButton]} onPress={() => buttonPressed(5)}>
          <Text style={styles.darkGreyButtonText}>5</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.darkGreyButton]} onPress={() => buttonPressed(6)}>
          <Text style={styles.darkGreyButtonText}>6</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.blueButton]} onPress={() => buttonPressed('-')}>
          <Text style={styles.blueButtonText}>-</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.btn, styles.darkGreyButton]} onPress={() => buttonPressed(1)}>
          <Text style={styles.darkGreyButtonText}>1</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.darkGreyButton]} onPress={() => buttonPressed(2)}>
          <Text style={styles.darkGreyButtonText}>2</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.darkGreyButton]} onPress={() => buttonPressed(3)}>
          <Text style={styles.darkGreyButtonText}>3</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.blueButton]} onPress={() => buttonPressed('+')}>
          <Text style={styles.blueButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.btn, styles.darkGreyButton, styles.wideButton]} onPress={() => buttonPressed(0)}>
          <Text style={[styles.darkGreyLongBtnText, styles.darkGreyButtonText]}>0</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.darkGreyButton]} onPress={() => buttonPressed('.')}>
          <Text style={styles.darkGreyButtonText}>.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.blueButton]} onPress={() => buttonPressed('=')}>
          <Text style={styles.blueButtonText}>=</Text>
        </TouchableOpacity>
      </View>

      {/*status-bar*/}
        <StatusBar style="light" />
    </SafeAreaView>
  );
  
}

const styles = StyleSheet.create({

  //container styling embedded with Safe Area View
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  //Switch Container styling
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 60,
    marginBottom: 10,
    // marginleft: 45
  },
    
  //switch title texts styling
  switchText:{
    fontWeight: "bold",
    fontSize: 19
  },

  //problem-text styling
    problemText: {
    alignSelf: 'flex-end',
    color: 'yellowgreen',
    fontSize: 28,
    marginRight: 14,
  },

  //answer-text styling
  answerText: {
    color: 'white',
    fontSize: 68,
    marginRight: 14,
    alignSelf: 'flex-end',
  },

  //button-stylings
  buttonRow: {
    flexDirection: 'row',
    marginTop: 14,
    alignContent: 'space-between',
  },
  btn: {
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    width: btnSize,
    height: btnSize,
  },
  lightGreyButton: {
    backgroundColor: 'lightgrey',
    marginRight: 14,
  },
  lightGreyButtonText: {
    fontSize: btnTextSize,
  },
  darkGreyButton: {
    marginRight: 14,
    backgroundColor: 'dimgrey',
  },
  darkGreyButtonText: {
    color: 'white',
    fontSize: btnTextSize,
  },
  darkGreyLongBtnText: {
    marginRight: 90,
  },
  blueButton: {
    backgroundColor: 'dodgerblue',
  },
  blueButtonText: {
    color: 'white',
    fontSize: btnTextSize,
  },
  wideButton: {
    width: btnSize * 2 + 14,
  },
});
