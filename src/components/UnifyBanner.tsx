import { Text, View, StyleSheet, Image, Platform } from 'react-native';


import styles from '../styles/Styles';
import Colors from '../theme/ScholarColors';
import { Fonts } from "../theme/Fonts";
type ScholarBannerProps = {

    text: string,
}

export default function ScholarBanner(props: ScholarBannerProps) {
    return (
        <View style={{ alignItems: 'center',height:350 }}>
            <Image source={require('../assets/clear.png')}/>
        </View>
    );
}
export  function ScholarMiniBanner(props: any) {
    const iconColor = Colors.primary
    return (
        <View style={{ 
            alignItems: 'center', 
            justifyContent: 'center', // Vertically centers the content
            height: 500 
        }}>
            <Image 
                source={require('../assets/clear.png')} 
                style={{
                    resizeMode: 'contain', // Ensures the image fits properly
                    height: 200, // Adjust based on your desired size
                    width: 200,  // Adjust based on your desired size
                }}
            />
        </View>
    );
}
const bannerStyles= StyleSheet.create({
    miniBanner:{
        flexDirection:'row',
        margin:2,
        marginTop:Platform.OS==='ios'?'10%':2,
        alignItems:'center',
        justifyContent:'center'
    },
    miniHeaderText:{
        fontFamily: "JustAnotherHand-Regular",
        textAlignVertical: "center",
        fontSize: 49,
        color: Colors.primary,
       marginLeft:10,
    }
})