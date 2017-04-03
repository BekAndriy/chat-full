const express = require('express');
const path = require('path');
const formidable = require('formidable');
const fs = require('fs');
const socket = require('socket.io');
const port = process.env.PORT || 8080;
const app = express();
const startServer = app.listen(port);
const io = socket.listen(startServer);
const crypto = require('crypto');
const url = require('url');

const DB_CONNECTION = 'mongodb://127.0.0.1:27017';
const mongoose = require('mongoose');
mongoose.connect(DB_CONNECTION);

const USER_SCH = require('./db/schema.js');
const Users = mongoose.model('Users', USER_SCH);

const USER_IN_ROOMS = require('./db/client_online.js');
const U_inRoom = mongoose.model('U_inRoom', USER_IN_ROOMS);

const MESSAGES = require('./db/messages.js');
const Messages = mongoose.model('Messages', MESSAGES);

const REQUESTS = require('./db/requests.js');
const Requests = mongoose.model('Requests', REQUESTS);

const CHATS = require('./db/requests.js');
const Chats = mongoose.model('Chats', CHATS);

const USER_IN_CHAT = require('./db/client_in_chats.js');
const ClientInRoom = mongoose.model('ClientInRoom', USER_IN_CHAT);

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var cookieSession = require('cookie-session')
var MongoStore = require('connect-mongo')(session);


app.use(cookieParser());
app.use(session({
	secret:'somesecrettokenhere', 
	resave: true, 
	saveUninitialized: true,
	cookie: {
		path: '/',
		'maxAge': null,
		httpOnly: true,
		sameSite: true
	},

}));

app.use(bodyParser.urlencoded({ extended: true }));


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8090");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

var clients;

