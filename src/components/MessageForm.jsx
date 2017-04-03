import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import AddPhoto from 'material-ui/svg-icons/image/add-a-photo';

import store from './redux/reducers.js';

const textareaStyle = {
	width: '100%'
}

export default React.createClass({

	getInitialState(){
		return {
			textfiels: '',
			showSpiner: false,
			attachmentImages: []
		}
	},

	handleSubmit(event){
		event.preventDefault();
		if (this.props.user.logined){
			store.dispatch({ type: 'IMAGE_ATTACHMENT', images: this.state.attachmentImages });

			let message = this.refs.textField.props.value;

		    this.setState({ 
		    	textfiels: '',
		    	attachmentImages: [] 
		    });

			this.props.onSubmitForm(message);
		} else {
			console.log("only logined user will be send messages!")
		}
		
	},

	handleChangeText(event){

		this.setState({ textfiels: event.target.value })
	},

	uploadImageToChat() {
		$('.add-image-chat').click();
	},

	handleUploadeFile(e) {
		
		this.setState({showSpiner: true})
		
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


				var data = JSON.parse(data)

				console.log(data);

				let newData = this.state.attachmentImages.slice();

				for (let i = 0; i < data.length; i++) {
					
					if (data[i]){
						newData.push( data[i].replace(/\\/gi,'/') );
					}
				}

				this.setState({
					showSpiner: false,
					showPhotoSide: true,
					attachmentImages: newData
				});				
			},
			error: function(err){
				console.log(err);
			},
		});
	},

	handleRemoveImage(photo) {
		
		let newImage = this.state.attachmentImages.slice();
		let index = newImage.indexOf(photo);

		newImage.splice(index, 1);

		this.setState({attachmentImages: newImage});
	},

	render (){

		let mainClass = 'message-form-wrap';

		if ( this.state.attachmentImages && this.state.attachmentImages.length > 0 ) {
			mainClass += ' active';
		}

		return(
			<div className={mainClass}>
				<div className="textarea-wrapper">
				<MuiThemeProvider>
					
					<form className="message-form" onSubmit={this.handleSubmit}>
						
					{
						!this.state.showSpiner ? 
						
						"" 
						
						:

					    ""
					}

						<TextField
							name='message'
							style={textareaStyle}
							hintText="Message"
							floatingLabelText="Enter your message"
							multiLine={true}
							rows={3}
							rowsMax={3}
							value={this.state.textfiels}
							onChange={this.handleChangeText}
							ref='textField'
					    />

					   	

					    <RaisedButton type="submit" label="SEND" primary={true} fullWidth={true}  />
						
						<AddPhoto className="chat-upload-image-btn" onClick={this.uploadImageToChat} />
					
					</form>

				</MuiThemeProvider>

				</div>
				<div className="add-image-wrapper">
					{
						this.state.attachmentImages.map((el, ind) => {
						return <div 
									style={{background: 'url(' + el + ') no-repeat 50%'}}
									className="image-wrapper" 
									key={ind}>
									<span className="removeImage" onClick={this.handleRemoveImage.bind(null, el)}>X</span>
								</div>
						})		
					}
				
						<form>
							<input 
								name="add-image-chat"
								className="add-image-chat"
								type="file"
								accept="image/*"
								multiple
								onChange={this.handleUploadeFile}
							/>
						</form>
				</div>
			</div>
		)
	}
})

