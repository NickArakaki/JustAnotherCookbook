// validate recipe method
// input: recipe
    // validations:
        // title must exist
        // description must exist
        // preview Image must exist and be a valid image URL
        // estimated time to make must be an integer greater than 0
        // ingredients
            // must have at least one ingredient
            // must have a name
            // must have an amount
        // methods
            // must have at least one method
            // must have a description
            // if there is an image must be validated same as preview image
// output: array of errors
// if no errors: return empty array
