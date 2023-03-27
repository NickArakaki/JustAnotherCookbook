import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect, useHistory, useParams } from "react-router-dom";
import { getSingleRecipeThunk } from "../../store/recipes";
import { formatDateMonthDateYear } from '../../utils/dateUtils';
import OpenModalButton from "../OpenModalButton";
import DeleteRecipeConfirmationModal from "../DeleteRecipeConfirmationModal";
import RecipeReviews from "../Reviews";
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
                        {recipe.author.id === sessionUser?.id ? (
                            <div className="recipe_details_edit_and_delete_button_div">
                                <Link to={`/recipes/${recipe.id}/edit`}>
                                    <i className="edit_recipe_icon fa-solid fa-pen-to-square" />
                                </Link>
                                <OpenModalButton
                                    buttonText={<i className="delete_recipe_icon fa-solid fa-trash" />}
                                    modalComponent={<DeleteRecipeConfirmationModal recipe={recipe} />}
                                />
                            </div>
                        ) : (
                            null
                        )
                        }
                    </div>
                    <div className="single_recipe_image_div">
                        <img className="recipe_detail_image" src={recipe.preview_image_url} alt={`${recipe.title}`} />
                    </div>
                    <div className="recipe_details_div">
                        <div className="recipe_details_title_author_div">
                            <div className="recipe_details_title">{recipe.title}</div>
                            <div className="recipe_details_author">Posted by: {recipe.author.username} on {formatDateMonthDateYear(new Date(recipe.created_at))}</div>
                        </div>
                        <div className="recipe_details_reviews_summary_div">
                            <div className="recipe_avg_rating">{averageRating > 0 ? averageRating.toFixed(1): "new"} <i className="fa-sharp fa-solid fa-star" /></div>
                            <div className="recipe_num_reviews">{recipe.reviews.length} {recipe.reviews.length === 1 ? "Review" : "Reviews"}</div>
                        </div>
                    </div>
                    <div className="single_recipe_description">{recipe.description}</div>
                    <div className="recipe_ingredients_div">
                        <div className="recipe_ingredients_title">Ingredients</div>
                        <ul>
                            {isLoaded && recipe.ingredients.map((ingredient, idx) => {
                                return (
                                    <li key={idx} className="recipe_ingredient">{ingredient.amount} {ingredient.units} {ingredient.ingredient} </li>
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
                                        <div className="recipe_method_image"></div>
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
                <h2>Loading...</h2>
            )}
        </>
    )
}

export default RecipeDetails;
