const VK_ID = 5849900;
// const SECURE_KEY = 'uKvdmiPplKdFMoXGtRsS'
var user_ID;

import store from '../redux/reducers.js'

window.VK.init({
    apiId: VK_ID,
    scope: 'photos'
});

var my_id = '';




export default {
	login: () => {



		VK.Auth.login( (response) => {
			user_ID = response.session.mid;
	        console.log(response);
			getUserData();

	        // store.dispatch({ type: 'ADD_TODO', user: response });
	        // store.dispatch({ type: 'OPEN_USER_SETTINGS', modal: true })
	        
	    });

	},

	logout: () => {
		VK.Auth.logout((param) => {
			store.dispatch({ type: 'ADD_TODO', user: param });
		})
	},

	getStatus: () => {
		VK.Auth.getLoginStatus(function(response) {
		  if (response.status="connected") {

		  	store.dispatch({ type: 'ADD_TODO', user: response });

		  } else {

		  }
	  })
	},

	
	
}


function getUserData () {
	VK.Api.call('users.get', {user_ids: user_ID, fields: 'sex, city, country, home_town, photo_max_orig, domain'}, function(r) {
		if(r.response) {
			console.log(r.response);
		}
	});
}

//  redirectUri = 'http://localhost:8090/'
    // url = 'https://oauth.vk.com/authorize?client_id=5849900&display=popup&redirect_uri='+redirectUri+'&response_type=token&scope=photos'
    // var newWin = window.open(url, 'vk-login', 'width=665,height=370')

// VK.Api.call('users.get', {user_ids: 210700286, fields: 'bdate'}, function(r) {
// if(r.response) {
// alert(r.response[0].bdate);
// }
// });
function callbackFunc(result){
	console.log(result);
}