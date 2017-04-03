import React from 'react';

import store from './redux/reducers.js'
import vkApi from './api/api.jsx';
import user from '../../db/requests.js';

export default React.createClass({

	handleVkLogout(event){
		event.preventDefault();
		user.logout();
		// var user = vkApi.logout();
	},

	handleOpenSettings(event){
		this.props.setingsOpen();
	},

	handleOpenSideBar(){
		this.props.onGetRequestsUser();
	},

	render (){
		let user = this.props.user;
		let { nick_name, avatar, first_name } = user.user;
		avatar = avatar ? avatar.replace(/\\/gi,'/') : '';


		return(
			<div className="header-wrap">
				<div className="header-inner-wrap">
					<h1 className="night-chat">Night Chat</h1>
					<div className="user-info">
						<div className="avatar" onClick={this.handleOpenSettings} >
							<div style={{'background': 'url(' + avatar+ ') no-repeat 50% 50%'}}>
							</div>							
						</div>
						<div className="name-user">{first_name} (nick: {nick_name})</div>
					</div>
				</div>

				<div className="settings-button">
					
					{ user.logined ?

						<a className="log-out" href="#" onClick={this.handleVkLogout}>
							<span></span>
						</a>
						
						:

						''

					}
					

					{ user.logined ? 

							<a className="reqests-letter" href="#" onClick={this.handleOpenSideBar}>
								<span>{(this.props.requests.length ? <i>{this.props.requests.length}</i> : '')}</span> 
							</a>
						: 

						<a className="settings-user" href="#" onClick={this.handleOpenSettings}>
							<span></span>
						</a>
					}
					
					
					
				</div>

			</div>
			
			)
	}	
})

function calcNumbersActive(...theArgs) {
	let count = 0;

	for (let i = 0; i < theArgs.length; i++) {
		count += theArgs[i].length;
	}

	return count;
}