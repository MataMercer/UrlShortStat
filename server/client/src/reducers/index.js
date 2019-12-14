import {combineReducers} from 'redux'
import urlReducer from './urlReducer';
import userReducer from './userReducer';
export default combineReducers({
    url: urlReducer,
    user: userReducer
});