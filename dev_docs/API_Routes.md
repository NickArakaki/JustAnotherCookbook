# API Documentation

## USER AUTHENTICATION/AUTHORIZATION

### All Endpoints that Require Login

All endpoints that require a current user to be logged in.

* Request: endpoints that require authentication
* Error Response:
  * Status Code: 401
  * Header:
    * Content-Type: application/json
  * Body:
  ```json
    {"errors": ["Unauthorized"]}
  ```

### Get the Current User

Returns the information about the current user that is logged in.

* Requires Authentication: True
* Request
    * Method: GET
    * URL: /api/auth/
    * Body: none
* Successful Response
    * Status Code: 200
    * Headers:
        * Content-Type: application/json
    * Body:
    ```json
    {
      "user": {
        "id": 1,
        "username": "DemoUser",
        "firstName": "Demo",
        "lastName": "User",
        "email": "demo@user.com"
      },
      "userFavoriteRecipes": {
        "id": 1,
        "author": {
          "id": 2,
          "username": "Peeb"
        },
        "title":"Hong Kong Egg Tarts",
        "total_time": 120,
        "description":"Hong Kong egg tarts are small (usually about 3 inches in diameter) circular tarts of flaky pastry, filled with a smooth, lightly sweetened egg custard.",
        "preview_image_url": "https://omnivorescookbook.com/wp-content/uploads/2021/04/200918_Hong-Kong-Egg-Tart_2.jpg",
        "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
        "liked_users_ids": [1]
      }
    }
    ```

### Log In a User

Logs in a current user with valid credentials and returns the current user's information.

* Require Authentication: false
* Request
  * Method: POST
  * URL: /api/auth/login
  * Headers:
    * Content-Type: application/json
  * Body:

  ```json
  {
    "email": "demo@user.com",
    "password": "password"
  }
  ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
    {
    "user": {
      "id": 1,
      "username": "DemoUser",
      "firstName": "Demo",
      "lastName": "User",
      "email": "demo@user.com"
    },
    "userFavoriteRecipes": [
      {
        "id": 1,
        "author": {
          "id": 2,
          "username": "Peeb"
        },
        "title":"Hong Kong Egg Tarts",
        "total_time": 120,
        "description":"Hong Kong egg tarts are small (usually about 3 inches in diameter) circular tarts of flaky pastry, filled with a smooth, lightly sweetened egg custard.",
        "preview_image_url": "https://omnivorescookbook.com/wp-content/uploads/2021/04/200918_Hong-Kong-Egg-Tart_2.jpg",
        "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
        "liked_users_ids": [1]
      },
    ]
  }
    ```
* Error Response: Invalid credentials
  * Status Code: 401
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
  {
    "errors": [
                "Email provided not found.",
                "No such user exists.",
                "Password was incorrect."
              ]
  }
  ```

* Error response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
  {
    "errors": [
                "Email is required.",
                "Password is required.",
              ]
  }
  ```

### Sign Up a User

Creates a new user, logs them in as the current user, and returns the current
user's information.

* Require Authentication: false
* Request
  * Method: POST
  * URL: /api/auth/signup
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
    {
      "username": "DemoUser",
      "email": "demo@user.com",
      "password": "password"
    }
  ```

* Successful Response:
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
    {
      "id": 1,
      "username": "DemoUser",
      "email": "demo@user.com"
    }
  ```

* Error response: User already exists with the specified email
  * Status Code: 401
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
  {
    "errors": ["Email address already in use."]
  }
  ```

* Error response: User already exists with the specified username
  * Status Code: 401
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
  {
    "errors": ["Username already in use."]
  }
  ```

* Error response: Body validation errors
  * Status Code: 401
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
  {
    "errors": [
                "Username Required",
                "Email Required",
                "Password Required"
              ]
  }
  ```


## Users
### Get all users
Returns a list of all users

* Require Authentication: false
* Request:
  * Method: GET
  * URL: /api/users/
  * Body: none

* Successful Response:
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
    {
      "users": [
                  {
                    "id": 1,
                    "username": "Demo",
                  }
               ]
    }
  ```

### Get single user
Returns details about a single user

* Require Authentication: false
* Request:
  * Method: GET
  * URL: /api/users/:userId
  * Body: none

* Successful Response:
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
        {
            "id": 1,
            "username": "DemoUser",
            "email": "demo@user.com"
        }
  ```

### Get user Recipes

Return a list of a User's Recipes

* Require Authentication: false
* Request
  * Method: GET
  * URL: /api/users/:userId/recipes
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
  {
    "recipes": [
     {
      "id": 1,
      "author": {
        "id": 2,
        "username": "Peeb"
      },
      "title":"Hong Kong Egg Tarts",
      "total_time": 120,
      "description":"Hong Kong egg tarts are small (usually about 3 inches in diameter) circular tarts of flaky pastry, filled with a smooth, lightly sweetened egg custard.",
      "preview_image_url": "https://omnivorescookbook.com/wp-content/uploads/2021/04/200918_Hong-Kong-Egg-Tart_2.jpg",
      "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
      "liked_users_ids": [1]
      },
    ]
  }
  ```


