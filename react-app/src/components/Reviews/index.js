import { useSelector } from "react-redux";
import ReviewModal from "./PostReviewModal";
import OpenModalButton from "../OpenModalButton"
import "./Reviews.css"

function RecipeReviews() {
    const reviews = useSelector(state => Object.values(state.reviews.recipeReviews))

    const averageRating = reviews.reduce((accumulator, currentReview) => {
        return accumulator + Number(currentReview.rating)
    }, 0) / reviews.length


    return (
        <div className="reviews_div">
            <div className="review_heading_div">
                <div className="review_heading_left_div">
                    <div className="review_title">Reviews</div>
                    <div className="review_average_rating">{averageRating > 0 ? averageRating.toFixed(1) : "new"}</div>
                </div>
                <div className="review_heading_right_div">
                    <OpenModalButton
                        buttonText="Leave a Review"
                        modalComponent={<ReviewModal />}
                    />
                </div>
            </div>
            {reviews.map(review => {
                return (
                    <div key={review.id} className="review">
                        <div className="review_upper_div">
                            <div className="review_author_rating_div">
                                <div className="review_author">{review.author.username}</div>
                                <div className="review_rating">
                                    {Array(review.rating).fill(undefined).map((filledStar, idx) => {
                                        return <i key={idx} className="fa-solid fa-star filled_star" />
                                    })}
                                    {Array(5 - Number(review.rating)).fill(undefined).map((unfilledStar, idx) => {
                                        return <i key={idx} className="fa-light fa-star unfilled_star" />
                                    })}
                                </div>
                                {/* iterate for rating and display filled in stars */}
                                {/* iterate over 5 - rating and display empty stars  */}
                            </div>
                            <div className="review_timestamp_div">
                                <div className="review_timestamp">Posted on: {review.created_at}</div>
                                <div className="review_timestamp">Last updated: {review.updated_at}</div>
                            </div>
                        </div>
                        <div className="review_lower_div">{review.review}</div>
                    </div>
                )
            })}
        </div>
    )
}

export default RecipeReviews;
