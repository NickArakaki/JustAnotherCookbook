import { useSelector } from "react-redux";
import ReviewModal from "./PostReviewModal";
import DeleteReviewConfirmationModal from "./DeleteReviewConfirmationModal";
import OpenModalButton from "../../OpenModalButton";
import { formatDateMonthDateYear } from "../../../utils/dateUtils";
import "../RecipeDetails.css"

function RecipeReviews() {
    const sessionUser = useSelector(state => state.session.user)
    const recipe = useSelector(state => state.recipes.singleRecipe)
    const reviews = useSelector(state => Object.values(state.reviews.recipeReviews))
    reviews.sort((a,b) => {
        return (new Date(b.updated_at)).valueOf() - (new Date(a.updated_at)).valueOf()
    })

    const averageRating = reviews.reduce((accumulator, currentReview) => {
        return accumulator + Number(currentReview.rating)
    }, 0) / reviews.length

    let isUserReview = false;

    for (const review of reviews) {
        if (sessionUser?.id === review.author.id) isUserReview = true;
    }

    // Render add review button when the logged in user is not the author and does not currently have a review for the recipe already
    const renderReviewButton = sessionUser && sessionUser.id !== recipe.author.id && !isUserReview

    return (
        <div className="reviews_div">
            <div className="review_heading_div">
                <div className="review_heading_left_div">
                    <div className="review_title">Reviews</div>
                </div>
                <div className="review_heading_right_div">
                    <div className="review_average_rating">{averageRating > 0 ? averageRating.toFixed(1) : "new"} <i className="star_rating fa-sharp fa-solid fa-star" /></div>
                    <div className="review_number_reviews">({reviews.length} {reviews.length === 1 ? "Review" : "Reviews"})</div>
                </div>
            </div>
            {renderReviewButton &&
                        <OpenModalButton
                            buttonText="Leave a Review"
                            modalComponent={<ReviewModal recipeId={recipe.id}/>}
                        />
            }
            {reviews.map(review => {
                return (
                    <div key={review.id} className="review_wrapper">
                        <div className="review_section review_top_div">
                            <div className="review_user_and_rating_div">
                                <div className="review_username">{review.author.username}</div>
                                <div className="review_rating">
                                    {Array(review.rating).fill(undefined).map((filledStar, idx) => {
                                        return <i key={idx} className="star_rating fa-solid fa-star filled_star" />
                                    })}
                                    {Array(5 - Number(review.rating)).fill(undefined).map((unfilledStar, idx) => {
                                        return <i key={idx} className="star_rating fa-regular fa-star" />
                                    })}
                                </div>
                            </div>
                            <div className="review_modal_buttons_div">
                                {sessionUser?.id === review.author.id && (
                                    <>
                                        <OpenModalButton
                                            buttonText={<i className="fa-solid fa-pen-to-square" />}
                                            modalComponent={<ReviewModal reviewToUpdate={review} />}
                                        />
                                        <OpenModalButton
                                            buttonText={<i className="fa-solid fa-trash" />}
                                            modalComponent={<DeleteReviewConfirmationModal review={review} />}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="review_section review_timestamp">
                            {review.created_at === review.updated_at ? (
                                    <div className="review_timestamp">Posted on: {formatDateMonthDateYear(new Date(review.created_at))}</div>
                                ) : (
                                    <div className="review_timestamp">Last updated: {formatDateMonthDateYear(new Date(review.updated_at))}</div>
                            )}
                        </div>
                        <div className="review_section">{review.review}</div>
                    </div>
                )
            })}
        </div>
    )
}

export default RecipeReviews;
