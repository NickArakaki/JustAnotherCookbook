import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect, useHistory, useParams } from "react-router-dom";
import { getSingleRecipeThunk } from "../../store/recipes";
import { formatDateMonthDateYear } from '../../utils/dateUtils';
import OpenModalButton from "../OpenModalButton";
import DeleteRecipeConfirmationModal from "../DeleteRecipeConfirmationModal";
import RecipeReviews from "./Reviews"
import FavoriteButton from "../FavoriteButton"
import LoadingComponent from "../Loading";
import "./RecipeDetails.css"

function RecipeDetails() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { recipeId } = useParams();
    const [isLoaded, setIsLoaded] = useState(false)
    const recipe = useSelector(state => state.recipes.singleRecipe)
    const reviews = useSelector(state => Object.values(state.reviews.recipeReviews))
    const sessionUser = useSelector(state => state.session.user)

    useEffect(() => {
        dispatch(getSingleRecipeThunk(recipeId))
        .then((data) => {
            if (data) {
                history.push('/')
            } else {
                setIsLoaded(true)
            }
        })
    }, [dispatch, recipeId, history])


    if (isLoaded && !Object.values(recipe).length) return <Redirect to="/" />

    // calculate average rating
    const averageRating = isLoaded ? reviews.reduce((accumulator, currentReview) => {
        return accumulator + Number(currentReview.rating)
    }, 0) / reviews.length : null


    return (
        <>
            {isLoaded ? (
                <div className="recipe_container">
                    <div className="recipe_title_and_buttons_div">
                        <div className="single_recipe_title">{recipe.title}</div>
                        <div className="recipe_details_buttons">
                            <FavoriteButton recipe={recipe} />
                            {recipe.author.id === sessionUser?.id ? (
                                <>
                                    <Link to={`/recipes/${recipe.id}/edit`}>
                                        <i className="edit_recipe_icon fa-solid fa-pen-to-square" />
                                    </Link>
                                    <OpenModalButton
                                        buttonText={<i className="delete_recipe_icon fa-solid fa-trash" />}
                                        modalComponent={<DeleteRecipeConfirmationModal recipe={recipe} />}
                                        />
                                </>
                        ) : (
                            null
                            )
                        }
                        </div>
                    </div>
                    <div className="single_recipe_tags">
                            {recipe.tags.map(tag => {
                                return <Link to={`/tags/${tag.id}`} key={tag.id} className="single_recipe_tag">{tag.tag.toUpperCase()}</Link>
                            })}
                        </div>
                    <div className="single_recipe_image_div">
                        <img
                            className="recipe_detail_image"
                            src={recipe.preview_image_url}
                            alt={`${recipe.title}`}
                            onError={(e) => { e.target.src="https://mirasvit.com/media/blog/404_Not_Found_2-179.png" }}
                        />
                    </div>
                    <div className="recipe_details_div">
                        <div className="recipe_details_title_author_div">
                            <div className="recipe_details_title">{recipe.title}</div>
                            <div className="recipe_details_author">
                                Posted by: <Link to={`/users/${recipe.author.id}`}>{recipe.author.username}</Link> on {formatDateMonthDateYear(new Date(recipe.created_at))}
                            </div>
                            <div className="recipe_details_estimated_time">Total Time: <span className="recipe_details_time">{recipe.total_time}</span> min</div>
                        </div>
                        <div className="recipe_details_reviews_summary_div">
                            <div className="recipe_avg_rating">{averageRating > 0 ? averageRating.toFixed(1): "new"} <i className="star_rating fa-sharp fa-solid fa-star" /></div>
                            <div className="recipe_num_reviews">{reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}</div>
                        </div>
                    </div>
                    <div className="single_recipe_description">{recipe.description}</div>
                    <div className="recipe_ingredients_div">
                        <div className="recipe_ingredients_title">Ingredients</div>
                        <ul>
                            {isLoaded && recipe.ingredients.map((ingredient, idx) => {
                                return (
                                    <li key={idx} className="recipe_ingredient">
                                        <input className="ingredient_checkbox" type="checkbox" />
                                        {ingredient.amount} {ingredient.units} {ingredient.ingredient}
                                    </li>
                                    )
                                })}
                        </ul>
                    </div>
                    <div className="recipe_instructions_div">
                        <div className="recipe_instruction_title">Instructions</div>
                        {isLoaded && recipe.methods.map((method, idx) => {
                            return (
                                <div key={idx} className="recipe_method_div">
                                    <div className="recipe_method_step_number">Step {method.step_number}</div>
                                    <div className="recipe_method_image_and_details_div">
                                        {!!method.image_url &&
                                                <img
                                                    className="recipe_method_image"
                                                    src={method.image_url}
                                                    alt={`${recipe.title} ${method.step_number}`}
                                                    onError={(e) => { e.target.src="https://mirasvit.com/media/blog/404_Not_Found_2-179.png" }}
                                                />
                                        }
                                        <div className="recipe_method_details">{method.details}</div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="recipe_reviews_div">
                        {isLoaded && <RecipeReviews />}
                    </div>
                </div>
            ) : (
                <LoadingComponent />
            )}
        </>
    )
}

export default RecipeDetails;
