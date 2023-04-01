import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllRecipesThunk } from "../../store/recipes";
import { getAllUsersThunk } from '../../store/users'
import LoadingComponent from "../Loading";
import RecipeTiles from "../RecipeTiles";
import Footer from "../Footer"

function LandingPage() {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const recipes = useSelector(state => state.recipes.allRecipes)

    useEffect(() => {
        dispatch(getAllRecipesThunk())
            .then(() => dispatch(getAllUsersThunk()))
            .then(() => setIsLoaded(true))
    }, [dispatch])

    return (
        <>
            {isLoaded ? <RecipeTiles recipes={recipes} /> : <LoadingComponent />}
            { isLoaded && <Footer />}
        </>
    )
}

export default LandingPage;
