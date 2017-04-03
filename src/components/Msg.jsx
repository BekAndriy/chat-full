import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';

const iconStyle = {
	height: "20px"
}

export default React.createClass({
	handleClickOnElemen(el){
		
	},

	componentDidMount() {

	},

	render (){

		return(
			<div className="message">
			
				{this.props.messages.map((data ,ind) => {

					let { created } = data;

					let day    = (new Date(Number(created))).getDate();
			        let month  = (new Date(Number(created))).getMonth()+1;
			        let hours  = (new Date(Number(created))).getHours();
			        let minute = (new Date(Number(created))).getMinutes();

					let avatar = data.user.avatar ? data.user.avatar : '/';
					avatar = avatar ? avatar.replace(/\\/gi,'/') : '';

					let images;

					if ( data.images && data.images.length ) {
						images = data.images.map((el, index) => {

							return (
								<figure key={index}>
							      <a className="image-gallery-link" href={el} data-size="1024x768">
							          <img src={el} alt="Image attachment" />
							      </a>
							    </figure>
							    )

							//return <div key={index} style={{'background': 'url("' + el + '") no-repeat center center / cover'}} className="photo"  />
							
						})
					}

					return (
						<div key={data.user_id} className={"message-block " + (this.props.user_id == data.user_id ? 'current' : '')} key={ind}>

							<div className="m-avatar-wrap">
								<div style={{'background': 'url(' + avatar + ') no-repeat 50% 50%'}}></div>
							</div>
							<div className="m-date">
								<span>{day}.{month}</span>
								<span>{hours}:{minute}</span>
							</div>

							<div className="m-text-body">
								
								<div className="m-text-header">
								<div className="m-name">{data.user.nick_name}</div>
									
								</div>
								<div className="m-text-wrap">
									<div className="m-text">{data.message}</div>
									<div className="m-likes">{/*data.msgLikes ? data.msgLikes : '0'*/}
									
									</div>
								</div>
								{ images ? <div className="attachment-wrapper attachment-gallery">{images}</div> : '' }
							</div>
						</div>
					)
				})}
			</div>
			)
	}	
})
