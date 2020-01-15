import { UserState } from "../types/User";
import { UserActionTypes } from "../types/actions";


const initialState:UserState = {
    name: '',
    loading: false,
    email: '',
    errors: []
}

export default function(state:UserState = initialState, action:UserActionTypes){
    switch(action.type){
        case 'USER_REGISTER':
            return {
                ...state,
                name: action.payload ? action.payload.name : '',
                errors: [],
                loading: false
            };
        case "USER_LOGIN":
            return {
                ...state,
                name: action.payload ? action.payload.name : '',
                errors: [],
                loading: false
            }
        case 'USER_LOGOUT':
            return {
                ...state,
                name: '',
                errors: [],
                loading: false
            }
        case 'USER_EDIT':
            return {
                ...state,
                name: action.payload ? action.payload.name : state.name,
                email: action.payload ? action.payload.email : state.email,
                errors: [],
                loading: false
            }
        case 'USER_DELETE':
            return {
                ...state,
                name: '',
                email: '',
                errors: [],
                loading: false
            }
        case 'USER_CHECK_SESSION':
      
            return {
                ...state,
                name: action.payload ? action.payload.name : '',
                email: action.payload ? action.payload.email : '',
                errors: [],
                loading: false
            }
        case 'USER_ERROR':
            return {
                ...state,
                errors: action.payload,
                loading: false
            }      
        case 'USER_LOADING':
            return {
                ...state,
                loading: true
            }
        default:
            return state;

    }

}