import React from 'react';

import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import DatePicker from 'material-ui/DatePicker';
import FlatButton from 'material-ui/FlatButton';
import ActionAndroid from 'material-ui/svg-icons/content/add-circle';

const styleTextField = {
	"width": "50%",
	border: '1px solid red'
}

const textFieldStyle = {
	border: '1px solid red'
}

const styleUpload = {
	display: 'none'
}

const radioBtnStyle =  {
    marginBottom: 16,
    width: '50%',
    display: 'inline-block',
    'float': 'left'
}


const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 1);
    minDate.setHours(0, 0, 0, 0);

export default React.createClass({

	getInitialState(){
		return {
			avatar: ''
		}
	},

	handleUploadeFile (e) {
		let files = $(e.currentTarget).get(0).files;

		if ( files.length > 0 ){
			var formData = new FormData();

			for (var i = 0; i < files.length; i++) {
				var file = files[i];

				formData.append('uploads[]', file, file.name);
			}
		}
		
		$.ajax({
			url: 'http://localhost:8080/upload',
			type: 'POST',
			data: formData,
			processData: false,
			contentType: false,
			success: (data) => {
				var siteLink = location.href;

				var data = JSON.parse(data)
				let avatar = data[0]
				avatar = avatar ? avatar.replace(/\\/gi,'/') : '';
				$('.acount-settings-header .user-avatar').css('background', 'url("'+avatar+'") no-repeat 50% 50%');
				this.props.onChangeAvatar(avatar);
				
				// for (var i = 0; i < data.length; i++) {
				// 	var imgLink = data[i].split('\\').join('/');
				// 	$('.sign-in-modal').append('<img src="' +  imgLink + '" alt="user photo">');
				// }
				// this.props.onChangeUploadedAvatar(data[0]);
			},
			error: function(err){
				console.log(err);
			},
		});
	},

	handleInitUploadFile () {
		$(this.refs.fileUpload).click();
	},

	handleChangeDescription (e, data) {
		this.props.onChangeDescription(data)
	},

	handleChangeGender (e, data) {
		this.props.onChangeGender(data)
	},

	handleChangeBirthday(e, val) {
		this.props.onChangeMaxDate((new Date(val)).getTime());
	},

	handleChangeNick (e, data) {
		this.props.onChangeNick(data);
	},

	handleChangeFirstName (e, data){
		this.props.onChangeFirstName(data);
	},

	handleChangeMail (e, data) {
		this.props.onChangeMail(data);
	},

	componentWillMount() {
		$('input, textarea').trigger('change');
	},

	render (){
		let u = this.props.user.user;
		
		return (

			<div className="acount-settings-modal">

			<p>Your acount information</p>
			<hr />

				<div className="acount-settings-header">
					<div className="user-avatar-wrapper">

						<div 
							className="user-avatar" 
							style={{background: 'url(' + u.avatar + ') no-repeat 50%'}} 
							onClick={this.handleInitUploadFile}
						>
							<span className="upload-image-btn"></span>
						</div>

					    <input type="file" 
					    	placeholder="select image" 
					    	name="img" 
					    	style={styleUpload}
					    	ref='fileUpload'
					    	onChange={this.handleUploadeFile}
						/>
					</div>

					<div>
						<RadioButtonGroup 
							name="shipSpeed" 
							defaultSelected={u.gender}
							onChange={this.handleChangeGender}
						>
					      <RadioButton
					        value="Male"
					        label="Male"
					        style={radioBtnStyle}
					      />
					      <RadioButton
					        value="Famale"
					        label="Famale"
					        style={radioBtnStyle}
					      />
					    </RadioButtonGroup>
					</div>

				</div>

				<div className="btn-wrapper">
					<TextField
						defaultValue={u.first_name}
				    	className='log-name'
				    	floatingLabelText="First Name:"
				    	errorText=""
				     	style={{width: '100%'}}
				      	onChange={this.handleChangeFirstName}
				    />
			    </div>

			    <div className="btn-wrapper">
				    <TextField
				    	defaultValue={u.nick_name}
				      	className='log-nickName'
				      	floatingLabelText="Nick name:"
				      	style={{width: '100%'}}
				      	onChange={this.handleChangeNick}
				    />
			    </div>

			    <div className="btn-wrapper">
				    <TextField
				    	defaultValue={u.email}
				    	floatingLabelText="Your email"
				    	className='log-email'
				     	style={{width: '100%'}}
				     	onChange={this.handleChangeMail}
				    />
			    </div>

			    <div className="btn-wrapper">

			    { u.birthday ? 

			    	<DatePicker
				    	defaultDate={new Date(u.birthday)}
					    hintText="Birthday"
					    floatingLabelText="Birthday"
					    className='birthday-settings'
					    style={{width: '100%'}}
					    onChange={this.handleChangeBirthday} 
				    />

				    :

				    <DatePicker
					    hintText="Birthday"
					    floatingLabelText="Birthday"
					    className='birthday-settings'
					    style={{width: '100%'}}
					    onChange={this.handleChangeBirthday} 
				    />
			     }
				    
				    


			    </div>

			    <TextField
			    	defaultValue={u.description}
					name='message'
					hintText="Message"
					floatingLabelText="Enter your message"
					multiLine={true}
					rows={3}
					rowsMax={3}
					ref='textField'
					style={{width: '100%'}}
					onChange={this.handleChangeDescription}
			    />

			</div>
			)
	}
})