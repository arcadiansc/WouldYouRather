import React from "react";
import { Text, View, SafeAreaView, Dimensions, TouchableOpacity, StatusBar,
Image, AsyncStorage, Switch } from "react-native";
import {Constants} from 'expo'
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
      switchValue : true
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


conditionalScreenRendering(){
  if(this.state.settingsScreen === false){
    return(
<Animatable.View animation = 'slideInLeft' ref = {(ref) => {
  this.MainView = ref
}} style = {{height : height,width : width, backgroundColor : 'black',
      justifyContent : 'center', alignItems : 'center'
       }}>
        <StatusBar hidden = {true}/>
     
        <View style = {{justifyContent : 'center', alignItems : 'center',
       margin : 80, height : height, width : width}}>
        <Image 
          source = {BG}
          style = {{height : '100%', width : '100%' }}
        />
        <Animatable.View animation = 'slideInDown' style  ={{position : 'absolute', 
        top : 100, height : 200, width : width, alignItems : 'center'}}>
        <Image 
          source = {LOGO}
          style = {{height : '100%', width : '100%'}}
        />
        </Animatable.View>
       
        <Animatable.View animation = 'slideInLeft' style  ={{position : 'absolute', 
        top : 400,height : 250, width : width, alignItems : 'center'}}>
        <TouchableOpacity  onPress = {() => {
            this.props.navigation.navigate('GameState')
        }}>
         <Image 
          source = {PLAY}
          style = {{height : 80, width : width - 100}}
        />
        </TouchableOpacity>
        <TouchableOpacity onPress = {async () => {
        await this.MainView.slideOutLeft(400)
        await  this.setState({
            settingsScreen : true
          })
          
        }}>
        <Image 
          source = {SETTINGS}
          style = {{height : 100, width : width - 100, top : 20, right : 5}}
        />
        </TouchableOpacity>
        </Animatable.View>
        </View>
        
        <View style = {{
          position : 'absolute', top : 50, left : width - 100 
        }}>
          <Text style = {{fontSize : 24}}>
            Points:
          </Text>
          <Text style = {{fontSize : 24}}>
            {this.state.points}
          </Text>
        </View>
      </Animatable.View>   
    )
  }else if (this.state.settingsScreen === true){
    return(
      <GestureRecognizer
        onSwipeRight = {state => {
          this.onSwipeRight(state)
        }}
      >
      <Animatable.View animation = 'lightSpeedIn' ref ={(ref) => {
        this.settingsRef = ref
      }} style = {{height : height,width : width, backgroundColor : 'black',
      justifyContent : 'center', alignItems : 'center'
       }}>
        <StatusBar hidden = {true}/>
        <Animatable.View style = {{justifyContent : 'center', alignItems : 'center',
       margin : 80, height : height, width : width}}>
       <Image  source = {SETTINGSBG} style = {{height : '100%', width : '100%'}}/>
       </Animatable.View>
       
       <Animatable.Image animation = 'slideInDown' source = {SETTINGSLOGO} style = {{height : 100, width : width,
       position : 'absolute', top : 50}}/>
       <View style = {{
         position : 'absolute', top : height - 500
       }}>
         <TouchableOpacity style = {{
           width : width - 120, height : 50, borderWidth : 4,
           justifyContent : 'space-evenly', alignItems : 'center', borderRadius : 40,
           flexDirection : 'row', borderColor : 'purple'
         }}>
         
           <Text style = {{fontSize : 24, color : 'purple', fontWeight : 'bold'}}>
             No Ads
           </Text>
          
          
           <Text style = {{fontSize : 24, color : 'green', fontWeight : 'bold'}}>
             $2.99
           </Text>
          
         </TouchableOpacity>
         
       </View>
       <View style = {{
         position : 'absolute', top : height - 400
       }}>
         <TouchableOpacity style = {{
           width : width - 120, height : 50, borderWidth : 4,
           justifyContent : 'space-evenly', alignItems : 'center', borderRadius : 40,
           flexDirection : 'row', borderColor : 'purple'
         }}>
         
           <Text style = {{fontSize : 24, color : 'purple', fontWeight : 'bold'}}>
             Sound
           </Text>
           <Switch 
              value = {this.state.switchValue}
              onValueChange = {() => {
                if(this.state.switchValue === true){
                  this.muteMusic();
                  this.setState({
                    switchValue : false
                  })
                }else if (this.state.switchValue === false){
                  this.resumeMusic();
                  this.setState({
                    switchValue : true
                  })
                }
              }}
            
           />
          
          
          
          
         </TouchableOpacity>
         
       </View>

       <View  style = {{top : height - 150, position : 'absolute', 
       flexDirection : 'row', width : width - 100, justifyContent : 'space-evenly',
       alignItems : 'center'}}>
     
       <Text style = {{
         fontSize : 18,
         fontWeight : 'bold',
         
       }}>
         Swipe To Go Back
       </Text>
       <Icons 
         name = 'ios-arrow-forward' size = {50} 
       />
       </View>
       </Animatable.View>
       </GestureRecognizer>
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
      <View style = {{backgroundColor : 'black', flex : 1}}>
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
