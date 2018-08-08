import React from 'react';
import { Animated, Text } from 'react-native'
import {Font} from 'expo'

class AnimatedBar extends React.Component {

    constructor(props){
        super(props);
        this._width = new Animated.Value(0)
        this.state = {
            color : 'white',
            fontLoaded : false

        }
    }

  async  componentDidMount(){
      await Font.loadAsync({
          "good_times" : require('../ImageAssets/Fonts/good_times.ttf'),
          "gothic" : require('../ImageAssets/Fonts/gothic.ttf')
      })
      this.setState({
          fontLoaded : true
      })
        const {value, delay} = this.props;
        Animated.sequence([
            Animated.delay(delay),
            Animated.timing(this._width, {
                toValue : value + 100,       
             })
        ]).start();
       

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
                        <Text style = {{fontSize : 36,
                         color : 'black', textAlign : 'left',
                         fontFamily : 'gothic', bottom : 2}}>
                    {this.props.text}%
                </Text>
                    ) : null
                }
               
            </Animated.View>
        );
    }
}

export default AnimatedBar