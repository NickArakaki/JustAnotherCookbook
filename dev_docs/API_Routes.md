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
    * URL: /api/users/
    * Body: none
* Successful Response
    * Status Code: 200
    * Headers:
        * Content-Type: application/json
    * Body:
    ```json
              {
                "id": 1,
                "username": "DemoUser",
                "firstName": "Demo",
                "lastName": "User",
                "email": "demo@user.com"
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
    ```
* Error Response: Invalid credentials
  * Status Code: 401
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
  ```

* Error response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
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

* Require Authentication: true
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
                    "username": "DemoUser",
                    "firstName": "Demo",
                    "lastName": "User",
                    "email": "demo@user.com"
                  }
               ]
    }
  ```

### Get single user
Returns details about a single user

* Require Authentication: true
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
            "firstName": "Demo",
            "lastName": "User",
            "email": "demo@user.com"
        }
  ```

### Get current user Friends

Return a list of all current user's friends

* Require Authentication: true
* Request
  * Method: GET
  * URL: /api/users/friends
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
  [
    {
        "id": 2,
        "firstName": "John",
        "lastName": "Smith",
    }
  ]
  ```


### Add a Friend

Return user to be added to user's friends list

* Require Authentication: true
* Request
  * Method: POST
  * URL: /api/users/friends
  * Body:
  ```json
  {
    "email": "johnsmith@user.com"
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
      "firstName": "John",
      "lastName": "Smith",
  }
  ```

* Error Response: Validation Errors
  * Status Code: 401
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
  {
    "errors": [
                "Cannot add yourself to friends list",
                "Email Required",
                "User does not exist."
              ]
  }
  ```


### Remove Friend
Remove a friend from current user's friends list

* Require Authentication: true
* Request:
  * Method: DELETE
  * URL: /api/users/friends/:friendId
  * Body: none

* Successful Response:
  * Status Code: 200
  * Content-Type: application/json
  * Body:
  ```json
  {
    "messasge": "Successfully removed"
  }
  ```


## Expenses

### Get all expenses
Returns all Current User expenses

* Require Authentication: true
* Request
  * Method: GET
  * URL: /api/expenses/
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
  [
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
          "createdAt": "2022-25-12",
          "updatedAt": "2022-25-12"
      }
  ]
  ```

### Get Single Expense
Returns details of a single expense by expense id

* Require Authentication: false
* Request
  * Method: GET
  * URL: /api/expenses/:expenseId
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
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    { "errors": "Expense not found" }
    ```


### Get friend Expenses

Return list of expenses between current user and friend

* Require Authentication: false
* Request
  * Method: GET
  * URL: /api/users/friends/:friendId/expenses
  * Headers:
    * Content-Type: application/json
  * Body: none

* Successful Response:
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
      [
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
                      },
                   ],
          "settledOwers": [
                            {
                              "expenseId": 1,
                              "settledDate": "2023-01-01",
                              "settledUserId": 2
                            },
                          ],
          "amount": 45,
          "expenseDate": "2022-12-25",
          "createdAt": "2022-12-25",
          "updatedAt": "2022-12-25"
        }
      ]
  ```

### Get Current User Settled Expenses (Full and Partial Settled)
Return all of the current user's expenses where at least on ower has settled their debt

* Require Authentication: true
* Request:
  * Method: GET
  * URL: /api/expenses/settled
  * Headers:
    * Content-Type: application/json
  * Body: none

* Successful Response:
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
      [
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
                      },
                   ],
          "settledOwers": [
                            {
                              "expenseId": 1,
                              "settledDate": "2023-01-01",
                              "settledUserId": 2
                            },
                          ],
          "amount": 45,
          "expenseDate": "2022-12-25",
          "createdAt": "2022-12-25",
          "updatedAt": "2022-12-25"
        }
      ]
  ```

### Post a new Expense
Creates and returns a new Expense

* Require Authentication: true
* Request
  * Method: POST
  * URL: /api/expenses/
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
  {
    "owerIds": [2],
    "description": "Expense Description",
    "amount": 45,
    "expenseDate": "2022-12-25"
  }
  ```

* Successful Response
  * Status Code: 201
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
          "settledOwers": [],
          "amount": 45,
          "expenseDate": "2022-25-12",
          "createdAt": "2022-25-12",
          "updatedAt": "2022-25-12"
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
                  "Expense Date Required",
                  "Current User cannot be in ower's list"
                ]
    }
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
