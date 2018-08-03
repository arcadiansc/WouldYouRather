import React from 'react';
import {Text, View, Dimensions, TouchableOpacity} from 'react-native';

var {height , width} = Dimensions.get('window')
const Card = ({cardText, onPress}) => {
    return(
        <TouchableOpacity style = {{height : height / 2.5, width : width - 40, borderWidth :2, 
        justifyContent : 'center', alignItems : 'center', left : 20}}
            onPress = {onPress}
        >
            <Text style = {{fontSize : 24}}>
                {cardText}
            </Text>
        </TouchableOpacity>
    );
}

export default Card;