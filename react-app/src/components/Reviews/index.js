import { useSelector } from "react-redux";
import "./Reviews.css"

function Reviews() {
    const reviews = useSelector(state => state.recipes.singleRecipe.reviews)
    console.log(reviews)

    const averageRating = reviews.reduce((accumulator, currentReview) => {
        return accumulator + Number(currentReview.rating)
    }, 0) / reviews.length


    return (
        <div className="reviews_div">
            <div className="review_heading_div">
                <div className="review_heading_left_div">
                    <div className="review_title">Reviews</div>
                    <div className="review_average_rating">{averageRating.toFixed(1)}</div>
                </div>
                <div className="review_heading_right_div">
                    <button className="add_review_button">Leave a Review</button>
                </div>
            </div>
            {reviews.map(review => {
                return (
                    <div key={review.id} className="review">
                        <div className="review_upper_div">
                            <div className="review_author_rating_div">
                                <div className="review_author">{review.author.username}</div>
                                <div className="review_rating">{review.rating} stars</div>
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

export default Reviews;
