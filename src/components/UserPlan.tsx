import { View, StyleSheet, GestureResponderEvent, TouchableOpacity, ViewStyle, Text } from 'react-native';
import React from 'react';
import Colors from '../theme/ScholarColors';
interface Props{
  item:any;
  onPress?: ((e: GestureResponderEvent) => void) | undefined;
  selected?: boolean;
  style?:ViewStyle;
  showtag?: boolean;
}
const UserPlan = ({item,onPress,selected,style,showtag}:Props) => {
  
  return (
    <TouchableOpacity onPress={onPress} style={[styles.card,selected&&styles.selected,style]}>
       { showtag&&
        <View style={styles.priceTag}>
            <Text style={styles.priceTagText}>{item?.priceMonthly? '$'+item?.priceMonthly:item?.price<1?'Free':item?.price}</Text>
        </View>
}
        <Text style={styles.cardHeading}>{item?.type}</Text>
       <Text style={styles.planTypeText}>{item?.title}</Text>
       {/* { item.points.map((point:any,index:number) =>(
           <Text key={index} style={styles.bullet}>{"\u2022 "+point}</Text>
       )) 
}  */}
       <Text style={styles.priceText}>{"\u2022"} {item?.currency} {item?.priceMonthly?(item?.priceMonthly+'/Month OR '+'$'+item?.priceYearly+'/Year'):item?.price}</Text>
 
   
    </TouchableOpacity>
  )
}

export default UserPlan

const styles = StyleSheet.create({
   card:{
    backgroundColor:'#edede9',
    padding:15,
    borderRadius:10,
    marginVertical:'3%',
    width:'80%',
    elevation:4,
    overflow:'hidden',
   },
   selected:{
    backgroundColor:'#5e9abe',
    borderRightColor:'black',
    borderBottomColor:'black',
   },
   priceTag:{
    padding:5,
    right:0,
    top:'2%',
    left:'65%',
    // borderRadius:10,
    position: 'absolute',
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor:Colors.primary,
    transform: [{ rotate: '45deg' }],
    height:32,
    width:150,
    marginLeft:'3%',
    marginTop:'2%',
   },
   tagImg:{
    width:50,
    height:55,
    resizeMode:'contain',
    tintColor:Colors.primary ,
   },
   priceTagText:{
    position:'absolute',
    fontWeight:'bold',
    fontSize:18,
    left:'45%',
   },
   cardHeading:{
    fontSize:24,
    fontWeight:'bold',
   },
   priceText:{
    fontSize:18,
    fontWeight:'bold',
    color:Colors.primary
   },
   planTypeText:{
    fontSize:18,
    fontWeight:'bold',
   },
   bullet:{
    fontSize:17,
   }
})