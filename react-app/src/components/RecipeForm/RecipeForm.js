import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Redirect, useHistory } from "react-router-dom"
import { postARecipeThunk, updateRecipeThunk } from "../../store/recipes"
import { measurementUnits } from "../../utils/recipeUtils"
import {
        validateRecipeTitle,
        validateRecipeDescription,
        validateEstimatedTime,
        validateRecipeImageURL,
        validateIngredients,
        validateMethods,
        validateTags
} from "../../utils/recipeUtils"
import "./RecipeForm.css"

function RecipeForm({ recipe }) {
    const history = useHistory();
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user)

    /*************************************  controlled inputs      ******************************************************/
    const [errors, setErrors] = useState([]);
    const [title, setTitle] = useState(recipe ? recipe.title : "")
    const [titleErrors, setTitleErrors] = useState([])
    const [description, setDescription] = useState(recipe ? recipe.description : "")
    const [descriptionErrors, setDescriptionErrors] = useState([])
    const [estimatedTime, setEstimatedTime] = useState(recipe ? recipe.total_time : null)
    const [estimatedTimeErrors, setEstimatedTimeErrors] = useState([])
    const [previewImageURL, setPreviewImageURL] = useState(recipe ? recipe.preview_image_url : "")
    const [previewImageURLErrors, setPreviewImageURLErrors] = useState([])
    const [ingredientsList, setIngredientsList] = useState(recipe ? recipe.ingredients : [{ingredient:"", amount:"", units:""}])
    const [ingredientListErrors, setIngredientsListErrors] = useState(recipe ? new Array(recipe.ingredients.length).fill([]) : [[]])
    const [methodsList, setMethodsList] = useState(recipe ? recipe.methods : [{details:"", image_url:""}])
    const [methodsListErrors, setMethodsListErrors] = useState(recipe ? new Array(recipe.methods.length).fill([]) : [[]])
    const [tags, setTags] = useState(recipe ? recipe.tags.map(tag => tag.tag) : [])
    const [tagsErrors, setTagsErrors] = useState([])
    const [tagInput, setTagInput] = useState("")


    /********************************************** Ingredient Helpers *****************************************************/
    const handleIngredientInputChange = (e, idx) => {
        const { name, value } = e.target
        const updatedIngredientsList = [...ingredientsList]
        updatedIngredientsList[idx][name] = value
        setIngredientsList(updatedIngredientsList)
    }

    const handleAddIngredient = () => {
        setIngredientsList([...ingredientsList, {ingredient:"", amount:"", units:""}])
        setIngredientsListErrors([...ingredientListErrors, []])
    }

    const handleRemoveIngredient = (idx) => {
        if (ingredientsList.length > 1) {
            const updatedIngredientsList = [...ingredientsList]
            updatedIngredientsList.splice(idx, 1)
            setIngredientsList(updatedIngredientsList)

            const updatedIngredientListErrors = [...ingredientListErrors]
            updatedIngredientListErrors.splice(idx, 1)
            setIngredientsListErrors(updatedIngredientListErrors)
        }
    }

    /********************************************** Method Helpers *****************************************************/
    const handleMethodInputChange = (e, idx) => {
        const { name, value } = e.target
        const updatedMethodsList = [...methodsList]
        updatedMethodsList[idx][name] = value
        setMethodsList(updatedMethodsList)
    }

    const handleAddMethod = () => {
        setMethodsList([...methodsList, {details:"", image_url:""}])
        setMethodsListErrors([...methodsListErrors, []])
    }

    const handleRemoveMethod = (idx) => {
        if (methodsList.length > 1) {
            const updatedMethodsList = [...methodsList]
            updatedMethodsList.splice(idx, 1)
            setMethodsList(updatedMethodsList)

            const updatedMethodListErrors = [...methodsListErrors]
            updatedMethodListErrors.splice(idx, 1)
            setMethodsListErrors(updatedMethodListErrors)
        }
    }

    /********************************************** Tag Helpers *****************************************************/
    const handleAddTag = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();

            const inputTags = e.target.value.split(",")
            const newTags = [...tags]

            inputTags.forEach(tag => {
                // Only add new tags, no repeats
                const formattedTag = tag.trim().toLowerCase();
                if (formattedTag && formattedTag.length <= 60 && !newTags.includes(formattedTag)) {
                    newTags.push(formattedTag);
                }
            })

            setTags(newTags)
            setTagInput("")
        }
    }

    const handleRemoveTag = (idx) => {
        const newTags = [ ...tags ]
        newTags.splice(idx, 1)
        setTags(newTags)
    }

    /********************************************** Submit *****************************************************/
    const handleSubmit = async (e) => {
        e.preventDefault();

        // validate the form
        // need to do it this way because of asynchronicity of useState
        const validatedTitleErrors = validateRecipeTitle(title)
        setTitleErrors(validatedTitleErrors)

        const validatedDescriptionErrors = validateRecipeDescription(description)
        setDescriptionErrors(validatedDescriptionErrors)

        const validatedEstimatedTimeErrors = validateEstimatedTime(estimatedTime)
        setEstimatedTimeErrors(validatedEstimatedTimeErrors)

        const validatedPreviewImageURLErrors = validateRecipeImageURL(previewImageURL)
        setPreviewImageURLErrors(validatedPreviewImageURLErrors)

        const validatedIngredientsErrors = validateIngredients(ingredientsList)
        setIngredientsListErrors(validatedIngredientsErrors)

        const validatedMethodsErrors = validateMethods(methodsList)
        setMethodsListErrors(validatedMethodsErrors)

        const validatedTagsErrors = validateTags(tags)
        setTagsErrors(validatedTagsErrors)


        // if there are no errors after validating, dispatch appropriate thunk
        if (!validatedTitleErrors.length && !validatedDescriptionErrors.length && !validatedEstimatedTimeErrors.length && !validatedPreviewImageURLErrors.length && !validatedIngredientsErrors.flat().length && !validatedMethodsErrors.flat().length && !validatedTagsErrors.length) {

            const newRecipe = {
                title,
                description,
                "preview_image_url": previewImageURL,
                "total_time": estimatedTime,
                "ingredients": JSON.stringify(ingredientsList),
                "methods": JSON.stringify(methodsList),
                "tags": JSON.stringify(tags)
            }

            if (!recipe) { // POST Recipe
                const data = await dispatch(postARecipeThunk(newRecipe))
                if (data) {
                    setErrors(data)
                } else {
                    history.push("/")
                }
            } else { // PUT Recipe
                const data = await dispatch(updateRecipeThunk(recipe.id, newRecipe))
                if (data) {
                    setErrors(data)
                } else {
                    history.push(`/recipes/${recipe.id}`)
                }
            }
        }
    }

    if (!sessionUser) return <Redirect to='/' />

    return (
        <div className="recipe_form_background_image">
            <form onSubmit={handleSubmit} className="recipe_form">
                <div className="recipe_form_title">{!recipe ? "Submit a Recipe" : "Update your Recipe"}</div>
                {errors.map((error, idx) => {
                    return (
                        <div className="form_error" key={idx}>{error}</div>
                    )
                    })}
                <div className="recipe_form_input_div">
                    <label className="recipe_form_label">Recipe Title<span className="required_input">*</span></label>
                    {titleErrors.map((error, idx) => {
                        return (
                            <div className="form_error" key={idx}>{error}</div>
                        )
                    })}
                    <input
                        required
                        className="recipe_form_input recipe_form_title_input"
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                </div>
                <div className="recipe_form_input_div">
                    <label className="recipe_form_label">Recipe Description<span className="required_input">*</span></label>
                    {descriptionErrors.map((error, idx) => {
                        return (
                            <div className="form_error" key={idx}>{error}</div>
                        )
                    })}
                    <textarea
                        required
                        className="recipe_form_input recipe_form_description_input"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        maxLength="200"
                    />
                    <div className="recipe_form_description_num_chars_remaining">{200 - description.length} characters remaining</div>
                </div>
                <div className="recipe_form_input_div">
                    <label className="recipe_form_label">Recipe Preview Image<span className="required_input">*</span></label>
                    {previewImageURLErrors.map((error, idx) => {
                        return (
                            <div className="form_error" key={idx}>{error}</div>
                        )
                    })}
                    <input
                        required
                        className="recipe_form_input recipe_form_preview_image_input"
                        type="url"
                        value={previewImageURL}
                        onChange={e => setPreviewImageURL(e.target.value)}
                    />
                </div>
                <div className="recipe_form_input_div recipe_form_time_to_make">
                    {estimatedTimeErrors.map((error, idx) => {
                        return (
                            <div className="form_error" key={idx}>{error}</div>
                        )
                    })}
                    <label className="recipe_form_label">Estimated Time to Make (min)<span className="required_input">*</span></label>
                    <input
                        required
                        className="recipe_form_input recipe_form_time_input"
                        type="number"
                        min="1"
                        value={estimatedTime}
                        onChange={e => setEstimatedTime(Math.round(e.target.value))}
                    />
                </div>
                <div className="recipe_form_input_div">
                    <label className="recipe_form_label">Ingredients<span className="required_input">*</span></label>
                    {ingredientsList.map((ingredient, idx) => {
                        return (
                            <div key={idx}>
                                {ingredientListErrors[idx].map((error, errorIdx) => {
                                    return (
                                        <div className="form_error" key={errorIdx}>{error}</div>
                                    )
                                })}
                                <div className="ingredients_inputs">
                                    <input
                                        required
                                        className="recipe_form_input ingredient_input"
                                        name="ingredient"
                                        type="text"
                                        placeholder="Enter Name of Ingredient"
                                        value={ingredient.ingredient}
                                        onChange={e => handleIngredientInputChange(e, idx)}
                                    />
                                    <input
                                        required
                                        className="recipe_form_input ingredient_input"
                                        name="amount"
                                        type="number"
                                        step="0.001"
                                        min="0.001"
                                        placeholder="Enter Amount"
                                        value={ingredient.amount}
                                        onChange={e => handleIngredientInputChange(e, idx)}
                                    />
                                    <select
                                        className="recipe_form_input ingredient_input"
                                        name="units"
                                        value={ingredient.units}
                                        onChange={e => handleIngredientInputChange(e, idx)}
                                    >
                                        {measurementUnits.map((unit, idx) => {
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
                <div className="recipe_form_input_div">
                    <label className="recipe_form_label">Steps</label>
                    {methodsList.map((method, idx) => {
                        return (
                            <div key={idx}>
                                {methodsListErrors[idx].map((error, errorIdx) => {
                                    return (
                                        <div className="form_error" key={errorIdx}>{error}</div>
                                    )
                                })}
                                <div className="method_div">
                                    <div className="recipe_form_input_div">
                                        <label>Description<span className="required_input">*</span></label>
                                        <div className="recipe_form_input_recommendations">(10 character minimum)</div>
                                        <textarea
                                            required
                                            className="recipe_form_input recipe_form_description_input"
                                            name="details"
                                            value={method.details}
                                            onChange={e => handleMethodInputChange(e, idx)}
                                            maxLength="1000"
                                        />
                                        <div className="recipe_form_description_num_chars_remaining">{1000 - methodsList[idx].details.length} characters remaining</div>
                                    </div>
                                    <div className="recipe_form_input_div">
                                        <label>Optional Image URL</label>
                                        <input
                                            className="recipe_form_input recipe_form_method_image_input"
                                            type="url"
                                            name="image_url"
                                            value={method.image_url}
                                            onChange={e => handleMethodInputChange(e, idx)}
                                            />
                                    </div>
                                    <button
                                        type="button"
                                        className="remove_method_button"
                                        onClick={() => handleRemoveMethod(idx)}>
                                            <i className="fa-solid fa-trash" />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                    <button
                        type="button"
                        className="add_method_button"
                        onClick={handleAddMethod}
                    >
                        Add Step
                    </button>
                </div>
                <div className="recipe_form_input_div">
                    <label className="recipe_form_label">Tags<span className="required_input">*</span></label>
                    <div className="recipe_form_input_recommendations">Press [Enter] after every tag, or separate with comma and hit enter (minimumn 5) </div>
                    {tagsErrors.map((error, idx) => {
                        return (
                            <div className="form_error" key={idx}>{error}</div>
                        )
                    })}
                    <input
                        className="recipe_form_input recipe_form_tag_input"
                        type="text"
                        placeholder="Press [Enter] after each tag"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => handleAddTag(e)}
                    />
                    <div className="recipe_form_display_tag_div">
                        {tags.map((tag, idx) => {
                            return (
                                <div className="tag" key={idx}>
                                    <span className="tag_name">{tag.toUpperCase()}</span><span onClick={() => handleRemoveTag(idx)} className="remove_tag_button">&#10006;</span>
                                </div>
                            )
                        })}
                    </div>
                    <p className="recipe_form_input_recommendations">
                        To give your recipe the best opportunity to be found please use at least 5 tags,
                        making sure to include the meal type, any relevant dietary tags, and primary ingredient types.
                        Other relevant tags could be seasons or holidays, event types, or cooking techniques.
                    </p>
                </div>
                <button className="recipe_form_submit_button" type="submit">{!recipe ? "Submit" : "Update"}</button>
                <div className="recipe_form_legend">
                    <span className="required_input">*</span> = Required Field
                </div>
            </form>
        </div>
    )
}

export default RecipeForm;
