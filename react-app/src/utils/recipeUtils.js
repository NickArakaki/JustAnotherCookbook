export const measurementUnits = ["","tsp", "tbsp", "cup"]

// validate recipe method
// input: recipe
export const validateRecipe = recipe => {
    // validations:
    const errors = [];
    // title must exist
    if (!recipe.title) errors.push("Title Required")
    // description must exist
    if (!recipe.description) errors.push("Description Required")
    // preview Image must exist and be a valid image URL
    if (!recipe.preview_image_url) errors.push("Preview Image Required")
    // validate image url

    // estimated time to make must be an integer greater than 0
    if (!recipe.total_time) errors.push("Estimated Time Required")
    // ingredients
    // must have at least one ingredient
    if (recipe.ingredients.length < 1) {
        errors.push("At least 1 Ingredient is Required")
    } else {
        // must have a name
        recipe.ingredients.forEach(ingredient => {

        });
    }

    // must have an amount
    // methods
    // must have at least one method
    // must have a description
    // if there is an image must be validated same as preview image
    // output: array of errors
    // if no errors: return empty array
    return errors;
}
