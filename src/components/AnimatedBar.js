import React from 'react';
import { Animated, Text } from 'react-native'
import {Font} from 'expo'

class AnimatedBar extends React.Component {

    constructor(props){
        super(props);
        const {value, delay} = this.props;
        this._width = new Animated.Value(0)
        this.state = {
            color : 'white',
            fontLoaded : false,
            value : value,
            delay : delay

        }
    }


  async  componentDidMount(){

   
      await Font.loadAsync({
          "good_times" : require('../ImageAssets/Fonts/good_times.ttf'),
          "gothic" : require('../ImageAssets/Fonts/gothic.ttf')
      })

    

    await  Animated.sequence([
          Animated.delay(this.state.delay),
          Animated.timing(this._width, {
              toValue : this.state.value + 50,       
           })
      ]).start();
      console.log(this.state.value)

      this.setState({
          fontLoaded : true,
          
      })
      
       

    }

    render(){
        const barStyles = {
            backgroundColor : this.state.color,
            height : 40,
            width : this._width,
            borderTopRightRadius : 4,
            borderBottomRightRadius : 4, 
            justifyContent : 'center',
            alignItems : 'center'
        }
        return(

            <Animated.View style = {barStyles}>
                {
                    this.state.fontLoaded ? (
                        <Text  style = {{fontSize : 30,
                         color : 'black', textAlign : 'left',
                         fontFamily : 'gothic', bottom : 2}}>
                         
                    {this.state.value}%
                </Text>
                    ) : null
                }
               
            </Animated.View>
        );
    }
}

export default AnimatedBar