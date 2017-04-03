/*
 * action types
 */

export const ADD_TODO = 'ADD_TODO';
export const TOGGLE_TODO = 'TOGGLE_TODO';
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER';

export const OPEN_USER_SETTINGS = 'OPEN_USER_SETTINGS';
export const ADD_MESSAGE = 'ADD_MESSAGE';

export const LOGINED = 'LOGINED';
export const IMAGE_ATTACHMENT = 'IMAGE_ATTACHMENT';


export function logined (state = [], action) {
		switch (action.type) {
		case LOGINED:
			return [
				...state,
				{
					user: action.user,
				}
			]
		default:
		return state
	}
}


export function imageattachment (state = [], action) {
		switch (action.type) {
		case IMAGE_ATTACHMENT:
			return [
				...state,
				{
					images: action.images,
				}
			]
		default:
		return state
	}
}


export function user(state = [], action) {
	switch (action.type) {
		case ADD_TODO:
			return [
				...state,
				{
					user: action.user,
				}
			]
		default:
		return state
	}
}

export function modal(state = [], action) {
	switch (action.type) {
		case OPEN_USER_SETTINGS:
			return [
				...state,
				{
					userSettings: action.modal,
				}
			]
		default:
		return state
	}
}

export function messages(state = [], action) {
	switch (action.type) {
		case ADD_MESSAGE:
			return [
				...state,
				{
					messages: action.msg,
				}
			]
		default:
		return state
	}
}
