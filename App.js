import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createStackNavigator} from 'react-navigation'
import HomeScreen from './src/screens/HomeScreen'
import GameState from './src/screens/GameState'
import Settings from './src/screens/Settings';
import firebase from 'firebase'
 class App extends React.Component {


  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
      </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


export default createStackNavigator({
  HomeScreen : HomeScreen,
  GameState : GameState,
  Settings : Settings
}, navigationOptions ={
  headerMode : 'none'
})
