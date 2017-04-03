import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default React.createClass({

	render (){
	
		let u = this.props.users;

		if (u.length <= 2) {
			for ( let i = 0; i < u.length; i++ ) {
				if ( u[i]._id !== this.props.user) {
					u = u[i]
				}
			}
		}
		
		let { description, nick_name, avatar, birthday, gender, first_name } = this.props.user

		return(
			<div className="side-bar-wrap room">
				<div className="back-main-chat" onClick={this.props.onOpenMainRoom}>
					<span>Go to back</span>
				</div>

				<div className="header-user">
					<div className="avatar" style={{'background': 'url(' + u.avatar+ ') no-repeat 50% 50%'}}></div>

					<div className="main-info">
						<div className="name">{u.first_name}</div>
						<div className="nick">{u.nick_name}</div>
						<div className="birthday">{u.birthday}</div>
					</div>
				</div>

				{
					u.description ? 

					<div className="description">
						{ u.description }
					</div> : ''
				}
				
			</div>
		)
	}	
})
