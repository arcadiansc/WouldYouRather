import React from "react";
import { Text, View, SafeAreaView, Dimensions, TouchableOpacity, StatusBar,
Image, AsyncStorage, Switch, Animated, Platform} from "react-native";
import {Constants, Font,FacebookAds} from 'expo'
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


FacebookAds.AdSettings.addTestDevice(FacebookAds.AdSettings.currentDeviceHash);
class HomeScreen extends React.Component {
  constructor(){
    super();
    this.state = {
      musicMuted : false,
      settingsScreen : false,
      points : 0,
      switchValue : true,
      fontLoaded : false,
      fadeAnim  : new Animated.Value(0),
      shopOne : false,
      shopTwo : false
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
  this._retrieveData()
  await Font.loadAsync({
    'buttonFont' : require('../ImageAssets/Fonts/button_font.ttf'),
    'gothic' : require('../ImageAssets/Fonts/gothic.ttf')
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

  showAds(){
    FacebookAds.InterstitialAdManager.showAd('1866535820320971_1866536080320945')
    .then(didClick => {
      console.log('clicked')
      
     
    })
    .catch(error => {
      console.log(error)
    })
 
  }  
    
  _storeData = async () => {
    try {
      const points = parseInt(this.state.points) + 10
    
      await AsyncStorage.setItem("Points", points.toString());
     this.setState({
       points : points
     })
    } catch (error) {
      console.log(error);
    }
  };

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
        tintColor = {Platform.OS === 'ios' ? 'white' : 'white'}
        onTintColor = {Platform.OS === 'ios' ? 'white' : 'white'}
        thumbTintColor = {Platform.OS === 'ios' ? 'black' : 'white'}
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
      <Animatable.View ref = {(ref) => {
        this.WelcomeMainView = ref
      }} animation = 'slideInLeft'
        style = {{height : height, width : width, paddingTop : Constants.statusBarHeight,
      justifyContent : 'center', alignItems : 'center'}}>
        <Animatable.View ref = {(ref) => {
          this.mainContainer = ref
        }}  style = {{backgroundColor : 'black',height : height - 80,
        width : width - 40,}}>
        <View style = {{width : width - 40, height : 200, alignItems : 'center', justifyContent : 'center',
        marginTop : height / 10}}>
          <TouchableOpacity onPress = {() => {
            this._retrieveData()
          }}>
          <Text style = {{fontSize : 20, color : 'white', fontFamily : 'gothic'}}>
            Points : {this.state.points}
          </Text>
          </TouchableOpacity>
         <Animatable.Image ref = {(ref) => {
           this.logoImage = ref
         }}  source = {LOGO} 
              resizeMethod = 'resize'
              resizeMode = 'contain'
              style
               = {{height : 180, width : 300}}
            />
            </View>
         <View style = {{height : Platform.OS === 'ios' ? '55%' : '48%'
          , justifyContent : 'space-evenly'}}>
          <TouchableOpacity onPress = {async() => {
           await this.WelcomeMainView.slideOutLeft
           this.props.navigation.navigate('GameState')
         }}   >
         <Animatable.View 
          ref = {(ref) => {
            this.buttonOne = ref
          }}
         style = {{backgroundColor : 'white', height : Platform.OS === 'ios' ? 80 : 60, 
         width : width - 100, alignSelf : 'center',
         justifyContent : 'space-evenly', alignItems : 'center', flexDirection : 'row'}}>
              <Animatable.View animation = 'flash' iterationCount = 'infinite' 
              easing = 'linear'>
              <Icons name = 'ios-arrow-forward' size = {35}/>
              </Animatable.View>
              <Text style = {{fontSize : 36, fontFamily : 'buttonFont'}}>
                PLAY
              </Text>
              <Animatable.View animation = 'flash' iterationCount = 'infinite'
              easing = 'linear'>
              <Icons name = 'ios-arrow-back' size = {35}/>
              </Animatable.View>
             
              
         </Animatable.View>  
         </TouchableOpacity>
         <TouchableOpacity 
         onPress = {async () =>
          {
            await this.WelcomeMainView.slideOutLeft(200)
           
           this.setState({
             settingsScreen : true
           })
         }} >
         <Animatable.View 
          ref = {(ref) => {
           this.buttonTwo = ref
         }}
           style = {{backgroundColor : 'white', height :  Platform.OS === 'ios' ? 80 : 60, 
         width : width - 100, alignSelf : 'center',
         justifyContent : 'center', alignItems : 'center'}}>
              <Text style = {{fontSize : 36, fontFamily : 'buttonFont'}}>
                EXTRAS
              </Text>
         </Animatable.View>  
         </TouchableOpacity>
         <TouchableOpacity onPress = {async () =>
          {
          this.showAds()
          }}>
         <Animatable.View 
          ref = {(ref) => {
           this.buttonTwo = ref
         }}  style = {{backgroundColor : 'white', height : Platform.OS === 'ios' ? 80 : 60, 
         width : width - 100, alignSelf : 'center', 
         justifyContent : 'center', alignItems : 'center'}}>
              <Text style = {{fontSize : 36, fontFamily : 'buttonFont'}}>
                GET POINTS
              </Text>
         </Animatable.View>  
         </TouchableOpacity>
         </View>

        </Animatable.View>
      </Animatable.View>
    )
  }else if (this.state.settingsScreen === true && this.state.fontLoaded === true){
      if(this.state.shopOne === false && this.state.shopTwo === false){
        return(
          <Animatable.View ref = {(ref) => {
            this.MainView = ref
          }} animation = 'slideInRight'  style = {{flex : 1, paddingTop : Constants.statusBarHeight, 
          alignItems : 'center'}}>
          
            <Animatable.View ref = {(ref) => {
              this.settingsHeader = ref
            }}  style = {{height : 100, borderWidth : 8, justifyContent : 'center', alignItems : 'center', 
            marginTop : Constants.statusBarHeight, width : width - 40}}>
                <Text style = {{fontSize : 50 , fontFamily : 'gothic'}}>
                  Extras
                </Text>
            </Animatable.View>
            <Animatable.View ref = {(ref) => {
              this.blackContainer = ref
            }} style = {{backgroundColor : 'black', alignItems : 'center',top : '5%', height : '70%', width : width - 40,
            justifyContent : 'space-evenly'}}>
     
            <Animatable.View ref = {(ref) => {
              this.soundView = ref
            }}  style = {{aspectRatio : 3 / 1, borderWidth : 5, justifyContent : 'space-between',flexDirection : 'row'
            , alignItems : 'center', padding : 10,
            width : width - 100, borderColor : 'white'}}>
                <Text style = {{fontSize : 32, color : 'white', fontFamily : 'gothic'}}>
                  Sound
                </Text>
                {this.conditionalRenderingSwitch()}
             
            </Animatable.View>
            <TouchableOpacity onPress = {() => {
              this.setState({
                shopOne : true
              })
            }}>
            <Animatable.View ref = {(ref) => {
              this.soundView = ref
            }}  style = {{aspectRatio : 3 / 1, borderWidth : 5, justifyContent : 'center'
            , alignItems : 'center', padding : 10,
             width : width - 100, borderColor : 'white'}}>
                <Text style = {{fontSize : 32, color : 'white', fontFamily : 'gothic'}}>
                  Shop
                </Text>
              
             
            </Animatable.View>
            </TouchableOpacity>
            <TouchableOpacity>
            <Animatable.View ref = {(ref) => {
              this.soundView = ref
            }}  style = {{aspectRatio : 3 / 1, borderWidth : 5, justifyContent : 'center'
            , alignItems : 'center', padding : 10,
            width : width - 100, borderColor : 'white'}}>
                <Text style = {{fontSize : 32, color : 'white', fontFamily : 'gothic'}}>
                  Settings
                </Text>
              
             
            </Animatable.View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress = { async () => {
                await this.MainView.slideOutRight(200)
                this.setState({
                  settingsScreen : false
                })
              }}
             style = {{ right : width - 250}}>
              <Icons 
              name = 'ios-arrow-back' size = {50}  color = 'white'
                      />
            </TouchableOpacity>
            </Animatable.View>
               
          </Animatable.View>
        )
      }else if (this.state.shopOne === true && this.state.shopTwo === false){
        return(
          <Animatable.View ref = {(ref) => {
            this.ShopView = ref
          }} animation = 'slideInRight'  style = {{flex : 1, paddingTop : Constants.statusBarHeight, 
          alignItems : 'center'}}>
             <Animatable.View ref = {(ref) => {
              this.shopHeader = ref
            }}  style = {{height : 100, borderWidth : 8, justifyContent : 'center', alignItems : 'center', 
            top : 50, width : width - 40}}>
                <Text style = {{fontSize : 50 , fontFamily : 'gothic'}}>
                  Shop
                </Text>
            </Animatable.View>
            <Animatable.View ref = {(ref) => {
              this.ShopBlackContainer = ref
            }} style = {{backgroundColor : 'black', alignItems : 'center',top : 80, height : height - 250, width : width - 40,
            justifyContent : 'space-evenly'}}>
            <Text style = {{fontSize : 32, color : 'white', fontFamily : 'gothic'}}>
              Coming Soon
            </Text>
              {/*
              This will be the Bar for the menus in case we need more room
               <TouchableOpacity onPress = {() => {
              this.setState({
                shopOne : true
              })
            }}>
            <Animatable.View ref = {(ref) => {
              this.soundView = ref
            }}  style = {{height : 100, borderWidth : 5, justifyContent : 'center'
            , alignItems : 'center', padding : 10,
            top : 50, width : width - 100, borderColor : 'white'}}>
            </Animatable.View>
            </TouchableOpacity>
            <TouchableOpacity onPress = {() => {
              this.setState({
                shopOne : true
              })
            }}>
            <Animatable.View ref = {(ref) => {
              this.soundView = ref
            }}  style = {{height : 100, borderWidth : 5, justifyContent : 'center'
            , alignItems : 'center', padding : 10,
            top : 50, width : width - 100, borderColor : 'white'}}>
            </Animatable.View>
            </TouchableOpacity> */}
            </Animatable.View>
            <TouchableOpacity
              onPress = { async () => {
            
                this.setState({
                  shopOne : false
                })
              }}
             style = {{ right : width - 250, top : 20}}>
              <Icons 
              name = 'ios-arrow-back' size = {50}  color = 'white'
                      />
            </TouchableOpacity>
          </Animatable.View>
        )
      }else if (this.state.shopOne === true && this.state.shopTwo === true)
    return(

      <View>

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
