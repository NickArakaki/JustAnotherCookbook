import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getTagRecipesThunk } from "../../store/recipes";
import { getAllTagsThunk } from "../../store/tags";
import RecipeTiles from "../RecipeTiles";

function TagRecipePage() {
    const dispatch = useDispatch();
    const { tagId } = useParams();
    const tag = useSelector(state => state.tags[tagId])
    const [isLoaded, setIsLoaded] = useState(false);
    console.log(tagId)

    useEffect(() => {
        // hydrate all tags
        dispatch(getAllTagsThunk())
            // dispatch thunk to get recipes
            .then(() => dispatch(getTagRecipesThunk(tagId)))
            .then(data => {
                if (data) {
                    // display errors ?
                } else {
                    setIsLoaded(true)
                }
            })
    }, [dispatch, tagId])

    return (
        <>
            {isLoaded ? (
                <>
                    <div className="tag_recipe_header">Recipes for {tag.tag}</div>
                    <RecipeTiles />
                </>
            ): (
                <h1>Loading...</h1>
            )}
        </>
    )
}

export default TagRecipePage;
