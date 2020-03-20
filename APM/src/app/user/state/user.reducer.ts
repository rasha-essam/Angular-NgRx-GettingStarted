import { User } from '../user';
import { UserActions, UserActionTypes } from './user.actions';


export interface UserState {
    maskUserName: boolean;
    currentUser: User
}

const initialState: UserState = {
    maskUserName: true,
    currentUser: null
}
export function reducer(state = initialState, action: UserActions): UserState {
    switch (action.type) {
        case UserActionTypes.MaskUserName:
            return { ...state, maskUserName: action.payload };
        case UserActionTypes.SetCurrentUser:
            return { ...state, currentUser: { ...action.payload } };
        default:
            return state;
    }
}
