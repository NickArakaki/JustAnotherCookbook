import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSingleRecipeThunk } from "../../store/recipes";
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

    return (
        <div className="recipe_details_div">
            {isLoaded ? (
                <>
                    <div className="recipe_title">{recipe.title}</div>
                    <div className="recipe_preview_image"></div>
                    <div className="recipe_details">
                        <div className="recipe_details_title_author_div">
                            <div className="recipe_details_title">{recipe.title}</div>
                            <div className="recipe_details_author">Posted by: {recipe.author.username} on {recipe.created_at}</div>
                        </div>
                        <div className="recipe_details_reviews_summary_div">
                            <div className="recipe_avg_rating">4.8 Stars</div>
                            <div className="recipe_num_reviews">{recipe.reviews.length} Reviews</div>
                        </div>
                    </div>
                </>
            ) : (
                <h2>Loading...</h2>
            )}
        </div>
    )
}

export default RecipeDetails;
