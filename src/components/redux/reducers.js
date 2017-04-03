import { combineReducers, createStore } from 'redux'
import { user, modal, messages, logined,  imageattachment} from './actions'

const rootReducer = combineReducers({
  user,
  modal,
  messages,
  logined,
  imageattachment
});

export default createStore(rootReducer);


// store.subscribe(() => {
//   console.log(store.getState());
// });