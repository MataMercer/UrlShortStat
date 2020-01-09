import {createStore, applyMiddleware, compose} from 'redux';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import rootReducer from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import { AppActions } from './types/actions';

const initialState = {};

const middleware = [thunk as ThunkMiddleware<AppState, AppActions>];


// const store = process.env.NODE_ENV === 'development' ? createStore(rootReducer, initialState, compose(
//     applyMiddleware(...middleware),
//     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()  
// )) : 
// createStore(rootReducer, initialState, compose(applyMiddleware(...middleware))); 

export type AppState = ReturnType<typeof rootReducer>;

export const store = createStore(rootReducer, composeWithDevTools(
    applyMiddleware(...middleware),
    // other store enhancers if any
  ));
