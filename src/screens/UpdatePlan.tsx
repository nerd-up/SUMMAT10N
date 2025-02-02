import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { initConnection, getProducts, requestPurchase, getAvailablePurchases, Product } from 'react-native-iap';
import { showError, showSucess } from '../utils/utility';
import UserPlan from '../components/UserPlan';
import BackBtn from '../components/BackBtn';
import SButton from '../components/SButton';
import firestore, { count } from '@react-native-firebase/firestore';
import { getUserId } from '../utils/Auth';
import { useUpdatePlanStore } from '../zustand/UserProfileStore';
const productIds = ['Ate12']; // Replace with your product IDs

const UpdatePlan = ({navigation}:any) => {
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [plansData, setPlansData] = useState<Product[]>([]);
  const { updatePlanData,setUpdatePlan }:any = useUpdatePlanStore.getState();
  console.log(updatePlanData,"leh");
  
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const fetchPlans = async () => {
        setLoadingPlans(true);
        try {
          const products = await getProducts({skus:productIds});
          setPlansData(products);
          setLoadingPlans(false);
        } catch (error) {
          showError('Failed', 'Could not get plans: ' + error.message);
          setLoadingPlans(false);
        }
      };
    
      const onSelect = (item: any) => {
        setSelectedPlan(item);
      };
    
      const onNext = async () => {
        
        try {
          setUpdatePlan({ loading: true });
            // Purchase the selected plan
            const purchase = await requestPurchase({sku:selectedPlan.productId});
            
          if (purchase) {
            firestore()
            .collection('users')
            .doc(getUserId())
            .update({
              transactionDate:new Date(purchase?.transactionDate),
              postDone:false,
            })
            setUpdatePlan({ loading: false, status: 'success',error:'none',response: purchase});
            showSucess('Purchase Successful', `Subscribed to: ${selectedPlan.productId}`);
            navigation.navigate('Post');
          }
        } catch (error) {
          console.error('Purchase error:', error);
          setUpdatePlan({error:error});

          showError('Purchase Failed', error.message);
        } finally {
          setUpdatePlan({ loading: null });
          
        }
      };
    
      const restorePurchases = async () => {
       
        try {
          const purchases = await getAvailablePurchases();

          const activePurchase = purchases.find(
            (purchase) =>
              purchase.productId === 'Ate12'
          );
          if (activePurchase) {
            // setLoading(false)
            // showSucess('Subscription Restored', `Active Subscription: ${activePurchase.productId}`);
          }
          
        } catch (error) {
          console.error('Error restoring purchases:', error);
        }
      };

      useEffect(() => {
        const initializeIAP = async () => {
          try {
            await initConnection();
            fetchPlans();
            // restorePurchases();
          } catch (error) {
            console.error('IAP initialization error:', error);
          }
        };
    
        initializeIAP();
      }, []);
  
  return (
    <View style={styles.container}>
            <BackBtn />
       <Text>
        For Posting on The Wall you need to make a donation
       </Text>
      {plansData?.length > 0 &&
            plansData.map((item: any, index: number) => (
              <UserPlan
                onPress={() => onSelect(item)}
                showtag
                selected={item.productId === selectedPlan?.productId}
                item={item}
                key={index}
              />
            ))}
            <SButton action={onNext} text='Next' />
    </View>
  )
}

export default UpdatePlan

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:20,
        backgroundColor:'#f5f5f5',
        justifyContent:'center',
        alignItems:'center'
    }
})