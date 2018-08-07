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
  AsyncStorage,
  
} from "react-native";
import Card from "../components/Card";
import Expo from "expo";
import { Constants, Font } from "expo";
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
      fontLoaded: false
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      gothic : require("../ImageAssets/Fonts/gothic.ttf")
    });
    this.setState({
      fontLoaded: true
    });
  }

  componentWillMount() {
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
      firstArrayNum: firstArray
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

  _storeData = async () => {
    try {
      await AsyncStorage.setItem("Points", this.state.points.toString());
      console.log("added");
    } catch (error) {
      console.log(error);
    }
  };

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

    const dataSet = Object.values(data);
    console.log(dataSet[firstArray][firstArraySecond]);
    var questionOneText = dataSet[firstArray][firstArraySecond];
    var questionTwoText = dataSet[firstArray][secondArraySecond];

    this.setState({
      questionOne: questionOneText,
      questionTwo: questionTwoText,
      firstArray: firstArraySecond,
      secondArray: secondArraySecond,
      firstArrayNum: firstArray
    });
  }

  handleViewRef = ref => (this.image = ref);
  bounce() {
    this.image.transitionTo({ opacity: 0.2 });
  }

  async onSwipeLeft(gestureState) {
    this.ViewOne.slideOutLeft(200);
    this.ViewTwo.slideOutLeft(200);
    this.ViewThree.slideOutLeft(200);
    await this.ViewFour.slideOutLeft(200);
    this.Randomize();
    this.setState({ backgroundVisible: false });
  }

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
      .then(snapshot => {
        const numberQuestionTwo = parseInt(snapshot.val());
        this.setState({ numberQuestionTwo: numberQuestionTwo });
      })
      .catch(error => {
        alert(error);
      })
      .then(() => {
        {
          this.getPercentages();
        }
      })
      .catch(error => {
        alert(error);
      });
  }

  async getPercentages() {
    const questionOne = this.state.numberQuestionOne;

    const questionTwo = this.state.numberQuestionTwo;

    const total = questionOne + questionTwo;
    var perOne = Math.floor((questionOne / total) * 100);
    var perTwo = Math.floor((questionTwo / total) * 100);
    if (perOne + perTwo !== 100) {
      perOne++;
    }
    console.log(perOne, perTwo);
    await this.setState({
      percentageOne: perOne,
      percentageTwo: perTwo
    });
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
            backgroundColor: "white",
            paddingTop: Constants.statusBarHeight
          }}
        >
          <Animatable.View
            animation = 'zoomIn'
            ref = {(ref)=> {
              this.Header = ref
            }}
            style={{
              width: width - 40,
              borderWidth: 8,
              alignSelf: "center",
              height: 100,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={{ fontSize: 32, fontFamily : 'gothic' }}>Would You Rather</Text>
          </Animatable.View>
          <Animatable.View animation = 'slideInLeft'
          ref = {(ref)=> {
            this.questionOne = ref
          }}>
          <TouchableOpacity
            onPress={async () => {
              this.setState({
                questionPressed: 1,
                points: parseInt(this.state.points) + 1
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

              this.questionOne.slideOutLeft(200)
              this.ORImage.zoomOut(200)
              this.Header.zoomOut(200)
            await  this.questionTwo.slideOutRight(200)
            this.databaseFunction();
              this.setState({
                backgroundVisible : true
              })

            }}
            style={{
              width: width - 40,
              height: 260,
              backgroundColor: "black",
              alignSelf: "center",
              top: 40,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={{ fontSize: 32, color: "white",fontFamily : 'gothic', textAlign : 'center' }}>
              {this.state.questionOne}
            </Text>
          </TouchableOpacity>
          </Animatable.View>
          <Animatable.View
            ref = {(ref) => {
              this.questionTwo = ref
            }}
           animation = 'slideInRight'>
          <TouchableOpacity
           onPress={async () => {
              this.setState({
                questionPressed: 2,
                points: parseInt(this.state.points) + 1
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
            
              this.questionOne.slideOutLeft(200)
              this.ORImage.zoomOut(200)
              this.Header.zoomOut(200)
            await  this.questionTwo.slideOutRight(200)
            this.databaseFunction();
              this.setState({
                backgroundVisible : true
              })
              

            }}
            style={{
              width: width - 40,
              height: 260,
              backgroundColor: "black",
              alignSelf: "center",
              top: 50,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={{ fontSize: 32, color: "white", fontFamily : 'gothic', textAlign : 'center' }}>
              {this.state.questionTwo}
            </Text>
          </TouchableOpacity>
          </Animatable.View>
          <View
            style={{
              width: width - 40,
              flexDirection: "row",
              right : width - 320,
              top: 80,
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
            <Text style={{ fontSize: 40, left : 35 }}>{this.state.points}</Text>
          </View>
          <Animatable.Image animation = 'zoomIn' 
          ref = {(ref) => {
            this.ORImage = ref
          }}
            source = {OR} resizeMode = 'contain' style = {{height : 120, 
            width : 120, position : 'absolute', top : height - 430, left : width - 260}}
          />
        </View>
      );
    } else if (this.state.backgroundVisible === true && this.state.fontLoaded) {
      return (
        <Animatable.View
        animation = 'slideInRight'
          style={{
            backgroundColor: "white",
            height: height,
            width: width,
            paddingTop:
              Platform.OS === "ios" ? 10 : Constants.statusBarHeight - 10,
            justifyContent: "space-evenly"
          }}
        >
        <TouchableOpacity onPress = {async () => {
           this.ViewOne.slideOutLeft(200);
    this.ViewTwo.slideOutLeft(200);
    this.ViewThree.slideOutLeft(200);
    await this.ViewFour.slideOutLeft(200);
    this.Randomize();
    this.setState({ backgroundVisible: false });
        }}>
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
                height: height - 200,
                width: width - 40,
                alignSelf: "center",
                backgroundColor: "black",
                justifyContent: "space-evenly",
                top : 20
             
              }}
            >
              <View
                style={{ position: "absolute", top: height - 580, left: 30 }}
              >
                <AnimatedBar
                  value={this.state.percentageOne}
                  delay={DELAY}
                  text={this.state.percentageOne}
                />
              </View>
              <View
                style={{ position: "absolute", top: height - 380, left: 30 }}
              >
                <AnimatedBar
                  value={this.state.percentageTwo}
                  delay={DELAY}
                  text={this.state.percentageTwo}
                />
              </View>
              <Animatable.View
                ref={ref => {
                  this.ViewThree = ref;
                }}
                style={{
                  height: 150,
                  width: width - 120,
                  alignSelf: "center",
                  justifyContent: "space-evenly"
                }}
              >
                <Text
                  style={{
                    color: "white",
                    textAlign: "left",
                    fontSize: 24,
                    fontFamily: "gothic"
                  }}
                >
                  {this.state.questionOne}
                </Text>
              </Animatable.View>
              <Animatable.View
                ref={ref => {
                  this.ViewFour = ref;
                }}
                style={{
                  height: 150,
                  width: width - 120,
                  alignSelf: "center",
                  justifyContent: "space-evenly"
                }}
              >
                <Text
                  style={{
                    color: "white",
                    textAlign: "left",
                    fontSize: 24,
                    fontFamily: "gothic"
                  }}
                >
                  {this.state.questionTwo}
                </Text>
              </Animatable.View>

              <View
                style={{
                  width: width,
                  alignSelf: "center",
                  alignItems: "center",
                  
                  justifyContent: "center"
                }}
              >
               
                <Text
                  style={{
                    color: "white",
                    fontSize: 30,
                    textAlign: "center",
                    fontFamily: "gothic", 
                    top : 20
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
    return <View style = {{flex : 1,
    backgroundColor : 'white'}}>
    {this.conditionalLoading()}
    </View>;
  }
}

export default GameState;
