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
    }, [dispatch, tagId])

    return (
        <>
            {isLoaded ? (
                <div className="tag_recipe_container">
                    <div className="tag_recipe_header">Recipes for {tag.tag.split(" ").map(word => word[0].toUpperCase() + word.slice(1)).join(" ")}</div>
                    <RecipeTiles />
                </div>
            ): (
                <h1>Loading...</h1>
            )}
        </>
    )
}

export default TagRecipePage;
