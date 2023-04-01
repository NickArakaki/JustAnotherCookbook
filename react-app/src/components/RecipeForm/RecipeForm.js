import { useState } from "react"
import { useDispatch } from "react-redux"
import { useHistory } from "react-router-dom"
import { postARecipeThunk, updateRecipeThunk } from "../../store/recipes"
import { measurementUnits } from "../../utils/recipeUtils"
import {
        validateRecipeTitle,
        validateRecipeDescription,
        validateEstimatedTime,
        validateRecipeImage,
        validateUpdateRecipeImage,
        validateIngredients,
        validateMethods,
        validateTags
} from "../../utils/recipeUtils"
import LoadingComponent from "../Loading"
import "./RecipeForm.css"

function RecipeForm({ recipe }) {
    // react hooks
    const history = useHistory();
    const dispatch = useDispatch();

    /*************************************  controlled inputs      ******************************************************/

    // inputs
    const [isLoaded, setIsLoaded] = useState(true)
    const [title, setTitle] = useState(recipe ? recipe.title : "")
    const [description, setDescription] = useState(recipe ? recipe.description : "")
    const [estimatedTime, setEstimatedTime] = useState(recipe ? recipe.total_time : null)
    const [previewImageURL, setPreviewImageURL] = useState(recipe? recipe.preview_image_url : "")
    const [previewImage, setPreviewImage] = useState(null)
    const [ingredientsList, setIngredientsList] = useState(recipe ? recipe.ingredients : [{ingredient:"", amount:"", units:""}])
    const [methodsList, setMethodsList] = useState(recipe ? recipe.methods : [{id: "", details:"", image: ""}])
    const [methodPreviewImageURLs, setMethodPreviewImageURLs] = useState(recipe ? recipe.methods.map(method => method.image_url) : [""])
    const [tags, setTags] = useState(recipe ? recipe.tags.map(tag => tag.tag) : [])
    const [tagInput, setTagInput] = useState("")

    // errors
    const [errors, setErrors] = useState([]);
    const [titleErrors, setTitleErrors] = useState([])
    const [descriptionErrors, setDescriptionErrors] = useState([])
    const [estimatedTimeErrors, setEstimatedTimeErrors] = useState([])
    const [previewImageErrors, setPreviewImageErrors] = useState([])
    const [ingredientListErrors, setIngredientsListErrors] = useState(recipe ? new Array(recipe.ingredients.length).fill([]) : [[]])
    const [methodsListErrors, setMethodsListErrors] = useState(recipe ? new Array(recipe.methods.length).fill([]) : [[]])
    const [tagsErrors, setTagsErrors] = useState([])


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
        } else {
            setIngredientsList([{ingredient:"", amount:"", units:""}])
            setIngredientsListErrors([[]])
        }
    }

    /********************************************** Method Helpers *****************************************************/
    const handleMethodInputChange = (e, idx) => {
        const { name, value, files } = e.target
        const updatedMethodsList = [...methodsList]

        if (name === "image") {

            updatedMethodsList[idx][name] = files[0]
            const updatedMethodPreviews = [...methodPreviewImageURLs]
            updatedMethodPreviews[idx] = URL.createObjectURL(files[0])
            setMethodPreviewImageURLs(updatedMethodPreviews)

        } else {
            updatedMethodsList[idx][name] = value
        }

        setMethodsList(updatedMethodsList)
    }

    const handleAddMethod = () => {
        setMethodsList([...methodsList, {id: "", details:"", image: ""}])
        setMethodsListErrors([...methodsListErrors, []])
        setMethodPreviewImageURLs([...methodPreviewImageURLs, ""])
    }

    const handleRemoveMethod = (idx) => {
        if (methodsList.length > 1) {

            const updatedMethodsList = [...methodsList]
            updatedMethodsList.splice(idx, 1)
            setMethodsList(updatedMethodsList)

            const updatedMethodListErrors = [...methodsListErrors]
            updatedMethodListErrors.splice(idx, 1)
            setMethodsListErrors(updatedMethodListErrors)

            const updatedMethodPreviewImageURLs = [...methodPreviewImageURLs]
            updatedMethodPreviewImageURLs.splice(idx, 1)
            setMethodPreviewImageURLs(updatedMethodPreviewImageURLs)
        } else {
            setMethodsList([{id: "", details:"", image: ""}])
            setMethodsListErrors([[]])
            setMethodPreviewImageURLs([""])
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
        const validatePreviewImageErrors = recipe ? validateUpdateRecipeImage(previewImage) : validateRecipeImage(previewImage)
        setPreviewImageErrors(validatePreviewImageErrors)

        const validatedTitleErrors = validateRecipeTitle(title)
        setTitleErrors(validatedTitleErrors)

        const validatedDescriptionErrors = validateRecipeDescription(description)
        setDescriptionErrors(validatedDescriptionErrors)

        const validatedEstimatedTimeErrors = validateEstimatedTime(estimatedTime)
        setEstimatedTimeErrors(validatedEstimatedTimeErrors)

        const validatedIngredientsErrors = validateIngredients(ingredientsList)
        setIngredientsListErrors(validatedIngredientsErrors)

        const validatedMethodsErrors = validateMethods(methodsList)
        setMethodsListErrors(validatedMethodsErrors)

        const validatedTagsErrors = validateTags(tags)
        setTagsErrors(validatedTagsErrors)


        // if there are no errors after validating, dispatch appropriate thunk
        if (
            !validatePreviewImageErrors.length &&
            !validatedTitleErrors.length &&
            !validatedDescriptionErrors.length &&
            !validatedEstimatedTimeErrors.length &&
            !validatedIngredientsErrors.flat().length &&
            !validatedMethodsErrors.flat().length &&
            !validatedTagsErrors.length
        ){

            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("preview_image", previewImage);
            formData.append("total_time", estimatedTime);
            formData.append("ingredients", JSON.stringify(ingredientsList))
            formData.append("tags", JSON.stringify(tags))

            // this is how we can pass an array to the backend without using JSON.stringify
            for (const method of methodsList) {
                Object.entries(method).forEach(([key, value]) => {
                    // we need to pass an empty file to the backend to keep the order of files/details
                    if (key === "image" && value === "") {
                        // blob necessary to keep array length the same on the backend
                        const dummyImage = new Blob([], {
                            type: "dummy/jpeg",
                          });
                        value = dummyImage
                        formData.append(key, value, "dummy_image.jpeg")
                    } else {
                        formData.append(key, value)
                    }
                })
            }

            setIsLoaded(false)
            if (!recipe) { // POST Recipe
                const data = await dispatch(postARecipeThunk(formData))
                if (Array.isArray(data)) {
                    setIsLoaded(true)
                    setErrors(data)
                } else {
                    setIsLoaded(true)
                    history.push(`/recipes/${data.id}`)
                }
            } else { // PUT Recipe
                const data = await dispatch(updateRecipeThunk(recipe.id, formData))
                if (Array.isArray(data)) {
                    setIsLoaded(true)
                    setErrors(data)
                } else {
                    setIsLoaded(true)
                    history.push(`/recipes/${recipe.id}`)
                }
            }
        }
    }

    return (
        <>
        {isLoaded ? (
            <div className="recipe_form_background_image">
                <form onSubmit={handleSubmit} className="recipe_form" encType="multipart/form-data">
                    <div className="recipe_form_title">{!recipe ? "Submit a Recipe" : "Update your Recipe"}</div>
                    {errors.map((error, idx) => {
                        return (
                            <div className="form_error" key={idx}>{error}</div>
                        )
                        })}

                    {/*********************************************************************** Title ***********************************************************/}
                    <div className="recipe_form_input_div">
                        <label className="recipe_form_label">
                            Recipe Title<span className="required_input">*</span>
                        </label>
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

                    {/*********************************************************************** Description ***********************************************************/}
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

                    {/*********************************************************************** Recipe Image ***********************************************************/}
                    <div className="recipe_form_input_div">
                        <div className="recipe_form_label">Recipe Preview Image<span className="required_input">*</span></div>
                        <div className="recipe_form_input_constraints">Allowed file types: ".jpg", ".jpeg", ".png", ".gif"</div>
                        {previewImageErrors.map((error, idx) => {
                            return (
                                <div className="form_error" key={idx}>{error}</div>
                            )
                        })}
                        <div className="preview_recipe_image_div">
                            {!!previewImageURL ? (
                                // if there is a preview image url, either from the recipe, or from the user's input
                                // render img tag with the recipe image
                                    <img className="recipe_preview" src={previewImageURL} alt={`preview of final product`} />
                                ) : (
                                // else render an empty div with the same styling
                                    <div className="empty_preview recipe_preview">Please Upload a File</div>
                            )}
                        </div>
                        {!recipe ? (
                            <label className="recipe_form_preview_image_input">
                                <div className="select_image_button">
                                    Upload Image
                                </div>
                                <input
                                    required
                                    className="recipe_form_input recipe_form_preview_image_input"
                                    type="file"
                                    accept="image/jpg, image/jpeg, image/png, image/gif"
                                    onChange={(e) => {
                                        const file = e.target.files[0]
                                        if (file) {
                                            setPreviewImage(file)
                                            setPreviewImageURL(URL.createObjectURL(file))
                                        }
                                    }}
                                />
                            </label>
                        ) : (
                            // if there is already a recipe there's no need to require this input
                            <input
                                className="recipe_form_input recipe_form_preview_image_input"
                                type="file"
                                accept="image/jpg, image/jpeg, image/png, image/gif"
                                onChange={(e) => {
                                    const file = e.target.files[0]
                                    if (file) {
                                        setPreviewImage(file)
                                        setPreviewImageURL(URL.createObjectURL(file))
                                    }
                                }}
                            />
                        )}
                    </div>

                    {/*********************************************************************** Estimated Time to Make ***********************************************************/}
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

                    {/*********************************************************************** Ingredients ***********************************************************/}
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
                                                if (!unit) return <option key={idx} value={unit}>Select Units (if any)</option>
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

                    {/*********************************************************************** Methods ***********************************************************/}
                    <div className="recipe_form_input_div">
                        {methodsList.map((method, idx) => {
                            return (
                                <div key={idx}>
                                    <label className="recipe_form_label">Step {idx + 1}</label>
                                    {methodsListErrors[idx].map((error, errorIdx) => {
                                        return (
                                            <div className="form_error" key={errorIdx}>{error}</div>
                                        )
                                    })}
                                    <div className="method_div">
                                        <div className="recipe_form_input_div">
                                            <label>Optional Image</label>
                                            <div className="preview_recipe_image_div">
                                                {!!methodPreviewImageURLs[idx] ? (
                                                    // if there is a preview image url, either from the recipe, or from the user's input
                                                    // render img tag with the recipe image
                                                        <img className="recipe_preview" src={methodPreviewImageURLs[idx]} alt={`preview of final product`} />
                                                    ) : (
                                                    // else render an empty div with the same styling
                                                        <div className="empty_preview recipe_preview">Add An Image</div>
                                                )}
                                            </div>
                                            <input
                                                className="recipe_form_input recipe_form_method_image_input"
                                                type="file"
                                                accept="image/jpg, image/jpeg, image/png, image/gif"
                                                name="image"
                                                onChange={e => handleMethodInputChange(e, idx)}
                                            />
                                            <div className="recipe_form_input_constraints">Allowed file types: ".jpg", ".jpeg", ".png", ".gif"</div>
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

                    {/*********************************************************************** Tags ***********************************************************/}
                    <div className="recipe_form_input_div">
                        <label className="recipe_form_label">Tags<span className="required_input">*</span></label>
                        <div className="recipe_form_input_constraints">Press [Enter] after every tag, or separate with comma and hit [Enter] (minimumn 5)</div>
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
                        <p className="recipe_form_input_constraints">
                            To give your recipe the best opportunity to be found please use at least 5 tags,
                            making sure to include the meal type, any relevant dietary tags, and primary ingredient types.
                            Other relevant tags could be seasons or holidays, event types, or cooking techniques.
                        </p>
                    </div>

                    {/*********************************************************************** Submit Button ***********************************************************/}
                    <button className="recipe_form_submit_button" type="submit">{!recipe ? "Submit" : "Update"}</button>

                    {/*********************************************************************** Legend ***********************************************************/}
                    <div className="recipe_form_legend">
                        <span className="required_input">*</span> = Required Field
                    </div>
                </form>
            </div>
            ) : (
                <LoadingComponent />
            )}
        </>
    )
}

export default RecipeForm;
