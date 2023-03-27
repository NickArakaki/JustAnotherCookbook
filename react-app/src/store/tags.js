// constants
const GET_ALL_TAGS = "tags/GET_ALL_TAGS"

// action creators
const getAllTags = (tags) => {
    return {
        type: GET_ALL_TAGS,
        payload: tags
    }
}

// thunks
export const getAllTagsThunk = () => async (dispatch) => {
    const res = await fetch('/api/tags/')

    if (res.ok) {
        const data = await res.json();
        dispatch(getAllTags(data.tags))
        return null;
    } else if (res.status < 500) {
        const data = await res.json();
        if (data.errors) {
            return data.errors
        }
    } else {
        return ["An error occured. Please try again later."]
    }
}

// reducer
const initialState = {}
export default function reducer(state = initialState, action) {
    const newState = { ...state }
    switch(action.type) {
        case GET_ALL_TAGS: {
            for (const tag of action.payload) {
                newState[tag.id] = tag; // normalize by tag name for easier look up with use params
            }
            return newState;
        }
        default:
            return state;
    }
}
