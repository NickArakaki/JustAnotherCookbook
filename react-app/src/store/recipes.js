// constants
const GET_ALL_RECIPES = "recipes/GET_ALL_RECIPES"

// action creators
const getAllRecipes = recipes => {
    return {
        type: GET_ALL_RECIPES,
        payload: recipes
    }
}

// thunks

// reducer
const initialState = {}

export default function reducer(state = initialState, action) {
    switch(action.type) {
        default:
            return state
    }
}
