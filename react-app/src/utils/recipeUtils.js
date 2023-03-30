export const measurementUnits = ["", "tsp", "tbsp", "oz", "fl. oz", "C", "qt", 'pt', 'gal', 'lb', 'g', 'kg', 'mL', 'L']

// validations
export const validateRecipeTitle = title => {
    const errors = []
    if (!title.trim()) errors.push("TITLE REQUIRED")

    return errors
}

export const validateRecipeDescription = description => {
    const errors = [];

    if (!description.trim()) errors.push("DESCRIPTION REQUIRED");
    if (description.length > 200) errors.push("DESCRIPTION CAN'T BE LONGER THAN 200 CHARACTERS");

    return errors;
}

export const isValidImageURL = image => {
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif'];

    let isValid = false;
    for (const allowedExtension of allowedExtensions) {
        if (image.endsWith(allowedExtension)) {
            isValid = true;
            break
        }
    }


    return isValid;
}

export const isValidImage = image => {
    const allowedFileTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
    return allowedFileTypes.includes(image?.type)
}

export const validateRecipeImage = imageURL => {
    // preview_image_url
    const errors = [];

    if (!imageURL) errors.push("PREVIEW IMAGE REQUIRED")

    if (!isValidImage(imageURL)) errors.push("INVALID FILE TYPE")

    return errors;
}

export const validateEstimatedTime = estimatedTime => {
    const errors = [];
    if (estimatedTime <= 0) errors.push("ESTIMATED TIME MUST BE LONGER THAN 0 MINUTES")

    return errors;
}

export const validateIngredients = ingredientsList => {
    const errors = [];
    // ingredients
    for (const ingredient of ingredientsList) {
        const ingredientErrors = []
        // each must have a valid name longer than 3 chars ?
        if (!ingredient.ingredient) ingredientErrors.push("INGREDIENT NAME IS REQUIRED")
        if (ingredient.ingredient.length < 3) ingredientErrors.push("INGREDIENT NAME MUST BE AT LEAST 3 CHARACTERS")
        // amount must be greater than 0
        if (ingredient.amount <= 0) ingredientErrors.push("AMOUNT MUST BE GREATER THAN 0")
        errors.push(ingredientErrors);
    }
    return errors;
}

export const validateMethods = methodsList => {
    const errors = []
    // methods
    for (const method of methodsList) {
        const methodErrors = []
        // each must have details with a min length of ?
        if (method.details.length < 10) methodErrors.push("DESCRIPTION NEEDS TO BE AT LEAST 10 CHARACTERS")
        if (method.details.length > 1000) methodErrors.push("DESCRIPTION MUST BE LESS THAN 1000 CHARACTERS")
        // max length ?
        // if there is an image url, validate using same metric as preview_image
        if (method.image_url && !isValidImageURL(method.image_url)) methodErrors.push("IMAGE URL MUST END WITH .png, .jpg, or .jpeg")
        errors.push(methodErrors)
    }
    return errors;
}

export const validateTags = tags => {
    const errors = []
    // tags
    // must have at least 5 tags
    if (tags.length < 5) errors.push("THERE MUST BE AT LEAST 5 TAGS")
    for (const tag of tags) {
        // must be at least one character in length, not including white space
        if (!tag.length) errors.push("TAG MUST BE AT LEAST ONE CHARACTER")
        // max length is 60 chars
        if (tag.length > 60) errors.push("TAG MUST BE LESS THAN 60 CHARACTERS")
    }
    return errors;
}
