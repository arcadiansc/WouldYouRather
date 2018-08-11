import React from "react";
import {
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
  AsyncStorage
} from "react-native";
import Card from "../components/Card";
import Expo from "expo";
import { Constants, Font, FacebookAds } from "expo";
import * as Animatable from "react-native-animatable";
import Modal from "react-native-modal";
import Icons from "@expo/vector-icons/Ionicons";
import GestureRecognizer from "react-native-swipe-gestures";
import AnimatedBar from "../components/AnimatedBar";
import firebase from "firebase";

var data = require("../KidScenarios.json");
var REDCARD = require("../ImageAssets/RED.png");
var BLUECARD = require("../ImageAssets/BLUE.png");
var BG = require("../ImageAssets/BG.png");
var OR = require("../ImageAssets/OR.png");
var { height, width } = Dimensions.get("window");
var HOMEICON = require("../ImageAssets/Home.png");
const DELAY = 100;

class GameState extends React.Component {
  constructor() {
    super();
    this.state = {
      questionOne: "null",
      questionTwo: "null",
      firstArray: "null",
      secondArray: "null",
      backgroundVisible: false,
      data: [8],
      firstArrayNum: "null",
      questionPressed: "null",
      numberQuestionOne: "null",
      numberQuestionTwo: "null",
      percentageOne: "0",
      percentageTwo: "0",
      points: 0,
      fontLoaded: false,
      androidHeight : '0',
      androidWidth : '0',
      lastFirstArray : 'null',
      isAdReady : false
    };
  }

  async componentDidMount() {
    FacebookAds.AdSettings.addTestDevice(FacebookAds.AdSettings.currentDeviceHash);
    await Font.loadAsync({
      gothic: require("../ImageAssets/Fonts/gothic.ttf")
    });
    this.setState({
      fontLoaded: true
    });
  }

