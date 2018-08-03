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
import { Constants } from "expo";
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
      numberQuestionOne  : 'null',
      numberQuestionTwo : 'null',
      percentageOne : '0',
      percentageTwo : '0',
      points : 0
    };
  }

  componentWillMount() {

      this._retrieveData()
      const firstArray = this.getRandomInt(0, 15);
      const firstArraySecond = this.getRandomInt(0, 2);
      const secondArray = this.getRandomInt(0, 15);
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
      const refOne = database.ref(firstArray + '/1')
      
      refOne.once('value').then(snapshot => {
        const refTwo = database.ref(firstArray + '/2')
        var questionOneNumber = snapshot.val();
        this.setState({
          numberQuestionOne : questionOneNumber
        })
        refTwo.once('value').then(snapshot => {
          var questionTwoNumber = snapshot.val();
          this.setState({
            numberQuestionTwo : questionTwoNumber
          })
          this.getPercentages()
        })
      })

    

   
      
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

    _storeData = async () => {
      try {
        await AsyncStorage.setItem('Points', this.state.points.toString())
        console.log('added')
      }
      catch(error){
        console.log(error)
      }
    }
  

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
    var firstArray = this.getRandomInt(0, 15);
    var secondArray = this.getRandomInt(0, 15);
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

  async databaseFunction(){
    var database = firebase.database();
    const questionOneRef = database.ref(
     
        this.state.firstArrayNum +
        "/" +
        1
    );
    const questionTwoRef = database.ref(
     
      this.state.firstArrayNum +
      "/" +
      2
  );
       questionOneRef.once("value").then(snapshot => {
      const numberQuestionOne = parseInt(snapshot.val());
      this.setState({
        numberQuestionOne : numberQuestionOne
      })
     
    }).catch(error => {
      alert(error)
    })
       questionTwoRef.once("value").then(snapshot => {
      const numberQuestionTwo = parseInt(snapshot.val());
      this.setState({numberQuestionTwo : numberQuestionTwo})
    
      
     }).catch(error => {
       alert(error)
     }).then(() => {
      {this.getPercentages()}
     }).catch(error => {
       alert(error)
     })
    
  }


 async getPercentages(){
    const questionOne = this.state.numberQuestionOne;
    
    const questionTwo= this.state.numberQuestionTwo;
  
    const total = questionOne + questionTwo;
     var perOne = Math.floor((questionOne / total)* 100);
    var perTwo = Math.floor((questionTwo / total) * 100);
    if(perOne + perTwo !== 100){
      perOne++
    }
    console.log(perOne, perTwo)
    await this.setState({
      percentageOne : perOne, percentageTwo : perTwo
    })
    }

    loadPoints(){
      if(this.state.points > 0){
        return(
          <View style = {{position : 'absolute', top : height - 500, left : width - 100}}>
            <Text style = {{fontSize : 18, color : 'white', fontWeight : 'bold'}}>
              Points:
            </Text>
            <Text style = {{fontSize : 18, color : 'white'}}>
              {this.state.points}
            </Text>
          </View>
        )
      }
    }

  conditionalLoading() {
    if (this.state.backgroundVisible === false) {
      return (
        <Animatable.View
          style={{
            height: height,
            width: width,
            justifyContent: "space-evenly",
            alignItems: "center",
            backgroundColor: "black"
          }}
        >
          <StatusBar hidden={true} />
          <TouchableOpacity
            style={{ top: 50 }}
            onPress={async () => {
              this.setState({
                questionPressed: 1, points : parseInt(this.state.points) + 1
              });
              this._storeData()
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
             this.orButton.zoomOut(300);
              this.ImageOne.bounceOutUp(800);
              this.textOne.bounceOutUp(800);
              this.imageTwo.bounceOutDown(800);
              await this.TextTwo.bounceOutDown(400);
              
              {this.databaseFunction()}  
              this.setState({
                backgroundVisible: true
              });
            }}
          >
            <Animatable.Image
              animation="bounceInDown"
              ref={ref => {
                this.ImageOne = ref;
              }}
              source={BLUECARD}
              style={{ height: height / 1.5, width: width }}
            />
            <View
              style={{
                width: width - 80,
                position: "absolute",
                top: 100,
                alignItems: "center"
              }}
            >
              <Animatable.Text
                ref={ref => {
                  this.textOne = ref;
                }}
                style={{ fontSize: 28, color: "#fff", textAlign: "left" }}
              >
                {this.state.questionOne}
              </Animatable.Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ bottom: 50 }}
            onPress={async () => {
              this.setState({
                questionPressed: 2, points : parseInt(this.state.points) + 1
              });
              this._storeData()
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
               this.orButton.zoomOut(300);
              this.ImageOne.bounceOutUp(800);
              this.textOne.bounceOutUp(800);

              this.imageTwo.bounceOutDown(800);
              await this.TextTwo.bounceOutDown(400);
             
            {this.databaseFunction()}  
              this.setState({
                backgroundVisible: true
              });
            }}
          >
            <Animatable.Image
              animation="bounceInUp"
              ref={ref => {
                this.imageTwo = ref;
              }}
              source={REDCARD}
              style={{ height: height / 1.5, width: width }}
            />
            <View
              style={{
                width: width - 80,
                position: "absolute",
                bottom: 80,
                alignItems: "center",
                left: 40
              }}
            >
              <Animatable.Text
                ref={ref => {
                  this.TextTwo = ref;
                }}
                style={{ fontSize: 28, color: "#fff", textAlign: "right" }}
              >
                {this.state.questionTwo}
              </Animatable.Text>
            </View>
          </TouchableOpacity>
          {this.loadPoints()}
          <TouchableOpacity style = {{
            position : 'absolute', top : 50, left : width - 380, top : height - 330,
            height : 50, width : 50
          }}
          onPress = {() => {
            this.props.navigation.goBack();
          }}
          >
            <Icons 
              name = 'ios-arrow-back' size = {50} color = 'white'
            />
          </TouchableOpacity>
          <Animatable.Image
            animation="zoomIn"
            ref={ref => {
              this.orButton = ref;
            }}
            source={OR}
            style={{
              position: "absolute",
              height: 200,
              width: 200,
              top: height / 2.7
            }}
          />
           
        </Animatable.View>
      );
    } else if (this.state.backgroundVisible === true) {

      return (
       
        <View
          style={{
            backgroundColor: "white",
            height: height,
            width: width,
            paddingTop:
              Platform.OS === "ios" ? 40 : Constants.statusBarHeight - 10,
            justifyContent: "space-evenly"
          }}
        >
          <Animatable.View
            ref={ref => {
              this.ViewOne = ref;
            }}
            animation="zoomIn"
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
              animation="zoomIn"
              style={{ fontSize: 40 }}
            >
              RESULTS
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
              animation="zoomIn"
              style={{
                height: height - 200,
                width: width - 40,
                alignSelf: "center",
                backgroundColor: "black",
                justifyContent: "space-evenly"
              }}
            >
              <View style={{ position: "absolute", top: height - 580, left: 30 }}>
                <AnimatedBar value={this.state.percentageOne } delay={DELAY} 
                text = {this.state.numberQuestionOne} />
              </View>
              <View style={{ position: "absolute", top: height - 380, left: 30 }}>
                <AnimatedBar value={this.state.percentageTwo } delay={DELAY} 
                  text = {this.state.numberQuestionTwo}
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
                    fontSize: 24
                  }}
                >
                  {this.state.questionTwo}
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
                    fontSize: 24
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
                  flexDirection: "row",
                  justifyContent: "center"
                }}
              >
              <View style={{ right : 10, top: 2 }}>
                  <Icons name="ios-arrow-back" size={50} color="white" />
                </View>
                <Text
                  style={{ color: "white", fontSize: 24, textAlign: "center" }}
                >
                  Swipe
                </Text>
                
              </View>
            </Animatable.View>
          </GestureRecognizer>
        </View>
      );
    }
  }

  render() {
    return <View>{this.conditionalLoading()}</View>;
  }
}

export default GameState;
