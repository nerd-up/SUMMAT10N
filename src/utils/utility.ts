import { ALERT_TYPE, Dialog } from "react-native-alert-notification"

export const showError = (text1='',text2='') => {
    Dialog.show({
      type: ALERT_TYPE.DANGER,
      title: text1,
      textBody:text2,
      button: 'close',
      autoClose: true,
    })
    }
    export const showSucess = (text1='',text2='') => {
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: text1,
        textBody:text2,
        button: 'close',
        autoClose: true,
      })
    }

    export const formatTransactionDate = (transactionDate: number) => {
      return new Date(transactionDate).toLocaleString();
    };