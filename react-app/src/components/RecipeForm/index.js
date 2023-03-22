import { useState } from "react"
import { useDispatch } from "react-redux"
import { Redirect } from "react-router-dom"
import { postARecipeThunk } from "../../store/recipes"
import "./RecipeForm.css"

function RecipeForm() {
    const dispatch = useDispatch();
    const [errors, setErrors] = useState([]);
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [estimatedTime, setEstimatedTime] = useState(0)
    const [previewImageURL, setPreviewImageURL] = useState("")
    const [ingredientsList, setIngredientsList] = useState([{ingredient:"", amount:"", units:""}])
    const [methodsList, setMethodsList] = useState([{details:"", imageURL:""}])
    const units = ["","tsp", "tbsp", "cup"]

    const handleIngredientInputChange = (e, idx) => {
        const { name, value } = e.target
        const updatedIngredientsList = [...ingredientsList]
        updatedIngredientsList[idx][name] = value
        setIngredientsList(updatedIngredientsList)
        console.log(ingredientsList)
    }

    const handleAddIngredient = () => {
        setIngredientsList([...ingredientsList, {ingredient:"", amount:"", units:""}])
    }

    const handleRemoveIngredient = (idx) => {
        if (ingredientsList.length > 1) {
            const updatedIngredientsList = [...ingredientsList]
            updatedIngredientsList.splice(idx, 1)
            setIngredientsList(updatedIngredientsList)
        } else {
            // add error to set errors ("Must be at least one ingredient in your recipe")
        }
    }

    const handleMethodInputChange = (e, idx) => {
        const { name, value } = e.target
        const updatedMethodsList = [...methodsList]
        updatedMethodsList[idx][name] = value
        setMethodsList(updatedMethodsList)
    }

    const handleAddMethod = () => {
        setMethodsList([...methodsList, {description:"", imageURL:""}])
    }

    const handleRemoveMethod = (idx) => {
        if (methodsList.length > 1) {
            const updatedMethodsList = [...methodsList]
            updatedMethodsList.splice(idx, 1)
            setMethodsList(updatedMethodsList)
        } else {
            // add error handling here to prevent user from removing all methods
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newRecipe = {
            title,
            description,
            "preview_image_url": previewImageURL,
            "total_time": estimatedTime,
            "ingredients": ingredientsList,
            "methods": methodsList
        }
        // validate
        // if pass validations dispatch thunk
        const data = await dispatch(postARecipeThunk(newRecipe))
        if (data) {
            setErrors(data)
        } else {
            // redirect to details page for recipes
            return <Redirect to={`/recipes/`} />
        }

    }

    return (
        <form onSubmit={handleSubmit} className="recipe_form">
            <div className="recipe_form_title">Submit a Recipe</div>
            <div className="recipe_form_title_input">
                <label>Recipe Title<span className="required_input">*</span></label>
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
            </div>
            <div className="recipe_form_description_input">
                <label>Recipe Description<span className="required_input">*</span></label>
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
                <div className="recipe_form_description_num_chars_remaining">Render number of remaining characters for description</div>
            </div>
            <div className="recipe_form_preview_image">
                <label>Recipe Preview Image<span className="required_input">*</span></label>
                <input
                    type="text"
                    value={previewImageURL}
                    onChange={e => setPreviewImageURL(e.target.value)}
                />
            </div>
            <div className="recipe_form_time_to_make">
                <label>Estimated Time to Make (min)<span className="required_input">*</span></label>
                <input
                    type="number"
                    value={estimatedTime}
                    onChange={e => setEstimatedTime(e.target.value)}
                />
            </div>
            <div className="recipe_form_ingredients_div">
                <label className="ingredients_input_label">Ingredients<span className="required_input">*</span></label>
                {ingredientsList.map((ingredient, idx) => {
                    return (
                        <div key={idx} className="ingredients_inputs">
                            <input
                                className="ingredient_input"
                                name="ingredient"
                                type="text"
                                placeholder="Enter Name of Ingredient"
                                value={ingredient.ingredient}
                                onChange={e => handleIngredientInputChange(e, idx)}
                            />
                            <input
                                className="ingredient_input"
                                name="amount"
                                type="number"
                                step="0.001"
                                placeholder="Enter Amount"
                                value={ingredient.amount}
                                onChange={e => handleIngredientInputChange(e, idx)}
                            />
                            <select
                                className="ingredient_input"
                                name="units"
                                type="number"
                                value={ingredient.units}
                                onChange={e => handleIngredientInputChange(e, idx)}
                            >
                                {units.map((unit, idx) => {
                                    return <option key={idx} value={unit}>{unit}</option>
                                })}
                            </select>
                            <button
                                type="button"
                                className="remove_ingredient_button"
                                onClick={() => handleRemoveIngredient(idx)}
                            >
                                <i className="fa-solid fa-trash" />
                            </button>
                        </div>
                    )
                })}
                <button
                    type="button"
                    className="add_ingredient_button"
                    onClick={handleAddIngredient}>
                        Add Ingredient
                </button>
            </div>
            <div className="recipe_form_methods_div">
                <label className="methods_input_lable">Steps</label>
                {methodsList.map((method, idx) => {
                    return (
                        <div key={idx} className="method_div">
                            <label>Description<span className="required_input">*</span></label>
                            <textarea
                                name="details"
                                value={method.details}
                                onChange={e => handleMethodInputChange(e, idx)}
                            />
                            <label>Optional Image</label>
                            <input
                                type="text"
                                name="imageURL"
                                value={method.imageURL}
                                onChange={e => handleMethodInputChange(e, idx)}
                            />
                            <button
                                type="button"
                                className="remove_method_button"
                                onClick={() => handleRemoveMethod(idx)}>
                                    <i className="fa-solid fa-trash" />
                            </button>
                        </div>
                    )
                })}
                <button
                    type="button"
                    className="add_method_button"
                    onClick={handleAddMethod}
                >
                    Add Method
                </button>
            </div>
            <button type="submit">Submit</button>
        </form>
    )
}

export default RecipeForm;