io.sockets.on('connection', (client) => {

// io.sockets.connected //Return {socket_1_id: {}, socket_2_id: {}} . This is the most convenient one, since you can just refer to io.sockets.connected[id] then do common things like emit()
// io.sockets.sockets //Returns [{socket_1}, {socket_2}, ....]. Can refer to socket_i.id to distinguish
// io.sockets.adapter.sids //Return {socket_1_id: {}, socket_2_id: {}} . Looks similar to the first one but the object is not actually the socket, just the information.

// // Not directly helps but still relevant
// io.sockets.adapter.rooms //Returns {room_1_id: {}, room_2_id: {}}
// io.sockets.server.eio.clients //Return client sockets
// io.sockets.server.eio.clientsCount //Return number of connected clients


	clients = Object.keys(io.eio.clients);
	// var clients = io.sockets.clients('room');


	client.on('get data', (user_data) => {
		let cookie = user_data;

		if (client.request.headers.cookie) {
			cookie = client.request.headers.cookie.indexOf('SITE_SESSION') !== -1 ? client.request.headers.cookie : user_data;
		}
		

		user_chat.getSession( cookie, (session_cookie) => {

			let sess = session_cookie ? session_cookie : 'none';
			
			Users.findOne({secure: sess}, 'first_name nick_name avatar gender role secure', (err, person) => {
				
				if (person) {
					U_inRoom.findOne({user_id: person._id}, (err,data) => {

						if ( data ) {

							data.client_id = client.id;

							data.save(()=>{
								
								user_chat.users_online(clients, function(users){});

								user_chat.send_request_users(person._id, ( data_req ) => {  // 'data' all users who sent request
									if (data_req)
										io.to(client.id).emit('usersss', data_req);

									ClientInRoom.find({user_id: person._id}, (err, rooms) => {
										if (rooms) {
											// console.log('ROOMS: ', rooms);
										}
									})
								})
							});


							
						} else {

							user_chat.init_user_in_chat(person, client.id, ( users ) => {

								user_chat.users_online(clients, function(users){});

								user_chat.send_request_users(person._id, ( data ) => {  // 'data' all users who sent request
									if (data)
										io.to(client.id).emit('usersss', data);

								})
							})
						}
					});
					Messages.find({room: ''}, (err, data_msg)=>{
						if (err)
							console.log('MSG NOT FOUND : ', err);
						io.emit('message init', data_msg);
					});

				} else {

					U_inRoom.find({user_session: sess}, (err, user) => {
						if (err)
							console.log(err);
						if (user.length) {
							user_chat.users_online(clients, function(users){});
						} else {
							let dataReq = {
								first_name: 'Guest', 
								_id: Date.now(), 
								role: 'user', 
								gender: 'user', 
								avatar: '', 
								nick_name: 'User', 
								secure: client.id,
								secure: sess
							} 
							user_chat.init_user_in_chat(dataReq, client.id, () => {
								user_chat.users_online(clients, function(users){});
							})
						}

						Messages.find({room: ''}, (err, data_msg)=>{
							if (err)
								console.log('MSG NOT FOUND : ', err);
							io.emit('message init', data_msg);
						});
					})

				}
			})
		});
	})
	

	client.on('read message', (data) => {
		
		console.log('DATA read message: ', data);

		ClientInRoom.findOne({room: data.room, user_id: data.user}, (err, user) => {
			if (user) {
				user.messages_unread = 0;

				user.save(() => {})
			}
		})

	})

	client.on('message', (data) => {
		
		let mes = data.message;
		let room = data.room;
		let images = data.images;

		U_inRoom.findOne({user_id: data._id}, (err,data) => {

				let { user, user_id } = data;
				let msg = new Messages({
					user,
					user_id,
					created: Date.now(),
					message: mes,
					room: room,
					images: images,
				})


				msg.save( (err) => {
					if (err)
						console.log('MSG SAVE ERR : ', err);
					if ( room ) {
						ClientInRoom.find({room: room}, (err, users) => {

							let users_id = [];
							for (let i = 0; i < users.length; i++) {
								users_id.push(users[i].user_id);
								users[i].messages_unread = users[i].messages_unread + 1;
								users[i].save(()=>{

								});
							}
							
							U_inRoom.find({user_id: users_id}, (err, data) => {
								
								// let clients_id = [];

								for (let y = 0; y < data.length; y++) {
									if (data[y].client_id && clients.indexOf(data[y].client_id) > -1) {
										
										io.sockets.connected[data[y].client_id].emit('room message', msg);
									}
								}				
							})
						})

						
					} else {
						io.emit('message', msg);
					}
				})	
			
			
		
		});
	});

	client.on('send request', ( data ) => {
		user_chat.save_request(data, (msg) => {
			console.log(msg);
		})
	});

	client.on('user logined', ( data ) => {
		
		Users.findOne({secure: data}, 'first_name nick_name avatar gender role, secure', (err, person) => { 
			user_chat.init_user_in_chat(person, client.id, () => {
				
				user_chat.users_online(clients, function(users){});

				user_chat.send_request_users(person._id, ( data ) => {  // 'data' all users who sent request
					io.to(client.id).emit('usersss', data);
				})
			})
		})
	})

	client.on('user logout', ( data ) => {
		user_chat.user_logout( data, client.id , () => {
			user_chat.users_online(clients, function(users){});
		})
	})

	client.on('getRequestsUser',( data ) => {
		U_inRoom.findOne({client_id: client.id}, (err, user) => {
			
			if (user) {

				user_chat.send_request_users(user.user_id, ( data ) => {  // 'data' all users who sent request
				
					client.emit('getRequestsUser', data);
				})
			}
		})
	})

	client.on('accept request', (data) => {

		user_chat.accept_request( data, ( status ) => {
			console.log(status);
		})

	})

	client.on('room init', ( data ) => {

		let res = {};
		res.room = data.chat;

		user_chat.partner_init(data, (user) => {

			res.users = user;

			user_chat.getMessages(data.chat, (msg) => {

				res.messages = msg;

				client.emit('room init', res);
			})
		})
	})

	client.on('disconnect', () => {

		U_inRoom.remove({client_id: client.id}, (err,data) => {
			user_chat.users_online(clients, function(users){});
		})

	});
});

