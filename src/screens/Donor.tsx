import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Colors from '../theme/ScholarColors'
import {WebView} from 'react-native-webview'


const Donor = () => {
    return (
        <View style={styles.container}>

            {/* <View style={styles.card}>
                <Text style={styles.headingTextStyle}>Bronze Badge</Text>
                <Text style={styles.textStyle}>$0.99</Text>
            </View> */}
            <View style={styles.card}>
                <Text style={styles.headingTextStyle}>Silver Badge </Text>
                <Text style={styles.textStyle}>$4.99</Text>
            </View>
            {/* <View style={styles.card}>
                <Text style={styles.headingTextStyle}>Gold Badge</Text>
                <Text style={styles.textStyle}>$9.99</Text>
            </View> */}
            {/* <WebView source={{uri:'https://youtu.be/-xthzy1PxTA?si=UH43RB7H_nPbO44w'}} style={{flex:1}}></WebView> */}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: Colors.background,
        padding: 5,
        gap: 5
    },
    card: {

        height: 200,
        width: '95%',
        backgroundColor: Colors.lightBackground,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        elevation: 10,
    }
    ,
    headingTextStyle: {
        fontSize: 22,
        color: 'black',

    },
    textStyle: {
        fontSize: 20,
        color: 'gray',

    }

})

export default Donor