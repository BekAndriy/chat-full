import React from 'react';

import store from './components/redux/reducers.js';

import Messages from './components/Messages.jsx';
import SideBar from './components/SideBar.jsx';
import MessageForm from './components/MessageForm.jsx';
import messagesJson from './json/users.json';
import defaultUser from './json/default.user.js';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ChatsRequestsSidebar from './components/ChatsRequestsSidebar.jsx';
import SideBarRoomChat from './components/SideBarRoomChat.jsx';
import vkApi from './components/api/api.jsx'
import DialogUserSettings from './components/DialogUserSettings.jsx'

import initPhotoSwipeFromDOM from './components/photoswipe-init.js'

import user from '../db/requests.js';

import 'jquery';

export default React.createClass({
	
	getInitialState() {
		return {
			msg:              [],
			user:             defaultUser,
			dialogUserSettings: false,
			signInModal:      true,
			userOnline:       [],
			userLogined:      false,
			getRequests:      [],
			userChats:        [],
			openChatsSiteBar: false,
			roomChat:     {
								active: false,
								messages: [],
								user: {},
								room: ''
							}
		}
	},

	handleSubmitMsg(messg){
		let imgs = {
			img_rev:null, 
			img_cur: []
		}

		checkImageAttachment(store.getState(), imgs, (images) => {

			images = images.length ? images : [];

			let message = {
				message: messg,
				_id: this.state.user.user._id,
				room: this.state.roomChat.room,
				images: images
			}
			socket.emit('message', message);
		})
	},


	setNewMessage(message){
		this.setState({msg: message})
	},
	
	componentWillMount() {

		user.initUser('', (data) => {
			console.log('DATA: ', data)
			socket.emit('get data', data.secure);
		});

		// var a = vkApi.getStatus();
	},

	handleGetRequestsUser(){
		socket.emit('getRequestsUser', 'get');
	},
	

	componentDidMount() {

		let currentValue, 
			currentUser, 
			user = { u_prev: null, u_cur: defaultUser },
			newUser;
		var handleChange = ()  => {

			checkUser( store.getState(), user, ( newUser ) => { 
				if ( newUser ) {
					this.setState({ user: newUser});
					this.setState({userLogined: newUser.logined});

					if (newUser.logined) {
						socket.emit('user logined', newUser.secure);
					} else {
						socket.emit('user logout', defaultUser)
					}
				}
			 });
			
			let previousValue = currentValue;
			currentValue = store.getState().modal;

			if (previousValue && previousValue !== currentValue) {
				var windowOp = currentValue[currentValue.length - 1].userSettings;

				this.setState({ dialogUserSettings: windowOp});
			}
		}



		store.subscribe(handleChange)

		socket.on('message init', (data) => {
			this.setNewMessage(data);
			initPhotoSwipeFromDOM('.attachment-gallery');
		});

		socket.on('message', (data) => {
			let oldMsg = this.state.msg.slice();
			oldMsg.push(data);
			this.setState({msg: oldMsg});
			initPhotoSwipeFromDOM('.attachment-gallery');

			scrollBottom();
		});

		socket.on('user_in_chat', (data) => {
			if (typeof(data) === "object")
				this.setState({userOnline: data});
		})

		socket.on('my message', (data) => {
			console.log(data);
		})

		socket.on('new request', (data)=> {
			console.log('NEW req: ', data);
		})

		socket.on('room message', (data)=> {

			console.log(data)

			if (this.state.roomChat.room == data.room) {

				let oldMsg = Object.assign({}, this.state.roomChat)
				oldMsg.messages.push(data);
				this.setState({roomChat: oldMsg});

				if (this.state.user.logined && this.state.roomChat.active) {
					socket.emit('read message', {
						room: this.state.roomChat.room,
						user: this.state.user.user._id
					})
				}

				initPhotoSwipeFromDOM('.attachment-gallery');
				$('body').find('.messages-wrap').animate({scrollTop: $('body').find('.messages-wrap .message').height()}, 500);
			}
		})

		socket.on('room init', (data) => {
			console.log('ROOM INIT: ',data);
			data.active = true;
			this.setState({roomChat: data})
		})

		socket.on('usersss', (data) => {
			
			let chats = {
				chats: data.chats,
			}

			this.setState({
				getRequests: data.requests,
				userChats: chats
			});
		})

		socket.on('getRequestsUser', (data) => {
			this.setState({
				getRequests: data,
				openChatsSiteBar: !this.state.openChatsSiteBar
			});
		});
    },

    handleSendRequest (el) {

    	let req = {};
    	req.from = this.state.user.user._id;
    	req.to = el.user_id;

    	socket.emit('send request', req);
    },

    handleOpenSettings(){
    	this.setState({dialogUserSettings: !this.state.dialogUserSettings});
    },

    dialogUserSettingsClose(){
    	this.setState({dialogUserSettings: false});
    },

    handleAcceptRequest (fromUser) {
    	let accept = {
    		from: fromUser,
    		to: this.state.user.user._id
    	}
    	socket.emit('accept request', accept);
    },

    handleCloseChatsSiteBar () {
    	this.setState({openChatsSiteBar: false})
    },

    handleStartChat(data){
    	let req = data;
    	console.log('228',data);
    	req.user = this.state.user.user._id;
    	socket.emit('room init', req);
    },

    handleOpenMainRoom(){
    	let room = Object.assign({},this.state.roomChat);
    	room.active = false;
    	room.room = '';
    	this.setState({roomChat: room})
    },


	render(){

		console.log(this.state.userChats)

		let message = this.state.roomChat.active ? this.state.roomChat.messages : this.state.msg;
		return(
			
			<div className="chat-out-wrap">
			
				<Header 
					user={this.state.user}
					requests={this.state.getRequests}
					setingsOpen={this.handleOpenSettings}
					onGetRequestsUser={this.handleGetRequestsUser}
				/>
			
				<div className="chat-wrap">
					<div className="top-block">
						
						{	
							this.state.roomChat.active ? 

							<SideBarRoomChat 
								users={this.state.roomChat.users}
								user={this.state.user.user._id}
								onOpenMainRoom={this.handleOpenMainRoom}
							/>
							
							:

							<SideBar 
								handleSendRequest={this.handleSendRequest} 
								userOnline={this.state.userOnline}
								currentUserId={this.state.user.user._id}
							/>

						}
						

						<Messages 
							user_id={this.state.user.user._id} 
							messages={message} 
						/>

					</div>

					<MessageForm 
						onSubmitForm={this.handleSubmitMsg} 
						user={this.state.user} 
					/>

				</div>

				<Footer />
				
				<ChatsRequestsSidebar
					user={this.state.user.user._id}
					userChats={this.state.userChats}
					closeChatsSiteBar={this.handleCloseChatsSiteBar}
					openChatsSiteBar={this.state.openChatsSiteBar}
					getRequests={this.state.getRequests}
					onAcceptRequest={this.handleAcceptRequest}
					onStartChat={this.handleStartChat}
				/>

				<DialogUserSettings
					userLogined={this.state.userLogined}
					user={this.state.user}
					onOpen={this.state.dialogUserSettings}
					onClose={this.dialogUserSettingsClose}
					onSignInModal={this.state.signInModal} 
				/>
				
			</div>
		)
	}	
})


 function pushStateMessage(message, user){
 	
 	let msg = {};
 	msg.message = message;
 	msg.user = user;
 	msg.date = new Date().getTime();
 	msg.id = user.user._id.slice(0,2) + '_' + new Date().getTime();
 	msg.msgLikes = '';

 	return msg;
 }


 function checkUser( store, u, callback){
 	u.u_rev = u.u_cur;
	u.u_cur  = store.user;

 	if ( u.u_cur.length && u.u_rev && u.u_rev !== u.u_cur ) {
 		let user = u.u_cur[u.u_cur.length - 1].user
 		
 		callback(user);
		return user;
	}
 }

 function checkImageAttachment( store, img, callback){
 	img.img_rev = img.img_cur;
	img.img_cur  = store.imageattachment;

 	if ( img.img_cur.length && img.img_rev && img.img_rev !== img.img_cur ) {
 		let images = img.img_cur[img.img_cur.length - 1].images
 		
 		callback(images);
		return images;
	}
 }

 function scrollBottom() {
			$('body').find('.messages-wrap').animate({scrollTop: $('body').find('.messages-wrap .message').height()}, 500);
		}