app.post('/get-data-user', (req, res) => {
	signIn.checkUser(req,res,()=>{});
})

app.post('/user', (req, res) => {
	
	if( req.body.sign_in ) {
		signIn.login( req, res, () => {});

	} else if( req.body.registration ){
		signIn.registration(req, res);
		
	}
});

app.post('/change-user', (req, res) => {
	signIn.changeUser( req, res, function(){

	})
})

app.post('/logout', (req, res) => {
	signIn.logout( req, res);
});

app.post('/upload', (req, res) => {
	signIn.uploadImage(req, res);
	
})

console.log("server started on port " + port);





function er (err) {
	console.log(err);
}

function hashPassword(pass, salt, iteration) {
	let changedPassword = pass;
	for (let i = 0; i < iteration; i++){
		changedPassword = crypto.createHmac('sha256', String(salt))
                   .update(pass)
                   .digest('hex');;
	}
	return changedPassword;
}

var signIn = {

	login: function( req, res, callback ){
		if (req.body.login && req.body.password){

				let old_cookie = req.cookies.SITE_SESSION
				let currentUser = Users.findOne({login: req.body.login}, (err, person) => {
				
				if ( person ){

						let pass = hashPassword(req.body.password, person.salt, person.iteration);
						
						if( person.password == pass ){
							
							let dateNow = Date.now();
							let secure = hashPassword(String(dateNow), person.login, 3);

							res.cookie('SITE_SESSION',secure, { maxAge: 90000000, httpOnly: true });
							person.secure = secure;

							person.save((err) => {});


							user_chat.change_user_in_room( person, old_cookie, secure, () => {
								res.send({logined: true, secure: secure, user: person});
							})


						} else {
							res.send('password failed');
						}

					} else {
						res.send('not found');
					}
				});
			}
	},

	registration: function( req, res, client ){

		let currentUser = Users.findOne({login: req.body.login}, (err, person) => {

			if ( !person ){

				let iter = Date.now();
				iter = String(iter);
				iter = parseInt(iter.slice(-1)) + 1;

				let salt = String(Date.now()).slice(5);

				let pass = hashPassword(req.body.password, salt, iter);
				let { data_created, first_name, email, login, nick_name, gender, birthday, avatar} = req.body;
				let dateNow = Date.now();
				let secure = hashPassword(String(dateNow), login, 3);
				console.log(avatar);
				if (!avatar) {
					avatar = '/imgs/user-male.png';
				}

				let newUser = new Users({
					login: login,
					password: pass,
					email: email,
					first_name: first_name,
					data_created: data_created,
					salt: salt,
					iteration: iter,
					secure: secure,
					nick_name: nick_name,
					gender: gender,
					birthday: birthday,
					avatar: avatar,
				})


			 	newUser.save(function (err) {
					if (err) { 
						er(err); 
					} else {
						res.cookie('SITE_SESSION',secure, { maxAge: 9000000, httpOnly: true });
						res.send({logined: true, secure: secure, user: newUser});
						callback();
					}
				})
			 	// res.send('created')
			} else {
				res.send('allrady user registered');
			}
		});

	},

	changeUser: (req, res, callback) => {
		req.body
		Users.findOne({secure: req.cookies.SITE_SESSION}, (err, per) => {
			if (err) return;

			if (per) {
				let u = req.body;

				if ( u.first_name ) per.first_name = u.first_name;
				if ( u.gender ) per.gender = u.gender;
				if ( u.avatar ) per.avatar = u.avatar;
				if ( u.email ) per.email = u.email;
				if ( u.nick_name ) per.nick_name = u.nick_name;
				if ( u.description ) per.description = u.description;
				if ( u.birthday ) per.birthday = u.birthday;

				per.save(()=>{
					callback(per);
					res.send({logined: true, secure: req.cookies.SITE_SESSION, user: per});
				})

				
			} else {
				cosnole.log('USER NOT FOUND');
			}
		})	

	},

	logout: function(req, res){

		Users.findOne({secure: req.cookies.SITE_SESSION}, (err, per) => {
			if (err) return;

			if (per) {
				res.cookie('SITE_SESSION','', { maxAge: 9000000, httpOnly: true });

				res.send({logined: false, secure: '', user: {}});
			}
		})
	},

	checkUser: function(req, res, callback){
		var cookie = req.cookies.SITE_SESSION;
	
		if (cookie) {
			let currentUser = Users.findOne({secure: cookie}, (err, per) => {
				if (err) return;

				if (per) {
					res.send({logined: true, secure: cookie, user: per});
				} else {
					res.send({logined: false});
					callback();
				}
			})
		} else {
			let secure = hashPassword(String(Date.now()), 'Some text', 3);
			res.cookie('SITE_SESSION', secure, { maxAge: 9000000, httpOnly: true });
			res.send({logined: false, secure: 'SITE_SESSION='+secure});
			callback();
		}
		// res.send(req.cookie);
	},

	uploadImage: function(req, res) {

		let form = new formidable.IncomingForm();
		let allPhotos = [];

		res.setHeader('Content-Type', 'text/html')

		// specify that we want to allow the user to upload multiple files in a single request
		form.multiples = true;

		// store all uploads in the /uploads directory
		form.uploadDir = path.join(__dirname, '../public/uploads');

		// every time a file has been uploaded successfully,
		// rename it to it's orignal name
		form.on('file', function(field, file) {

			let newFileName = file.name.split(' ').join('');
			let savedName = String(Date.now()) + '_' + newFileName;
			let pathToImageDb = path.join('/uploads', savedName);

			allPhotos.push(pathToImageDb);

			fs.rename(file.path, path.join(form.uploadDir, savedName));
		});

		// log any errors that occur
		form.on('error', function(err) {
			console.log('An error has occured: \n' + err);
		});

		// once all the files have been uploaded, send a response to the client
		form.on('end', function() {
			res.send(JSON.stringify(allPhotos));
			res.end('success');
		});

		form.parse(req);
	}
}

