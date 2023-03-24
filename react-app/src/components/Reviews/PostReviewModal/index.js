import { useState } from "react";
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../../context/Modal";
import { postRecipeReviewThunk } from "../../../store/reviews";

import "./ReviewModal.css";

function ReviewModal({ recipeId }) {
    const sessionUser = useSelector(state => state.session.user);
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const [formErrors, setFormErrors] = useState([]);
    const [starRating, setStarRating] = useState(0);
    const [review, setReview] = useState("");
    const [hover, setHover] = useState(0);
    const inputValues = [1,2,3,4,5]

    if (!sessionUser) return <Redirect to="/" />

    const onSubmit = (e) => {
        e.preventDefault();
        // validate inputs
        const errors = [];
        if (starRating <= 0 || starRating > 5) errors.push("Please provide 1 to 5 stars")
        if (review.length < 10) errors.push("Please provide a review at least 10 characters long")

        if (errors.length) {
            setFormErrors(errors)
        } else {
            const userReview = {
                review,
                stars: starRating
            }

            dispatch(postRecipeReviewThunk(recipeId, userReview))
                .then((data) => {
                    if (data) {
                        setFormErrors(data)
                    } else {
                        closeModal()
                    }
                })
        }
    }

    const buttonEnabled = (starRating > 0 && review.length > 10) ? true : false;

    return (
        <form className="add_review_modal" onSubmit={onSubmit}>

            <h2 className="add_review_modal_title">How was the food?</h2>
            {formErrors.map(error => {
                return (
                    <li key={error}>{error}</li>
                )
            })}
            <textarea
                className="add_review_modal_review_input"
                placeholder="Leave your review here"
                value={review}
                onChange={(e) => setReview(e.target.value)}
            />

            <div className="add_review_modal_star_rating_div">
                <div className="add_review_modal_star_rating_label">Stars</div>
                <div className="add_review_modal_star__div">
                    {inputValues.map((inputValue, index) => {
                        const starFilled = inputValue <= (hover || starRating) ? "filled" : "not-filled";

                        return (
                            <label key={index}>
                                <input
                                    className="add_review_modal_star_radio_input"
                                    type="radio"
                                    name="star_rating"
                                    value={inputValue}
                                    onClick={() => setStarRating(inputValue)}
                                    />
                                <i
                                    className={`fa-solid fa-star star_icon ${starFilled}`}
                                    onMouseEnter={() => setHover(inputValue)}
                                    onMouseLeave={() => setHover(0)}
                                />
                            </label>
                        )
                    })}
                </div>

            </div>

            <button type="submit" disabled={!buttonEnabled} className={`post_review_button ${buttonEnabled ? "enabled" : "disabled"}`}>Submit Your Review</button>

        </form>
    )
}

export default ReviewModal;