### Get Current User's Favorite Recipes

Return a list of the Current User's Favorite Recipes

* Require Authentication: true
* Request
  * Method: GET
  * URL: /api/users/current/favorites
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
      * Content-Type: application/json
  * Body:
  ```json
  {
    "recipes": [
     {
      "id": 1,
      "author": {
        "id": 2,
        "username": "Peeb"
      },
      "title":"Hong Kong Egg Tarts",
      "total_time": 120,
      "description":"Hong Kong egg tarts are small (usually about 3 inches in diameter) circular tarts of flaky pastry, filled with a smooth, lightly sweetened egg custard.",
      "preview_image_url": "https://omnivorescookbook.com/wp-content/uploads/2021/04/200918_Hong-Kong-Egg-Tart_2.jpg",
      "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
      "liked_users_ids": [1]
      },
    ]
  }
  ```


## Recipes

### Get all Recipes
Returns list of all Recipes

* Require Authentication: false
* Request
  * Method: GET
  * URL: /api/recipes/
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
  {
    "recipes": [
     {
      "id": 1,
      "author": {
        "id": 2,
        "username": "Peeb"
      },
      "title":"Hong Kong Egg Tarts",
      "total_time": 120,
      "description":"Hong Kong egg tarts are small (usually about 3 inches in diameter) circular tarts of flaky pastry, filled with a smooth, lightly sweetened egg custard.",
      "preview_image_url": "https://omnivorescookbook.com/wp-content/uploads/2021/04/200918_Hong-Kong-Egg-Tart_2.jpg",
      "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
      "liked_users_ids": [1]
      },
    ]
  }
  ```

### Get Current User's Recipes
Returns list of all current user's recipes

* Require Authentication: true
* Request
  * Method: GET
  * URL: /api/recipes/current
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
        {
            "id": 1,
            "description": "Expense Description",
            "payer": {
                "id": 1,
                "firstName": "Demo",
                "lastName": "User",
            },
            "owers": [
                {
                    "id": 2,
                    "firstName": "John",
                    "lastName": "Smith",
                }
            ],
            "settledOwers": [
                {
                    "id": 2,
                    "firstName": "John",
                    "lastName": "Smith",
                }
            ],
            "amount": 45,
            "expenseDate": "2022-25-12",
            "createdAt": "2022-12-25",
            "updatedAt": "2022-12-25"
        }
  ```

* Error response: Couldn't find a Expense with the specified id
  * Status Code:
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json

    ```


### Get Single Recipe Details

Return details of single recipe as JSON object

* Require Authentication: false
* Request
  * Method: GET
  * URL: /api/recipes/:recipeId
  * Headers:
    * Content-Type: application/json
  * Body: none

* Successful Response:
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
      {
        "id": 1,
        "author": {
          "id": 2,
          "username": "Peeb",
        },
        "title": "Hong Kong Egg Tarts",
        "total_time": 120,
        "description": "Hong Kong egg tarts are small (usually about 3 inches in diameter) circular tarts of flaky pastry, filled with a smooth, lightly sweetened egg custard.",
        "preview_image_url": "https://omnivorescookbook.com/wp-content/uploads/2021/04/200918_Hong-Kong-Egg-Tart_2.jpg",
        "created_at": "2021-12-25",
        "updated_at": "2021-12-25",
        "ingredients": [
          {
            "ingredient": "Eggs",
            "amount": "3",
            "units": "", // optional units, if there are no units will be stored as an empty string
          }
        ],
        "methods": [
          {
            "id": 1,
            "step_number": 1,
            "details": "This is the first step information",
            "iamge_url": "some.url",
            "image": "", // will be sent to frontend as an empty string, necessary for updating recipe form method images with current implementation on frontend
          }
        ],
        "reviews": [
          {
            "id": 1,
            "author": {
              "id": 1,
              "username": "Demo",
              "rating": 5,
              "review": "These are the best tarts ever!",
              "created_at": "2022-01-01",
              "updated_at": "2022-01-01",
            },
          }
        ],
        "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
        "liked_users_ids": [1],
      }
  ```

