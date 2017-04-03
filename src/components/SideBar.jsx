import React from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const listItemStyle = {'paddingLeft': '50px'}

export default React.createClass({
	handleSendRequest (el){
		console.log(el);
	},
	render (){

		let requestUser = this.props.handleSendRequest;

		return(
			<div className="side-bar-wrap">
				<MuiThemeProvider>
					<List>
						<Subheader>Users online</Subheader>
						{
							this.props.userOnline ? this.props.userOnline.map((el, ind) => {

								let { nick_name, avatar, first_name } = el.user;
								avatar = avatar ? avatar.replace(/\\/gi,'/') : '/imgs/user-male.png';

								let currentUser = this.props.currentUserId == el.user_id ? true : false;
								return (
									currentUser ? 
											<ListItem
													key={ind}
													className={'current-user'}
													primaryText={el.user.first_name}
													style={listItemStyle}
													
												>

												<div className="sidebar-avatar" style={{'background': 'url(' + avatar + ') no-repeat 50% 50%'}}></div>
											</ListItem>
											: 
											<ListItem
													key={ind}
													primaryText={el.user.first_name}
													style={listItemStyle}
													rightIcon={<CommunicationChatBubble onClick={requestUser.bind(null,el)} />}
												>

												<div className="sidebar-avatar" style={{'background': 'url(' + avatar + ') no-repeat 50% 50%'}}></div>
											</ListItem>
									)
							}) : ''
						}
						
					</List>
				</MuiThemeProvider>
			</div>
		)
	}	
})
