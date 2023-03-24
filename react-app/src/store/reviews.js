// constants
const GET_RECIPE_REVIEWS = "reviews/GET_RECIPE_REVIEWS"
const POST_RECIPE_REVIEW = "reviews/POST_RECIPE_REVIEW"

// action creators
export const getRecipeReviews = reviews => {
    return {
        type: GET_RECIPE_REVIEWS,
        payload: reviews
    }
}

const postRecipeReview = review => {
    return {
        type: POST_RECIPE_REVIEW,
        payload: review
    }
}

// thunks
export const postRecipeReviewThunk = (recipeId, reveiw) => async (dispatch) => {
    const res = await fetch(`/api/recipes/${recipeId}/reviews`, {
        method: "POST",
        headers: {"Content-Type": "application/json"}
    })
}

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
