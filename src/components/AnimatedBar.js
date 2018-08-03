import React from 'react';
import { Animated, Text } from 'react-native'

class AnimatedBar extends React.Component {

    constructor(props){
        super(props);
        this._width = new Animated.Value(0)
        this.state = {
            color : 'white',

        }
    }

    componentDidMount(){
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
                <Text style = {{fontSize : 36, color : 'black', textAlign : 'left'}}>
                    {this.props.text}%
                </Text>
            </Animated.View>
        );
    }
}

export default AnimatedBar