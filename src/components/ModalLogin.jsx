import React from 'react';

import TextField from 'material-ui/TextField';


const styleTextField = {
	"width": "50%",
}


export default React.createClass({
	changeModalType () {
		console.log('chatge')
		this.props.changeModalType();
	},
	render (){
		return (

			<div className="sign-in-modal">

			<h2>Sign In<span className="sub-title-modal" onClick={this.changeModalType}>Registration</span></h2>
			<hr />
				<TextField
			      floatingLabelText="Login"
			      errorText=""
			      style={styleTextField}
			      className='log-login'
			    />

			    <TextField
			      hintText="Your password"
			      floatingLabelText="Password"
			      type="password"
			      style={styleTextField}
			      className='log-password'
			    />

			</div>
			)
	}


})