* Error response: Couldn't find a Recipe with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    { "errors": ["Recipe could not be found"] }
    ```

### Post a new Recipe
Creates and returns a new Recipe

* Require Authentication: true
* Request
  * Method: POST
  * URL: /api/recipes/
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
  {
    "title": "Recipe Title",
    "preview_image": "preview image file (must be .jpg, .png, .jpeg, or .gif)",
    "total_time": 15,
    "description": "Recipe description",
    "ingredients": "[{'ingredient': 'ingredient name', amount: 'ingredient amount', 'units': ''}]", // must be a JSONified array with each element as an ingredient object, done this way to use WTForms backend form validations
    "tags": "['tag1', 'tag2', 'tag3', 'tag4', 'tag5']", // same as ingredients, must be sent as a JSONified array
    "methods": [{"id": "if new method leave as empty", "detail": "Method details", "image": "either pass the image file or an empty blob with the mime type 'dummy/jpeg'"}], // this is a complicated bit of data to be sent from the front end
    // This was the solution that I came up with to keep each method and their respected details and ids in the same order
    /*
      This was my implementation on the frontend to pass a list of files to the backend:

      Object.entries(method).forEach(([key, value]) => {
          if (key === "image" && value === "") {
              const dummyImage = new Blob([], {
                  type: "dummy/jpeg",
                });
              value = dummyImage
              formData.append(key, value, "dummy_image.jpeg")
          } else {
              formData.append(key, value)
          }
      })

      This is how I am re-construcing the data on the backend:

       method_images = [{"image": "" if image.mimetype == "dummy/jpeg" else image} for image in request.files.getlist("image")]
        method_details = [{"details": details, "step_number": (index + 1)} for index, details in enumerate(request.form.getlist("details"))]
        method_list = [{**image, **details} for image, details in zip(method_images, method_details)]

        If you have a better solution please reach out as I would love to learn of a better method, but for now this is my working solution
    */

  }
  ```

* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
      {
        "id": 2,
        "author": {
          "id": 1,
          "username": "Demo",
        },
        "title": "Recipe Title",
        "total_time": 15,
        "description": "Recipe description",
        "preview_image_url": "some.url",
        "created_at": "2021-12-25",
        "updated_at": "2021-12-25",
        "ingredients": [
          {
            "ingredient": "ingredient name",
            "amount": "ingredient amount",
            "units": "", // optional units, if there are no units will be stored as an empty string
          }
        ],
        "methods": [
          {
            "id": 1,
            "step_number": 1,
            "details": "This is the first step information",
            "iamge_url": "some.url",
            "image": "", // will be sent to frontend as an empty string, necessary for updating recipe form method images with current implementation on frontend
          }
        ],
        "reviews": [],
        "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
        "liked_users_ids": [],
      }
  ```

* Error Response: Body validation error
  * Status Code: 401
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
    {
      "errors": [
                  "Title Required",
                  "Preview Image Required",
                  "Total Time Required",
                  "Description Required",
                  "Ingredient Name Required",
                  "Invalid Ingredient Amount",
                  "Must have at least 5 tags",
                  "Tags Cannot Be Empty Strings",
                  "Tags Cannot Be Longer Than 60 Characters",
                  "Invalid methods"
                ]
    }
  ```

* Error Response: Error Uploading Image to AWS
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
  { "errors": ["AWS Error Message"] }
  ```

### Update Expense
Updates and returns an existing expense

* Require Authentication: true
* Require proper authorization: Current user is the payer and there are no settled users yet
* Request
  * Method: PUT
  * URL: /api/expenses/:expenseId
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
  {
    "owerIds": [2, 3],
    "description": "Updated Expense Description",
    "amount": 45,
    "expenseDate": "2022-12-25"
  }
  ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
      {
          "id": 1,
          "description": "Updated Expense Description",
          "payer": {
              "id": 1,
              "firstName": "Demo",
              "lastName": "User",
          },
          "owers": [
              {
                  "id": 2,
                  "firstName": "John",
                  "lastName": "Smith",
              },
              {
                  "id": 3,
                  "firstName": "Jane",
                  "lastName": "Doe"
              }
          ],
          "settledOwers": [
              {
                  "id": 2,
                  "firstName": "John",
                  "lastName": "Smith",
              }
          ],
          "amount": 45,
          "expenseDate": "2022-25-12",
          "createdAt": "2022-25-12",
          "updatedAt": "2022-31-12"
      }
  ```

* Error Response: Body validation error
  * Status Code: 401
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
  {
    "errors": [
                "Must be at least one other person for an Expense",
                "Description Required",
                "Amount Required",
                "Expense Date Required"
              ]
  }
  ```

* Error Response: User is not the payer of the expense, or the expese already has at least one settled ower
  * Status Code: 401
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
    { "errors": [
                  "Unauthorized to update this expense",
                  "Cannot update an expense when one or more user has settled their expenses"
                ]
    }
  ```

* Error response: Couldn't find a Spot with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
  { "errors": ["Expense could not be found"] }
  ```

### Delete an Expense
Deletes an existing expense

* Require Authentication: true
* Require proper authorization: User must be the expense payer and there cannot be any settled owers yet
* Request
  * Method: DELETE
  * URL: /api/expenses/:expenseId
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
  {
    "message": "Successfully Removed",
  }
  ```

* Error response: Couldn't find an Expense with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
  {
    "message": "Expense could not be found",
    "statusCode": 404
  }
  ```

* Error response: User is not the payer of the expense, or the expese already has at least one settled ower
  * Status Code: 401
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
    { "errors": [
                  "Unauthorized to delete this expense",
                  "Cannot delete an expense when one or more user has settled their expenses"
                ]
    }
  ```
