// constants
const GET_ALL_USERS = 'users/GET_ALL_USERS'

// action creators
const getAllUsers = users => {
    return {
        type: GET_ALL_USERS,
        payload: users
    }
}

// thunks
export const getAllUsersThunk = () => async (dispatch) => {
    const res = await fetch('/api/users/')

    if (res.ok) {
        // do the things
        const data = await res.json();
        dispatch(getAllUsers(data.users))
        return null;
    } else if (res.status < 500) {
        const data = await res.json();
        if (data.errors) {
            return data.errors;
        }
    } else {
        return ["An Error Occured. Please try again later."]
    }
}

// reducer
const initialState = {}
export default function reducer(state = initialState, action) {
    const newState = { ...state }
    switch(action.type) {
        case GET_ALL_USERS: {
            for (const user of action.payload) {
                newState[user.id] = user
            }
            return newState;
        }
        default:
            return state
    }
}
