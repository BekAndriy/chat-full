import React from 'react';

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import ActionAndroid from 'material-ui/svg-icons/content/add-circle';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const items = [
  <MenuItem key={1} value={1} primaryText="Male" />,
  <MenuItem key={2} value={2} primaryText="Famel" />,
];

export default React.createClass({
	getInitialState(){
		return {
			sex: '',
			avatar: 'http://archytele.com/wp-content/uploads/2016/05/AVA-SOVISL-534239.jpg',
		}
	},

	changeModalType () {
		console.log('chatge')
		this.props.changeModalType();
	},


	render() {

		return (

			<div className="sign-in-modal">
			    <h2>Registration<span className="sub-title-modal" onClick={this.changeModalType}>Sign In</span><hr /></h2>
				

				<div className="btn-wrapper">
					<TextField
						style={{width: '100%'}}
				    	onChange={this.handleChangeInfo}
					    floatingLabelText="Login:"
					    className='log-login'
				    />
			    </div>

			    <div className="btn-wrapper">
				    <TextField
					    style={{width: '100%'}}
					    onChange={this.handleChangeNick}
					    floatingLabelText="Nick name:"
					    className='log-nickName'
				    />
			    </div>
			    
			    <div className="btn-wrapper">
				    <TextField
				    	style={{width: '100%'}}
					    hintText="Your password"
					    floatingLabelText="Password:"
					    type="password"
					    className='log-password'
				    />
			    </div>

			    <div className="btn-wrapper">
				    <TextField
				    	style={{width: '100%'}}
					    hintText="Your password"
					    floatingLabelText="Password:"
					    type="password"
					    className=''
				    />
			    </div>

			</div>

		)
	}
})
			    	// multiple 