import React, { useState } from 'react';
import { ImageBackground, TouchableOpacity, View, Text } from 'react-native';
import styles from './styles';
import Container from '../../components/Container';
import data from '../../data/chat';
import ChatComponent from '../../components/chat';
import Background from '../../../assets/chat.jpg';
import DialogFlow from '../../utils/dialogflow';

const HeaderNavigation = ({ navigate }) => {
	return (
		<View style={styles.headerNavigation}>
			<TouchableOpacity
				style={styles.navigationButton}
				onPress={() => console.log('on Chat')}>
				<Text style={styles.buttonTitle}>Talk to me</Text>
			</TouchableOpacity>
			<View style={styles.verticalSeparator} />
			<TouchableOpacity
				style={styles.navigationButton}
				onPress={() => navigate('Tests')}>
				<Text style={styles.buttonTitle}>Self-help</Text>
			</TouchableOpacity>
		</View>
	);
};
const Home = ({ navigation }) => {
	const {
		language = 'english'
	} = navigation.dangerouslyGetParent().state.params;
	const [messages, setMessages] = useState(data[language]);
	const [text, setText] = useState('');
	const _handleNewMessage = newMessage =>
		setMessages(prevState => [newMessage, ...prevState]);

	const _handleResponse = async text => {
		try {
			const resp = await DialogFlow.sendText(text);
			const botMessage = {
				id: resp.responseId,
				message: resp.queryResult.fulfillmentText,
				_nodeId: 0
			};
			_handleNewMessage(botMessage);
		} catch (error) {
			alert(error.message);
		}
	};

	const _sendMessage = async () => {
		if (!text) return;
		const newMessage = {
			id: `txt-${new Date()}`,
			message: text.trim(),
			_nodeId: 1
		};
		setMessages(prevState => [newMessage, ...prevState]);
		_handleResponse(text.trim());
		setText('');
	};
	return (
		<Container containerStyles={styles.container}>
			<ImageBackground
				source={Background}
				style={{ flex: 1, width: '100%', width: '100%' }}>
				<HeaderNavigation navigate={navigation.navigate} />
				<ChatComponent
					data={messages}
					onSend={_sendMessage}
					message={text}
					onChangeMessage={setText}
				/>
			</ImageBackground>
		</Container>
	);
};

Home.navigationOptions = {
	headerTitle: 'Besty'
};
export default Home;
