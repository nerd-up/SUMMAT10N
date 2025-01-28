import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TextInput,
    Alert,
    KeyboardAvoidingView,
} from 'react-native';
import React, { useState } from 'react';
import { setInPost } from '../services/DataService';
import { getUserId } from '../utils/Auth';
import { showError, showSucess } from '../utils/utility';
import { peaceTopics } from '../utils/peaceTopics';
const getCurrentMonthTopic = () => {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    return peaceTopics.find((topic) => topic.month === currentMonth) || { topic: '', description: '' };
};

const EditPost = ({editModalVisible,setEditModalVisible}) => {
    
    const [editedText, setEditedText] = useState('');
    const [adminId] = useState(getUserId());
    const getCurrentTime = () => new Date().toString();
    const { topic, description } = getCurrentMonthTopic();
    const saveEditedPost = async () => {
        if (!editedText.trim()) {
            Alert.alert('You cannot save an empty post');
            return;
        }
        try {
            const time = getCurrentTime();
            const updatedPost = {
                adminId,
                text: editedText,
                time,
                topic,
            };
            await setInPost(updatedPost);
            setEditedText(editedText);
            setEditModalVisible(false);
            showSucess('Success', 'Post updated successfully!');
        } catch (error) {
            showError('Error', 'Failed to update the post. Please try again.');
        }
    };
    
    return (
        <Modal visible={editModalVisible} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Edit Post</Text>
                    <TextInput
                        style={[
                            styles.postInputStyle,
                            { borderRadius: 10, padding: 10, marginTop: 10 },
                        ]}
                        multiline={true}
                        numberOfLines={4}
                        value={editedText}
                        onChangeText={(text) => setEditedText(text)}
                    />
                    <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'space-between' }}>
                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: 'green', flex: 1, marginRight: 5 }]}
                            onPress={saveEditedPost}
                        >
                            <Text style={{ color: 'white', textAlign: 'center' }}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: 'red', flex: 1, marginLeft: 5 }]}
                            onPress={() => setEditModalVisible(false)}
                        >
                            <Text style={{ color: 'white', textAlign: 'center' }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default EditPost

const styles = StyleSheet.create({})