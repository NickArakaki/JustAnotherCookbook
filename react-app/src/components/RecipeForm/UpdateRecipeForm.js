import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useParams } from "react-router-dom";
import { getSingleRecipeThunk } from "../../store/recipes";
import RecipeForm from "./RecipeForm";

function UpdateRecipeForm() {
    const dispatch = useDispatch();
    const { recipeId } = useParams();
    const [isLoaded, setIsLoaded] = useState(false)
    const sessionUser = useSelector(state => state.session.user)
    const recipe = useSelector(state => state.recipes.singleRecipe)

    useEffect(() => {
        dispatch(getSingleRecipeThunk(recipeId))
            .then(() => setIsLoaded(true))
    }, [dispatch])

    if (isLoaded && sessionUser?.id !== recipe.author.id) return <Redirect to="/" />

    return (
        // instead of making a whole new form, pass the recipe down as a prop to the recipe form
        <>
            {isLoaded ? (<RecipeForm recipe={recipe} />) : <h1>Loading...</h1>}
        </>
    )
}

export default UpdateRecipeForm;
