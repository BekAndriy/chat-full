var connection_server = 'http://localhost:8080'
import store from '../src/components/redux/reducers.js'
import defaultUser from '../src/json/default.user.js';
import 'jquery';


var user = {
	login: (data) => {
		console.log(data);
		$.ajax({
			url: connection_server + '/user',
			type: 'POST',
			data: data,
			xhrFields: {
				withCredentials: true
			},
			success: function(data, textStatus, XMLHttpRequest){
				store.dispatch({ type: 'ADD_TODO', user: data });
			},
			error: function(err){
				console.log(err);
			}
		})
	},

	logout: function(){
		$.ajax({
			url: connection_server + '/logout',
			type: 'POST',
			data: {logout: 'user logout'},
			xhrFields: {
				withCredentials: true
			},
			success: function(data, textStatus, XMLHttpRequest){

				let res = data;
				res.user = defaultUser.user;
				store.dispatch({ type: 'ADD_TODO', user: res })

			},
			error: function(err){
				console.log('Logout failed: ', err);
			}
		})
	}, 

	changeUser: function(data, callback){
		
		$.ajax({
			url: connection_server + '/change-user',
			type: 'POST',
			data: data,
			xhrFields: {
				withCredentials: true
			},
			success: function(data, textStatus, XMLHttpRequest){
				
				store.dispatch({ type: 'ADD_TODO', user: data });
				callback();
			},
			error: function(err){
				console.log(err);
			}
		})

	},

	initUser: function(ad, callback){
		$.ajax({
			url: 'http://localhost:8080/get-data-user',
			type: 'POST',
			crossDomain: true,
			data: {name: 'name'},
			xhrFields: {
				withCredentials: true
			},
			success: (data) => {

				if (data.logined)
					store.dispatch({ type: 'ADD_TODO', user: data });

				callback(data);
				

			},
			error: function(err){
				console.log(err);
			},
			complete: function () {
				
			}
		});
	}
}

module.exports = user;




// import axios from 'axios';

// 	var config = {
// 		headers: {
// 			'Content-Type': 'application/json',
// 		}
// 	};

// (function () {
//         var output = document.getElementById('output');
//         document.getElementById('upload').onclick = function () {
//           var data = new FormData();
//           data.append('foo', 'bar');
//           data.append('file', document.getElementById('file').files[0]);
//           var config = {
//             onUploadProgress: function(progressEvent) {
//               var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
//             }
//           };
//           axios.put('/upload/server', data, config)
//             .then(function (res) {
//               output.className = 'container';
//               output.innerHTML = res.data;
//             })
//             .catch(function (err) {
//               output.className = 'container text-danger';
//               output.innerHTML = err.message;
//             });
//         };
//       })();




// axios.post( connection_server + '/user', data, config)
		//   .then(function (response) {

		//   	store.dispatch({ type: 'LOGINED', user: response })

		//     console.log('response: ',response);
		// })
		//   .catch(function (error) {
		//     console.log('error: ',error);
		// });