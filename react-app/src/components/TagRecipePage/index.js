import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getTagRecipesThunk } from "../../store/recipes";
import { getAllTagsThunk } from "../../store/tags";
import RecipeTiles from "../RecipeTiles";
import "./TagRecipePage.css"

function TagRecipePage() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { tagId } = useParams();
    const tag = useSelector(state => state.tags[tagId])
    const recipes = useSelector(state => state.recipes.allRecipes)
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // hydrate all tags
        dispatch(getAllTagsThunk())
            // dispatch thunk to get recipes
            .then(() => dispatch(getTagRecipesThunk(tagId)))
            .then(data => {
                if (data) {
                    // display errors ?
                    history.push("/")
                } else {
                    setIsLoaded(true)
                }
            })
    }, [dispatch, tagId, history])


    return (
        <>
            {isLoaded ? (
                <>
                    <div className="recipe_page_tile">Recipes for {tag.tag.split(" ").map(word => word[0].toUpperCase() + word.slice(1)).join(" ")}</div>
                    <RecipeTiles recipes={recipes}/>
                </>
            ): (
                <h1>Loading...</h1>
            )}
        </>
    )
}

export default TagRecipePage;
