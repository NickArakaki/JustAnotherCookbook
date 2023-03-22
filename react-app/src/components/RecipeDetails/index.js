import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSingleRecipeThunk } from "../../store/recipes";
import { formatDateMonthDateYear } from '../../utils/dateUtils';
import "./RecipeDetails.css"

function RecipeDetails() {
    const dispatch = useDispatch();
    const recipe = useSelector(state => state.recipes.singleRecipe)
    console.log(recipe)
    const { recipeId } = useParams();
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        dispatch(getSingleRecipeThunk(recipeId))
        .then(() => setIsLoaded(true))
    }, [dispatch])

    // calculate average rating
    const averageRating = isLoaded ? recipe.reviews.reduce((accumulator, currentReview) => {
        return accumulator + Number(currentReview.rating)
    }, 0) / recipe.reviews.length : null

    return (
        <>
            {isLoaded ? (
                <div className="recipe_container">
                    <div className="single_recipe_title">{recipe.title}</div>
                    <div className="single_recipe_preview_image"></div>
                    <div className="recipe_details_div">
                        <div className="recipe_details_title_author_div">
                            <div className="recipe_details_title">{recipe.title}</div>
                            <div className="recipe_details_author">Posted by: {recipe.author.username} on {formatDateMonthDateYear(new Date(recipe.created_at))}</div>
                        </div>
                        <div className="recipe_details_reviews_summary_div">
                            <div className="recipe_avg_rating">{averageRating.toFixed(1)}</div>
                            <div className="recipe_num_reviews">{recipe.reviews.length} Reviews</div>
                        </div>
                    </div>
                    <div className="single_recipe_description">{recipe.description}</div>
                    <div className="recipe_ingredients_div">
                        <div className="recipe_ingredients_title">Ingredients</div>
                        { console.log(recipe.ingredients)}
                        {/* {recipe.ingredinets.map((ingredient, idx) => {
                            return (
                                <div key={idx} className="recipe_ingredient">{ingredient.ingredient} {ingredient.amount} {ingredient.units}</div>
                            )
                        })} */}
                    </div>
                </div>
            ) : (
                <h2>Loading...</h2>
            )}
        </>
    )
}

export default RecipeDetails;
