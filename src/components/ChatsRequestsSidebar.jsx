import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import {List, ListItem} from 'material-ui/List';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import Done from 'material-ui/svg-icons/action/Done';
import Menu from 'material-ui/svg-icons/navigation/menu';
import Close from 'material-ui/svg-icons/navigation/close';

const listItemStyle = {'paddingLeft': '50px'}

export default React.createClass({
	
	getInitialState() {
		return {
			requestsList: true,
			chatList: true
		}
	},

	handleAcceptRequest(id){

		this.props.onAcceptRequest(id)
	},

	handleStartChat (data) {
		this.props.onStartChat({chat: data.chat.date});
	},


	handleToggleRequestsList() {
		this.setState({requestsList: !this.state.requestsList});
	},

	handleToggleChatsList() {
			this.setState({chatList: !this.state.chatList});
	},

	render (){

		let startChat = this.handleStartChat;

		let userRequests = '';
		if (this.props.getRequests.requests && this.props.getRequests.requests.length > 0){
						
			userRequests = this.props.getRequests.requests.map((el, ind) => {
			let avatar = el.avatar ? el.avatar.replace(/\\/gi,'/') : '';
	      	return <div key={ind} className="user-request-wrapper">
	      		
	      			<div className="avatar" style={{background: 'url("' + avatar + '") no-repeat'}}></div>

	      			<ListItem
							key={ind}
							primaryText={'Nick: ' + el.nick_name}
							style={listItemStyle}
							rightIcon={<Done color='#2cbe52' onClick={this.handleAcceptRequest.bind(null, el._id)} />}
						>

						<div className="sidebar-avatar" style={{'background': 'url(' + avatar + ') no-repeat 50% 50%'}}></div>
					</ListItem>
	      		</div>
	      		
	      })

		} else {
			userRequests = '';
		}

		let userChats = '';

		if (this.props.userChats.chats && this.props.userChats.chats.length > 0){

			userChats = this.props.userChats.chats.map((el, ind) => {

			let u = '';
			if (el.users.length <= 2) {
				for (let i = 0; i < el.users.length; i++) {
					
					if (this.props.user != el.users[i]._id){
						u = el.users[i];
						console.log('U ', this.props.userChats.chats)
					}

				}
			}
			
			let avatar = u.avatar ? u.avatar.replace(/\\/gi,'/') : '';
	      	return <div key={ind} className="user-request-wrapper">
	      			<div className="avatar" style={{background: 'url("' + u.avatar + '") no-repeat'}}></div>

	      			<ListItem
							key={ind}
							primaryText={u.first_name + '(nick: ' + u.nick_name + ')'}
							style={listItemStyle}
							rightIcon={<CommunicationChatBubble color='rgb(0, 188, 212)' onClick={startChat.bind(null,el)} />}
						>

						<div className="sidebar-avatar" style={{'background': 'url(' + avatar + ') no-repeat 50% 50%'}}></div>
					</ListItem>
	      		</div>
	      		
	      })

		} else {
			userChats = '';
		}
		
		return (

				<MuiThemeProvider className="requests-sidebar">
					<Drawer width={250} openSecondary={true} open={this.props.openChatsSiteBar} >
			          <span className='close-side-bar' onClick={this.props.closeChatsSiteBar}><Close/></span>
			          
			          <AppBar title="You list" showMenuIconButton={false} />
			          
			          <div className="side-requests label-list">
			          	<span className="btn-requests" onClick={this.handleToggleRequestsList}>{this.state.requestsList ? <Close/> : <Menu/>}</span>Requests</div>
			          
			          <div className="requests-list">
			          	{ this.state.requestsList ? userRequests : '' }
			          </div>
			          
			          <div className="side-chats label-list">
			          	<span className="btn-chats" onClick={this.handleToggleChatsList}>{this.state.chatList ? <Close/> : <Menu/>}</span>Chats</div>
			          
			          <div className="chats-list">
			          	{ this.state.chatList ? userChats : '' }
			          </div>
			        </Drawer>
		        </ MuiThemeProvider>
			
			)
	}


})



