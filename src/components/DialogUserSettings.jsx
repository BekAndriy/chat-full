import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dialog from 'material-ui/Dialog';
import DatePicker from 'material-ui/DatePicker';
import ActionAndroid from 'material-ui/svg-icons/content/add-circle';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';


import user from '../../db/requests.js';

import ModalRegistration from './ModalRegistration.jsx';
import ModalLogin from './ModalLogin.jsx';
import UserAcountSettings from './UserAcountSettings.jsx'

import axios from 'axios';

export default React.createClass({
	
	getInitialState(){
		return {
			value: null,
			signIn: true,
			sex: '',
			changed_sex: false,
			nickName: '',
			changed_nickName: false,
			birthday: '',
			changed_birthday: false,
			name: '',
			changed_name: false,
			mail: '',
			changed_mail: false,
			description: '',
			changed_description: false
		}
	},

	handleClose(){
		this.setState({signIn: true});
		this.props.onClose()
	},

	handleChangeInfo(){

	},

	changeModalType (){
		this.setState({signIn: !this.state.signIn})
	},

	handleLogIn(){

			var si_login = $('.log-login').find('input').val();
			var si_password = $('.log-password').find('input').val();
			var si_name = $('.log-name').find('input').val();
			var si_nick = $('.log-nickName').find('input').val();
			var si_email = $('.log-email').find('input').val();

		if ( !$('.log-login').val().length && !$('.log-password').length ){
			console.log('you enter failed pass or login');
			return;

		} else if ( this.state.signIn && !!si_login.length && !!si_password.length){
			console.log('sdfsdf');
			let data = {
				login:    si_login,
				password: si_password,
				sign_in:  true
			}
			user.login( data );

		} else if ( !this.state.signIn && !!si_login.length && !!si_password.length ) {
			
			let data = {
				first_name  : si_name ? si_name : 'no-name',
				login       : si_login,
				email       : si_email ? si_email : 'no-email',
				password    : si_password,
				registration: true,
				date_created: Date.now(),
				nick_name   : si_nick,
				gender      : this.state.sex,
				birthday    : this.state.birthday,
				avatar      : this.state.avatar,
			}

			user.login( data );
		}
	},

	handleChangePassword(){

	},

	handleSaveInfo(){
		let u = this.props.user.user;

		let data = {}
			if ( this.state.changed_sex ) data.gender = this.state.sex;
			if ( this.state.changed_avatar ) data.avatar = this.state.avatar;
			if ( this.state.changed_birthday ) data.birthday = this.state.birthday;
			if ( this.state.changed_mail ) data.email = this.state.mail;
			if ( this.state.changed_nickName ) data.nick_name = this.state.nickName;
			if ( this.state.changed_name ) data.first_name = this.state.name;
			if ( this.state.changed_description ) data.description = this.state.description;

		user.changeUser( data, () => {
			this.setState({
				sex: '',
				changed_sex: false,
				nickName: '',
				changed_nickName: false,
				birthday: '',
				changed_birthday: false,
				name: '',
				changed_name: false,
				mail: '',
				changed_mail: false,
				description: '',
				changed_description: false
			})
		});
	},

	handleChangeMaxDate(data) {
		this.setState({
			birthday: data,
			changed_birthday: true
		});
	},

	handleChangeUploadedAvatar(data){
		this.setState({
			avatar: data,
			changed_avatar: true
		})
	},

	handleChangeGender(data){
		this.setState({
			sex: data,
			changed_sex: true
		})
	},

	handleChangeNick(data){
		this.setState({
			nickName: data,
			changed_nickName: true
		})
	},

	handleChangeFirstName(data){
		this.setState({
			name: data,
			changed_name: true
		})
	},

	handleChangeMail(data){
		this.setState({
			mail: data,
			changed_mail: true
		})
	},

	handleChangeDescription(data){
		this.setState({
			description: data,
			changed_description: true
		})
	},

	render (){
		
		let actions = [
			<FlatButton
				label="Cancel"
				primary={true}
				onTouchTap={this.handleClose}
			/>,
			<FlatButton
				label="Discard"
				primary={true}
				onTouchTap={this.handleLogIn}
			/>,
		];

		if (this.props.userLogined){
			actions = [
				<FlatButton
					label="Change password"
					primary={true}
					className='settings-chatge-password'
					onTouchTap={this.handleChangePassword}
				/>,

				<FlatButton
					label="Cancel"
					primary={true}
					onTouchTap={this.handleClose}
				/>,

				<FlatButton
					label="Discard"
					primary={true}
					onTouchTap={this.handleSaveInfo}
				/>,
			];
		}

		let {id, userNickName, userName, userAvatar} = this.props.user;
		let ava = userAvatar ? userAvatar : userNickName ? userNickName.slice(0,2) : 'Gu';

		let signIn = this.props.onSignInModal;
		return (
			<div className="dialog-wrap">
				<MuiThemeProvider className="messages-wrap">
					<Dialog
							actions={actions}
							modal={false}
							open={this.props.onOpen}
							onRequestClose={this.handleClose}
						>			
								<span className="modal-close-btn" onClick={this.handleClose}>✕</span>
									
									{ !this.props.userLogined && this.state.signIn ? <ModalLogin changeModalType={this.changeModalType} /> : ""}			
								
								    { !this.props.userLogined && !this.state.signIn ? <ModalRegistration changeModalType={this.changeModalType} /> : "" }


								    { this.props.userLogined ? 
							    		<UserAcountSettings 
									    	user={this.props.user}
									    	onChangeMaxDate={this.handleChangeMaxDate}
									    	onChangeAvatar={this.handleChangeUploadedAvatar}
									    	onChangeGender={this.handleChangeGender}
									    	onChangeNick={this.handleChangeNick}
									    	onChangeFirstName={this.handleChangeFirstName}
									    	onChangeMail={this.handleChangeMail}
									    	onChangeDescription={this.handleChangeDescription}
								    	/> : "" }

									{ !this.props.userLogined ? 
									<div><div className="registration-variants-or"><span>or</span></div>

								     <div className="social-network-modal">
								     	<span></span>
								     	<span></span>
								     	<span></span>
								     </div></div> : ''}
								     

					  	</Dialog>
				</MuiThemeProvider>
			</div>
		)
	}	
})