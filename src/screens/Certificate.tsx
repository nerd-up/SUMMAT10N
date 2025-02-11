import React from 'react'
import { Alert, Image, PermissionsAndroid, Platform, Text, TouchableOpacity, View } from 'react-native'
import Colors from '../theme/ScholarColors'
import useUserProfileStore from '../zustand/UserProfileStore'
import { useNavigation } from '@react-navigation/native'
import RNHTMLtoPDF from 'react-native-html-to-pdf';


const Certificate = () => {
    const navigation:any=useNavigation();
    const userProfile: any = useUserProfileStore(store => store)
    const goToWallOfPeace=()=>{
        navigation.navigate('WallOfPeace')
    }
    const requestStoragePermission = async () => {
        console.log("first")
        if (Platform.OS === 'android') {
          try {
            const granted:any = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            )
            return granted === PermissionsAndroid.RESULTS.GRANTED;
          } catch (err) {
            console.warn(err);
            return false;
          }
        } else {
          return true;
        }
      };
    
      const convertToPdf = async () => {
        const isStoragePermissionGranted = await requestStoragePermission();
        if (!isStoragePermissionGranted) return;
    
        const htmlContent = `
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; background-color: ${Colors.background}; }
                .container { border: 1px solid #ccc; padding: 20px; text-align: center; }
                .title { font-size: 32px; color: ${Colors.primary}; }
                .text { font-size: 28px; color: ${Colors.text}; }
                .underline { text-decoration: underline; }
              </style>
            </head>
            <body>
              <div class="container">
                <img src="data:image/png;base64,${require('../assets/unify-banner.png')}" style="height: 150px; width: 150px;" />
                <div class="title">Unify World Relations</div>
                <div class="text">Certificate Of Peace of treaty${userProfile.treatyDate}, "${userProfile.usrName}" has Signed The treaty for world Peace</div>
                <div class="text underline">${userProfile.usrName}</div>
                <div class="text">Candidate Signatures</div>
              </div>
            </body>
          </html>
        `;
        try {
          const options = {
            html: htmlContent,
            fileName: 'CertificateOfPeace',
            directory: 'Documents',
          };
          console.log("options",htmlContent)
          const file = await RNHTMLtoPDF.convert(options);
          console.log('PDF generated:', file.filePath);
          Alert.alert('PDF saved to:', file.filePath);
        } catch (error) {
          console.error('Error generating PDF:', error);
        }
      };

      console.log(userProfile);
      
    return (
        <View style={{ flex: 1, padding: 20, alignItems: 'center',justifyContent:'center' ,backgroundColor:Colors.background}}>
            <View style={{ flexDirection: 'row',alignItems:'center',justifyContent:'center' }}>
                <View>
                    <Image source={require('../assets/unify-banner.png')} style={{ height: 150, width: 150 }}>
                    </Image>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 32, color: Colors.primary }}>United</Text>
                    <Text style={{ fontSize: 32, color: Colors.primary }}>For</Text>
                    <Text style={{ fontSize: 32, color: Colors.primary }}>Peace</Text>
                </View>
            </View>
            <View style={{ marginTop: 50,justifyContent:'center' }}>
                <Text style={{ fontSize: 28, color: Colors.text, textAlign: 'center', justifyContent: 'center' }}>
                    Certificate Of Peace of {userProfile.treatyDate}, "{userProfile?.signed}" has Signed
                    The treaty for world Peace
                </Text>
                <Text style={{ textDecorationLine:'underline',fontSize: 28,fontWeight:'700', color: Colors.primary, textAlign: 'center', justifyContent: 'center' }}>
                    {userProfile.usrName}
                </Text>
                <Text style={{fontSize: 28, color: Colors.text, textAlign: 'center', justifyContent: 'center' }}>
                    stands is a voice standing for peace.
                </Text>
            </View>
            <View style={{marginTop:50}}>
                <TouchableOpacity onPress={() => goToWallOfPeace()}>
                    <View style={{ marginTop: 20, backgroundColor: Colors.primary, padding: 10, borderRadius: 10, width: 300, alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 20 }}>
                            Wall Of Peace
                        </Text>
                    </View>
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={() => convertToPdf()}>
                    <View style={{ marginTop: 20, backgroundColor: Colors.primary, padding: 10, borderRadius: 10, width: 300, alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 20 }}>
                            Download Your certificate
                        </Text>
                    </View>
                </TouchableOpacity> */}
            </View>
        </View>
    )
}

export default Certificate