  componentWillMount() {
    console.log(height, width)
    // if(Platform.OS === 'android'){

    // }
    this._retrieveData();
    const firstArray = this.getRandomInt(0, 27);
    const firstArraySecond = this.getRandomInt(0, 2);
    const secondArray = this.getRandomInt(0, 27);
    var secondArraySecond = this.getRandomInt(0, 2);
    console.log(secondArraySecond);

    while (secondArraySecond === firstArraySecond) {
      secondArraySecond = this.getRandomInt(0, 2);
      console.log(secondArraySecond);
    }
  

    const dataSet = Object.values(data);

    console.log(dataSet[firstArray][firstArraySecond]);
    var questionOneText = dataSet[firstArray][firstArraySecond];
    var questionTwoText = dataSet[firstArray][secondArraySecond];

    this.setState({
      questionOne: questionOneText,
      questionTwo: questionTwoText,
      firstArray: firstArraySecond,
      secondArraySecond: secondArraySecond,
      firstArrayNum: firstArray,
      lastFirstArray : firstArray
    });

    const database = firebase.database();
    const refOne = database.ref(firstArray + "/1");

    refOne.once("value").then(snapshot => {
      const refTwo = database.ref(firstArray + "/2");
      var questionOneNumber = snapshot.val();
      this.setState({
        numberQuestionOne: questionOneNumber
      });
      refTwo.once("value").then(snapshot => {
        var questionTwoNumber = snapshot.val();
        this.setState({
          numberQuestionTwo: questionTwoNumber
        });
        this.getPercentages();
      });
    });
  }
  //Retrieves points when component mounts.
  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("Points");
      console.log(value);
      if (value !== null) {
        this.setState({
          points: value.toString()
        });
        console.log(value);
      }
    } catch (error) {
      console.log(error);
    }
  };
  //Async Storage function that stores the points everytime they are incremented.
  _storeData = async () => {
    try {
      const points = parseInt(this.state.points) + 1;
      await AsyncStorage.setItem("Points", points.toString());
      this.setState({
        points : points
      })
      
    } catch (error) {
      console.log(error);
    }
  };
  //plays sounds click when option is chosen.
  _playClick = async () => {
    const soundObect = new Expo.Audio.Sound();
    try {
      await soundObect.loadAsync(require("../ImageAssets/Click.wav"));
      await soundObect.playAsync();
    } catch (error) {
      console.log("errwor playing sound");
    }

    // await soundObect.stopAsync();
  };

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  //Once the questions are already chosen everytime a new one is called for this function randomizes them.
  Randomize() {
    var firstArray = this.getRandomInt(0, 27);
    var secondArray = this.getRandomInt(0, 27);
    var firstArraySecond = this.getRandomInt(0, 2);
    var secondArraySecond = this.getRandomInt(0, 2);

    this._playClick();

    // var secondArraySecond = this.getRandomInt(0,4)

    while (secondArraySecond === firstArraySecond) {
      secondArraySecond = this.getRandomInt(0, 2);

      console.log(secondArraySecond);
    }
    while (firstArray === this.state.lastFirstArray){
      firstArray = this.getRandomInt(0, 27);
    }

    const dataSet = Object.values(data);
    console.log(dataSet[firstArray][firstArraySecond]);
    var questionOneText = dataSet[firstArray][firstArraySecond];
    var questionTwoText = dataSet[firstArray][secondArraySecond];

    this.setState({
      questionOne: questionOneText,
      questionTwo: questionTwoText,
      firstArray: firstArraySecond,
      secondArray: secondArraySecond,
      firstArrayNum: firstArray,
      lastFirstArray : firstArray
    });
  }

  handleViewRef = ref => (this.image = ref);
  bounce() {
    this.image.transitionTo({ opacity: 0.2 });
  }

  //async function that responds on results screen swipe
  async onSwipeLeft(gestureState) {
    this.ViewOne.slideOutLeft(200);
    this.ViewTwo.slideOutLeft(200);
    await this.ViewThree.slideOutLeft(200);

    this.Randomize();
    this.setState({ backgroundVisible: false });
  }

  //async function that gets the qeuestions
  async databaseFunction() {
    var database = firebase.database();
    const questionOneRef = database.ref(this.state.firstArrayNum + "/" + 1);
    const questionTwoRef = database.ref(this.state.firstArrayNum + "/" + 2);
    questionOneRef
      .once("value")
      .then(snapshot => {
        const numberQuestionOne = parseInt(snapshot.val());
        this.setState({
          numberQuestionOne: numberQuestionOne
        });
      })
      .catch(error => {
        alert(error);
      });
    questionTwoRef
      .once("value")
      .then(async (snapshot) => {
        const numberQuestionTwo = parseInt(snapshot.val());
       await this.setState({ numberQuestionTwo: numberQuestionTwo });
       
      })
      .catch(error => {
        alert(error);
      })

   await this.getPercentages();
   
  }
  //async function that receives the total votes from the database function and returns a
  //percentage for each one.
   async getPercentages() {
    const questionOne = this.state.numberQuestionOne;

    const questionTwo = this.state.numberQuestionTwo;

    const total = questionOne + questionTwo;
    var perOne = Math.floor((questionOne / total) * 100);
    var perTwo = Math.floor((questionTwo / total) * 100);
    if (perOne + perTwo !== 100) {
      perOne++;
    }

    await this.setState({
      percentageOne: perOne,
      percentageTwo: perTwo
    });
  }
  showAd(){
    FacebookAds.InterstitialAdManager.showAd('1866535820320971_1866536080320945')
    .then(didClick => {
      console.log(clicked)
      FacebookAds.AdSettings.clearTestDevices();
    })
    .catch(error => {
      console.log(error)
    })
  }



  conditionalLoading() {
    if (
      this.state.backgroundVisible === false &&
      this.state.fontLoaded === true
    ) {
      return (
        <View
          style={{
            height: height,
            width: width,
            justifyContent : 'center',
            backgroundColor: "white",
            // paddingTop: Platform.OS === "ios" ? Constants.statusBarHeight : "8%"
          }}
        >
          <Animatable.View
            animation="zoomIn"
            ref={ref => {
              this.Header = ref;
            }}
            style={{
              width: width - 40,
              borderWidth: 6,
              alignSelf: "center",
              height: 100,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={{ fontSize: 32, fontFamily: "gothic" }}>
              Would You Rather
            </Text>
          </Animatable.View>
          <Animatable.View
            animation="slideInRight"
            ref={ref => {
              this.questionOne = ref;
            }}
             >
            <TouchableOpacity
              onPress={async () => {
                this.setState({
                  questionPressed: 1,
                 
                });
                this._storeData();
                const database = firebase.database();

                const resultsRef = database.ref(
                  this.state.firstArrayNum + "/" + 1
                );
                resultsRef.transaction(number => {
                  if (number) {
                    number = number + 1;
                  }
                  return number;
                });

                this.questionOne.slideOutLeft(200);
                this.ORImage.zoomOut(200);
                this.Header.zoomOut(200);
                await this.questionTwo.slideOutRight(200);
               await this.databaseFunction();
              await  this.setState({
                  backgroundVisible: true
                });
              }}
              style={{
                width: width - 40,
              //  aspectRatio : Platform.OS === 'ios' ? 1.25 / 1 : 1.25 / 1,
              height : height / 3,
                backgroundColor: "black",
                alignSelf: "center",
                top : '5%',
                justifyContent: "center",
                alignItems: "center",
             
              }}
            >
              <Text
                style={{
                  fontSize: Platform.OS === 'ios' ? 32 : 26,
                  color: "white",
                  fontFamily: "gothic",
                  textAlign: "center"
                }}
              >
                {this.state.questionOne}
              </Text>
            </TouchableOpacity>
           
          </Animatable.View>
          <Animatable.View
              ref={ref => {
                this.questionTwo = ref;
              }}
              animation="slideInLeft"
            >
              <TouchableOpacity
                onPress={async () => {
                  this.setState({
                    questionPressed: 2,
                    
                  });
                  this._storeData();
                  const database = firebase.database();

                  const resultsRef = database.ref(
                    this.state.firstArrayNum + "/" + 2
                  );
                  resultsRef.transaction(number => {
                    if (number) {
                      number = number + 1;
                    }
                    return number;
                  });

                  this.questionOne.slideOutLeft(200);
                  this.ORImage.zoomOut(200);
                  this.Header.zoomOut(200);
                  await this.questionTwo.slideOutRight(200);
                await  this.databaseFunction();
                  await this.setState({
                    backgroundVisible: true
                  });
                }}
                style={{
                  width: width - 40,
                  // aspectRatio : Platform.OS === 'ios' ? 1.25 / 1 : 1.25 / 1,
                  height : height / 3,
                  backgroundColor: "black",
                  alignSelf: "center",
                  top : Platform.OS === 'ios' ? '10%' : '5%',
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    fontSize: Platform.OS === 'ios' ? 32 : 26,
                    color: "white",
                    fontFamily: "gothic",
                    textAlign: "center"
                  }}
                >
                  {this.state.questionTwo}
                </Text>
              </TouchableOpacity>
            </Animatable.View>

          <View
            style={{
              width: width - 40,
              flexDirection: "row",
              height : height / 9,
              alignItems: 'center',
              top : height / 30,
              right : width / 6,
              justifyContent: "space-evenly"
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}
            >
              <Icons name="ios-arrow-back" size={50} />
            </TouchableOpacity>
            <Text style={{ fontSize: 40, left: 25 }}>{this.state.points}</Text>
          </View>
          <Animatable.Image
            animation="zoomIn"
            ref={ref => {
              this.ORImage = ref;
            }}
            source={OR}
            resizeMode="contain"
            style={{
              height: 120,
              width: 120,
              position: "absolute",
              top: height / 2.28,
              left: width / 3
            }}
          />
        </View>
      );
    } else if (this.state.backgroundVisible === true && this.state.fontLoaded) {
      return (
        <Animatable.View
          animation="slideInRight"
          style={{
            backgroundColor: "white",
            height: height,
            width: width,
            paddingTop: Platform.OS === 'ios' ? Constants.statusBarHeight : '8%'
          }}
        >
          <TouchableOpacity
            onPress={async () => {
              this.ViewOne.slideOutLeft(200);
              this.ViewTwo.slideOutLeft(200);
              
               this.ViewThree.slideOutLeft(200);
               let points = this.state.points.toString()
               if(points.endsWith('5') === true ){
                 console.log('showing ad')
                this.showAd()
               }
               if (points.endsWith('0') === true){
                 console.log('showing ad')
                 this.showAd()
               }
              
              this.Randomize();
              this.setState({ backgroundVisible: false });
            }}
          >
            <Animatable.View
              ref={ref => {
                this.ViewOne = ref;
              }}
              style={{
                width: width - 40,
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 6,
                height: 100
              }}
            >
              <Animatable.Text
                ref={ref => {
                  this.ResultsTextOne = ref;
                }}
                style={{ fontSize: 40, fontFamily: "gothic" }}
              >
                Results
              </Animatable.Text>
            </Animatable.View>
            <GestureRecognizer
              onSwipeLeft={state => {
                this.onSwipeLeft(state);
              }}
            >
              <Animatable.View
                ref={ref => {
                  this.ViewTwo = ref;
                }}
                style={{
                  height: height / 1.32,
                  width: width - 40,
                  alignSelf: "center",
                  backgroundColor: "black",
                  justifyContent: "space-evenly",
                  top: '2%'
                }}
              >
                
                <Animatable.View
                  ref={ref => {
                    this.ViewThree = ref;
                  }}
                  style={{
                    height:height / 2,
                    width: width - 120,
                    alignSelf: "center",
                    justifyContent : 'space-evenly',
                    top : '5%'
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      textAlign: "left",
                      fontSize: 22,
                      fontFamily: "gothic"
                    }}
                  >
                    {this.state.questionOne}
                  </Text>
                  <AnimatedBar
                    value={this.state.percentageOne}
                    delay={DELAY}
                    text={this.state.percentageOne}
                  />

                  <Text
                    style={{
                      color: "white",
                      textAlign: "left",
                      fontSize: 22,
                      fontFamily: "gothic"
                    }}
                  >
                    {this.state.questionTwo}
                  </Text>
                  <AnimatedBar
                    value={this.state.percentageTwo}
                    delay={DELAY}
                    text={this.state.percentageTwo}
                  />
                  
                </Animatable.View>
                
                <View
                  style={{
                    backgroundColor: "white",
                    height: 2,
                    width: width - 80,
                    alignSelf: "center",
                    top: 30
                  }}
                />
                <View
                  style={{
                    width: width,
                    alignSelf: "center",
                    alignItems: "center",

                    justifyContent: "center",

                    height: 60
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 22,
                      textAlign: "center",
                      fontFamily: "gothic",
                      top: 10
                    }}
                  >
                    Tap Anywhere to Continue
                  </Text>
                </View>
              </Animatable.View>
            </GestureRecognizer>
          </TouchableOpacity>
        </Animatable.View>
      );
    }
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "white"
        }}
      >
        {this.conditionalLoading()}
      </View>
    );
  }
}

export default GameState;
