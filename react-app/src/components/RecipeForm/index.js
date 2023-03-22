import {useState} from "react"
import "./RecipeForm.css"

function RecipeForm() {
    const [title, setTitle] = useState("")
    const [ingredientsList, setIngredientsList] = useState([{ingredient:"", amount:"", units:""}])
    const [methodsList, setMethodsList] = useState([{description:"", imageURL:""}])
    const units = ["tsp", "tbsp", "cup"]

    const handleIngredientInputChange = (e, idx) => {
        const { name, value } = e.target
        const updatedIngredientsList = [...ingredientsList]
        updatedIngredientsList[idx][name] = value
        setIngredientsList(updatedIngredientsList)
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

    return (
        <form className="recipe_form">
            <div className="recipe_form_title">
                <label>Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
            </div>
            <div className="recipe_form_description">
                <label>Recipe Description</label>
                <textarea />
                <div className="recipe_form_description_num_chars_remaining">Render number of remaining characters for description</div>
            </div>
            <div className="recipe_form_preview_image">
                <label>Recipe Preview Image</label>
                <input type="text" />
            </div>
            <div className="recipe_form_time_to_make">
                <label>Estimated Time to Make (min)</label>
                <input type="number" />
            </div>
            <div className="recipe_form_ingredients_div">
                <label className="ingredients_input_label">Ingredients</label>
                {ingredientsList.map((ingredient, idx) => {
                    return (
                        <>
                            <input
                                name="ingredient"
                                type="text"
                                placeholder="Enter Name of Ingredient"
                                value={ingredient.ingredient}
                                onChange={e => handleIngredientInputChange(e, idx)}
                            />
                            <input
                                name="amount"
                                type="number"
                                placeholder="Enter Amount"
                                value={ingredient.amount}
                                onChange={e => handleIngredientInputChange(e, idx)}
                            />
                            <select
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
                                Remove Ingredient
                            </button>
                        </>
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
                            <div className="method_description_div">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={method.description}
                                    onChange={e => handleMethodInputChange(e, idx)}
                                />
                            </div>
                            <div className="method_image_div">
                                <label>Optional Image</label>
                                <input
                                    type="text"
                                    name="imageURL"
                                    value={method.imageURL}
                                    onChange={e => handleMethodInputChange(e, idx)}
                                />
                            </div>
                            <button
                                type="button"
                                className="remove_method_button"
                                onClick={() => handleRemoveMethod(idx)}>
                                    Remove Method
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
        </form>
    )
}

export default RecipeForm;
