import React from "react";
import { Text, View, SafeAreaView, Dimensions, TouchableOpacity, StatusBar,
Image, AsyncStorage, Switch, Animated} from "react-native";
import {Constants, Font} from 'expo'
import Expo from 'expo'
import firebase from 'firebase'

import Icons from '@expo/vector-icons/Ionicons'
import * as Animatable from 'react-native-animatable'
import GestureRecognizer from 'react-native-swipe-gestures'

var soundObject = new Expo.Audio.Sound();
var { height, width } = Dimensions.get("window");
var BG = require('../ImageAssets/BG.png')
var LOGO = require('../ImageAssets/LOGO.png')
var PLAY = require('../ImageAssets/PLAY.png')
var SETTINGS = require('../ImageAssets/SETTINGS.png')
var QUESTION = require('../ImageAssets/QUESTION.png')
var SETTINGSBG =require('../ImageAssets/SETTINGSBG.png')
var SETTINGSLOGO = require('../ImageAssets/SETTINGSLOGO.png')



class HomeScreen extends React.Component {
  constructor(){
    super();
    this.state = {
      musicMuted : false,
      settingsScreen : false,
      points : 0,
      switchValue : true,
      fontLoaded : false,
      fadeAnim  : new Animated.Value(0)
    }
  }

   handleAudio = async() => {
   
   
    if(this.state.musicMuted === false){
      console.log('music unmutted')
        await soundObject.setIsLoopingAsync(true)
        await soundObject.playAsync();
        }
    else if (this.state.musicMuted === true){
      console.log('music muted')
      
        
        // await soundObect.unloadAsync()
        await soundObject.pauseAsync()
        
    } 
}
_retrieveData = async () => {
  try{
    const value = await AsyncStorage.getItem('Points')
    console.log(value)
    if(value !== null){
      this.setState({
        points : value.toString()
      })
      console.log(value)
    }
  }catch(error){
    console.log(error)
  }
}


async componentDidMount() {
  await Font.loadAsync({
    'buttonFont' : require('../ImageAssets/Fonts/button_font.ttf')
  })
  this.setState({
    fontLoaded :true
  })
  Animated.timing(
    this.state.fadeAnim,
    {
      toValue: 1,
      duration : 1500
    }
  ).start();
}
  componentWillMount(){
    
    
   
    async function loadAudio(){
      try {
      await  soundObject.loadAsync(require('../ImageAssets/Music.wav'))
      handleAudio()
      }catch(error){
        console.log(error)
      }
      
    }
    loadAudio();
    this._retrieveData()
    
    var handleAudio = async() => {
   
   
      if(this.state.musicMuted === false){
        console.log('music unmutted')
          await soundObject.setIsLoopingAsync(true)
          await soundObject.playAsync();
          }
      else if (this.state.musicMuted === true){
        console.log('music muted')
        
          
          // await soundObect.unloadAsync()
          await soundObject.pauseAsync()
          
      } 
  }
    
  
  
    
      firebase.initializeApp({
        apiKey: "AIzaSyDC0wV_n5OuOVgl7LkS-OIxt7qgYbX4s9Y",
        authDomain: "wouldyourather-13805.firebaseapp.com",
        databaseURL: "https://wouldyourather-13805.firebaseio.com",
        projectId: "wouldyourather-13805",
        storageBucket: "",
        messagingSenderId: "1073349493942"
      })
    
    
  }

    


async muteMusic(){
  this.setState({
    musicMuted : true
  })
  await soundObject.stopAsync()
}

async resumeMusic(){

  this.setState({
    musicMuted : false
  })

  await soundObject.playAsync()
}

async onSwipeRight(gestureState){
  await this.settingsRef.slideOutRight(200)
  await this.setState({
     settingsScreen : false
   })
}

conditionalRenderingSwitch(){
  if(this.state.switchValue === true){
    return(
      <Switch
      value = {this.state.switchValue}
        onValueChange = {() => {
          if(this.state.switchValue === true){
            {this.muteMusic()}
            this.setState({
              switchValue : false
            })

          } else if(this.state.switchValue === false){
            this.setState({
              switchValue : true
            })
          }
        }}
        tintColor = 'white'
        onTintColor = 'white'
        thumbTintColor = 'black'
      />
    )
  }
  else if(this.state.switchValue === false){
    return(
      <Switch
      value = {this.state.switchValue}
        onValueChange = {() => {
          if(this.state.switchValue === true){
            this.setState({
              switchValue : false
            })
          } else if(this.state.switchValue === false){
            {this.resumeMusic()}
            this.setState({
              switchValue : true
            })
          }
        }}
        tintColor = 'white'
        onTintColor = 'white'
        thumbTintColor = 'white'
      />
    )
  }
}

conditionalScreenRendering(){
  if(this.state.settingsScreen === false && this.state.fontLoaded === true){
    return(
      <Animatable.View  style = {{flex : 1 , paddingTop : Constants.statusBarHeight,
      justifyContent : 'center', alignItems : 'center'}}>
        <Animatable.View ref = {(ref) => {
          this.mainContainer = ref
        }} animation = 'slideInLeft' style = {{backgroundColor : 'black',height : height - 80,
        width : width - 40,}}>
        <View style = {{width : width - 40, height : 200, alignItems : 'center', justifyContent : 'center',
        marginTop : 100}}>
         <Animatable.Image ref = {(ref) => {
           this.logoImage = ref
         }} animation = 'slideInLeft' source = {LOGO} 
              resizeMethod = 'scale'
              style
               = {{height : 180, width : 300}}
            />
            </View>
     
          <Animatable.View  ref = {(ref) => {
            this.buttonOne = ref
          }} animation = 'slideInLeft'>
         <TouchableOpacity onPress = {() => {
           this.props.navigation.navigate('GameState')
         }} style = {{backgroundColor : 'white', height : 80, 
         width : width - 100, alignSelf : 'center', top : 100,
         justifyContent : 'space-evenly', alignItems : 'center', flexDirection : 'row'}}>
              <Animatable.View animation = 'flash' iterationCount = 'infinite' 
              easing = 'linear'>
              <Icons name = 'ios-arrow-back' size = {35}/>
              </Animatable.View>
              <Text style = {{fontSize : 36, fontFamily : 'buttonFont'}}>
                Play
              </Text>
              <Animatable.View animation = 'flash' iterationCount = 'infinite'
              easing = 'linear'>
              <Icons name = 'ios-arrow-forward' size = {35}/>
              </Animatable.View>
             
              
         </TouchableOpacity>  
         </Animatable.View>
         <Animatable.View ref = {(ref) => {
           this.buttonTwo = ref
         }} animation = 'slideInLeft'>
         <TouchableOpacity onPress = {async () =>
          {
           this.buttonOne.slideOutLeft(200)
           this.buttonTwo.slideOutLeft(200)
           this.logoImage.slideOutLeft(200)
           await this.mainContainer.slideOutLeft(200) 
           this.setState({
             settingsScreen : true
           })
         }} style = {{backgroundColor : 'white', height : 80, 
         width : width - 100, alignSelf : 'center', top: 150,
         justifyContent : 'center', alignItems : 'center'}}>
              <Text style = {{fontSize : 36, fontFamily : 'buttonFont'}}>
                Settings
              </Text>
         </TouchableOpacity>  
         </Animatable.View>

        </Animatable.View>
      </Animatable.View>
    )
  }else if (this.state.settingsScreen === true && this.state.fontLoaded === true){
    return(
      <View style = {{flex : 1, paddingTop : Constants.statusBarHeight, 
      alignItems : 'center'}}>
        <Animatable.View ref = {(ref) => {
          this.settingsHeader = ref
        }} animation = 'slideInRight' style = {{height : 100, borderWidth : 8, justifyContent : 'center', alignItems : 'center', 
        top : 50, width : width - 40}}>
            <Text style = {{fontSize : 50}}>
              SETTINGS
            </Text>
        </Animatable.View>
        <Animatable.View ref = {(ref) => {
          this.blackContainer = ref
        }} animation = 'slideInRight' style = {{backgroundColor : 'black', alignItems : 'center',top : 80, height : height - 250, width : width - 40}}>
        <Animatable.View ref = {(ref) => {
          this.adsView = ref
        }} animation = 'slideInRight' style = {{height : 100, borderWidth : 5, justifyContent : 'space-evenly',flexDirection : 'row'
        , alignItems : 'center', 
        top : 20, width : width - 60, borderColor : 'white'}}>
            <Text style = {{fontSize : 32, color : 'white'}}>
              No Ads
            </Text>
            <Text style = {{fontSize : 32, color : 'white'}}>
              $2.99
            </Text>
        </Animatable.View>
        <Animatable.View ref = {(ref) => {
          this.soundView = ref
        }} animation = 'slideInRight' style = {{height : 100, borderWidth : 5, justifyContent : 'space-evenly',flexDirection : 'row'
        , alignItems : 'center', 
        top : 50, width : width - 60, borderColor : 'white'}}>
            <Text style = {{fontSize : 32, color : 'white'}}>
              Sound
            </Text>
            {this.conditionalRenderingSwitch()}
         
        </Animatable.View>
        <TouchableOpacity
          onPress = { async () => {
            this.settingsHeader.slideOutRight(200)
            this.soundView.slideOutRight(200)
            this.adsView.slideOutRight(200)
            await this.blackContainer.slideOutRight(200)
            this.setState({
              settingsScreen : false
            })
          }}
         style = {{top : height - 520, right : width - 250}}>
          <Icons 
          name = 'ios-arrow-back' size = {50}  color = 'white'
                  />
        </TouchableOpacity>
        </Animatable.View>
           
      </View>
    )
  }
}


conditionalRendering(){
  if(this.state.musicMuted === false){
    return(
      <TouchableOpacity style = {{top : height - 80, position : 'absolute'}} onPress = { () => {
    this.muteMusic()
    }}>
          <Icons name = 'md-volume-up' size = {50} />
        </TouchableOpacity>
       )
  }else if(this.state.musicMuted === true){
      return(
        <TouchableOpacity style = {{top : height - 80, position : 'absolute'}} onPress = {this.resumeMusic.bind(this)}>
          <Icons name = 'md-volume-off' size = {50} />
        </TouchableOpacity>
      )
  }
}




  render() {
    return (
      <View style = {{backgroundColor : 'white', flex : 1}}>
      {this.conditionalScreenRendering()}
      </View>
      
    );
  }
}


const styles = {
  logoStyle: {
    width: width,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    
  },
  logoTextStyle: {
    fontSize: 40,
    fontWeight: "bold"
  }
};

export default HomeScreen;