let user_chat = {

	save_request: (data, callback) => {

		Requests.find({from_user: data.from, to_user: data.to},function(err, req){
			if ( err )
				console.log('USER NOT FOUND id:', data.to)
			
			if ( req.length < 1 ) {
				let newReq = new Requests({
					from_user: data.from,
					to_user: data.to,
					date: Date.now(),
				})

				newReq.save((err)=>{
					if (err) console.log('DATA DOESN\'T SAVED');

					U_inRoom.find({_id: data.to}, (err, to_user) => {

						if (to_user) {
							callback('OK');
						}
					})
				})
			} else {
				console.log('YOU SENT REQUEST TO CURRENT USER');
			}
		})
	},

	accept_request: (data, callback) => {

		let custom_err = 'ERROR on accept request';

		Requests.find({from_user: data.from, to_user: data.to}, (err, req) => {
			
			if ( req ) {

				let users = [data.from, data.to]
				let dataChatCreated = Date.now()

				Requests.remove({from_user: data.from, to_user: data.to}, (err) => {

					let newChat = new Chats({
						date: dataChatCreated,
						name: '',
						description: ''
					})

					newChat.save((err) => {
						if (err)
							callback(custom_err);

						for (let i = 0; i < users.length; i++) {
							let user = new ClientInRoom({
								user_id:   users[i],
								room:     dataChatCreated,
								messages_unread: 0
							})
							user.save((err) => {
								if (err)
									er(err);

							})
						
						}
						dataChatCreated = '';
						callback('OK')
					})
				})

			} else {

				callback('User accept request');
			}
		})
	},

	send_request_users: (id, callback) => {

		let res = {}

		Requests.find({to_user: id}, {from_user: 1, _id: 0}, (err, data) => {
			let users_id = [];

			for (let i = 0; i < data.length; i++) {
				users_id.push(data[i].from_user);
			}

			Users.find({_id: users_id}, (err, data) => {
				if (err) 
					er(err);
				
				else
					res.requests = data;

					ClientInRoom.find({user_id: id}, 'room', (err, rooms) => {
						
						let room_arr = [];
						let res_room = [];
						for (let i = 0; i < rooms.length; i++) {
							room_arr.push(rooms[i].room);
						}

						Chats.find({date: room_arr}, (err, chats) => {
							
							for (let i = 0; i < chats.length; i++) {

								ClientInRoom.find({room: chats[i].date}, (err, data) => {
									let curr_chat = {};
									
											curr_chat.chat = chats[i];
											curr_chat.users = data;
											res_room.push(curr_chat);
											if (i == chats.length - 1) {
												console.log('ROOMS',res_room)
												res.chats = res_room;
												callback( res );
											}

								})
							}
						})
					})  
			})	
		})
	},

	change_user_in_room: (data, secure, new_secure, callback) => {

		U_inRoom.findOne({user_session: secure}, (err, user) => {

			if ( user ) {
				let { first_name, _id, role, gender, avatar, nick_name, secure} = data;
				user.user = {
					first_name,
					nick_name,
					avatar,
					gender,
					role,
				};
				user.user_id = _id;
				user.user_session = new_secure;

				user.save((err) => {
					if (err) 
						er(err);
					console.log('true')
					callback();
				});

			} else {
				callback();
			}

		})


		
	},

	init_user_in_chat: (data, client_id, callback) => {

		let { first_name, _id, role, gender, avatar, nick_name, secure} = data;

		U_inRoom.find({user_session: secure}, (err, user) => {

			if ( user.length < 1 ) {

				let newClient = new U_inRoom({
					user: {
						first_name,
						nick_name,
						avatar,
						gender,
						role,
					},
					user_id: data._id,
					user_session: secure,
					client_id: client_id,
				})

				newClient.save( (err) => {
					if (err)
						console.log('SAVE ERR : ', err);
					callback();
				});

			} else {

				user[0].user = {
						first_name,
						nick_name,
						avatar,
						gender,
						role,
					};
				user[0].user_id = data._id,
				user[0].user_session = secure,
				user[0].client_id = client_id,

				user[0].save( (err) => {
					if (err)
						console.log('SAVE ERR : ', err);

					callback();
				})
			}		
		})
	},

	users_online: (clients, callback) => {

		U_inRoom.find({client_id: clients}, (err, users) => {
			if (err)
				console.log('FIND ERR : ',err);
			
			io.emit('user_in_chat', users);
			callback(users);
		})
	},

	user_logout: (data, client_id, callback) => {

		U_inRoom.remove({client_id: client_id}, (err, user) => {
			if (err)
				console.log('FIND ERR : ',err);

			let { first_name, nick_name, avatar } = data.user


			let newClient = new U_inRoom({
				user: {
					first_name,
					nick_name,
					avatar,
					gender: '',
					role: 'user',
				},
				user_id: String(Date.now()),
				user_session: '',
				client_id: client_id,
			})

			newClient.save(() => {
				callback();
			})
		})
	},

	getSession: (client, callback) => {
		
		if ( client ) {

			var parseCookie = client.split('; ')
			
			for (let i = 0; i < parseCookie.length; i++) {
				if (parseCookie[i].indexOf('SITE_SESSION') !== -1 ) {
					let = session_cookie = parseCookie[i].split('=')[1];

					callback(session_cookie);
				}
			}
			
		} else {
			callback();
		}
	},

	partner_init: (data, callback) => {

		ClientInRoom.find({room: data.chat}, (err, found) => {
			let user_inroom = [];
			for (let i = 0; i < found.length; i++) {
				if (found.user_id != data.user) {
					Users.findOne({_id: found[i].user_id}, (err, user) => {
						user_inroom.push(user);

						if (i == found.length - 1) {
							callback(user_inroom);
						}
					})
				}
			}
		})
	},

	getMessages: (room_id, callback) => {

		room_id = room_id ? room_id : ""; 

		Messages.find({room: room_id}, (err, data_msg)=>{
			callback(data_msg);
		});
	},	
}