import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getTagRecipesThunk } from "../../store/recipes";
import RecipeTiles from "../RecipeTiles";

function TagRecipePage() {
    const dispatch = useDispatch();
    const { tagId } = useParams();
    const [isLoaded, setIsLoaded] = useState(false);
    // probably want to get the tag at some point
    // should probably load all of the tags

    useEffect(() => {
        // dispatch thunk to get recipes
        dispatch(getTagRecipesThunk(tagId))
            .then(data => {
                if (data) {

                } else {
                    setIsLoaded(true)
                }
            })
    })

    return (
        <>
            {isLoaded ? (
                <>
                    <div className="tag_recipe_header">Recipes for {}</div>
                    <RecipeTiles />
                </>
            ): (
                <h1>Loading...</h1>
            )}
        </>
    )
}

export default TagRecipePage;
