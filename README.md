# JustAnotherCookbook

JustAnotherCookbook is a recipe sharing website where food lovers can easily share their recipes.  JustAnotherCookbook is a modified clone of [Trivet Recipes](https://trivet.recipes/), and was created with idea that finding and sharing a fantastic recipe should be as simple and easy as possible. So whether it's finding inspiration for tonight's dinner or sharing your wonderful creations with the rest of the world, we hope that you will enjoy using our site.

Check [JustAnotherCookbook](https://justanothercookbook.onrender.com) (hosted on Render)

## Index
[MVP Features](https://github.com/NickArakaki/JustAnotherCookbook/wiki/Features) | [Database Schema](https://github.com/NickArakaki/JustAnotherCookbook/wiki/Database-Schema) | [User Stories](https://github.com/NickArakaki/JustAnotherCookbook/wiki/User-Stories) | [Wire Frames](https://github.com/NickArakaki/JustAnotherCookbook/wiki/Wireframes)

## Technologies Used
Backend:

![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/-SQLAlchemy-red)
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)

Frontend:

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)

Hosting:

![Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white)

Version Control:

![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)


## Splash Page
![splash page](./dev_docs/readme_images/splashpage.png)

## Recipe Details
![recipe details](./dev_docs/readme_images/recipedetails.png)


## Getting Started
1. Clone this repositiory
    ```
    https://github.com/NickArakaki/JustAnotherCookbook
    ```

2. Run the following command in the root directory to insall the backend dependencies
    ```
    pipenv install -r requirements.txt
    ```

3. Create a .env file in the root directory based on the .env.example provided

4. Set up your database with information from your .env and then run the following commands to initialize and seed your database:
    ```
    pipenv shell
    ```
    ```
    flask db upgrade
    ```
    ```
    flask seed all
    ```

5. Start the backend application by running the following command in the terminal
    ```
    flask run
    ```

6. In another terminal, change directories to /react-app, and run the following commands to install the necessary frontend dependencies and run the application
    ```
    npm install
    ```
    ```
    npm start
    ```

7. Now you can use the Demo User account or Create your own account locally


## Amazon Web Services S3
* For more information on how to set up AWS please refer to this [guide](https://github.com/jdrichardsappacad/aws-s3-pern-demo)
