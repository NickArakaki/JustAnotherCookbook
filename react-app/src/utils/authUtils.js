export const validateUsername = username => {
    const errors = []
    const regEx = /^[a-zA-Z0-9]*$/i

    if (!username) errors.push("USERNAME IS REQUIRED")
    if (username.length < 3) errors.push("USERNAME MUST BE AT LEAST 3 CHARACTERS")
    if (username.length > 20) errors.push("USERNAME CAN'T BE MORE THAN 20 CHARACTERS")
    if (!username.match(regEx)) errors.push("USERNAME MUST BE ALPHANUMERIC CHARACTERS ONLY")

    return errors;
}

export const validatePassword = password => {
    const errors = []

    if (password.length < 8) errors.push("PASSWORD MUST BE AT LEAST 8 CHARACTERS")

    return errors;
}

export const validateConfirmPassword = (password, confirmPassword) => {
    const errors = [];

    if (password !== confirmPassword) errors.push("CONFIRM PASSWORD MUST BE THE SAME AS PASSWORD");

    return errors;
}
