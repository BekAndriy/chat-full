import React from 'react';
import con from './Constants.jsx';
import vkApi from './api/api.jsx';

import store from './redux/reducers.js'

export default React.createClass({
	handleVkLogin(){
		var user = vkApi.login();
		// this.props(vkApi.login());
	},

	render (){
		return(
			
			<div className="footer-wrap">
				<div className="footer-inner-wrap">
					<div className="social-network">
						<div onClick={this.handleVkLogin}></div>
					</div>
					<div className="copyright">© <span>{con.CURRENT_YEAR} Night Chat.</span> All Rights Reserved</div>
				</div>
			</div>
			
			)
	}	
})