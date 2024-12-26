import { ImageStyle, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import React from 'react'
import Colors from '../theme/ScholarColors';

interface Props{
    style?:ViewStyle;
    title:string;
    onpress?:any;
}
const RowBtn = ({style,title,onpress}:Props) => {
  
  return (
   <TouchableOpacity onPress={onpress} style={[styles.container,style]}>
<Text>
    {title}
</Text>
   </TouchableOpacity>
  )
}

export default RowBtn

const styles = StyleSheet.create({
    container:{
        width:'80%',
        // alignItems:'center',
        padding:10,
    },
    txt:{
        fontSize:16,
        fontWeight:'600',
        color:Colors.text,

    }
})