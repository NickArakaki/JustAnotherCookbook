// constants
const GET_RECIPE_REVIEWS = "reviews/GET_RECIPE_REVIEWS"

// action creators
export const getRecipeReviews = reviews => {
    return {
        type: GET_RECIPE_REVIEWS,
        payload: reviews
    }
}

// thunks

// reducer
const initialState = {recipeReviews: {}, userReviews: {}}

export default function reducer(state = initialState, action) {
    const newState = { ...state }
    switch (action.type) {
        case GET_RECIPE_REVIEWS: {
            newState.recipeReviews = {}
            for (const review of action.payload) {
                newState.recipeReviews[review.id] = review
            }
            return newState;
        }
        default:
            return state;
    }
}
