from flask import Blueprint, request
from flask_login import login_required, current_user
from .auth_routes import validation_errors_to_error_messages
from .utils.recipe_utils import add_ingredients, add_methods, add_tags, update_ingredients, update_methods, update_tags, is_valid_methods
from .utils.aws_utils import upload_file_to_s3, get_unique_filename
from app.models import db, Recipe, Ingredient, Method, Review, Tag
from app.forms import PostRecipeForm, UpdateRecipeForm, ReviewForm
import json

recipe_routes = Blueprint('recipes', __name__)


# Routes
@recipe_routes.route('/')
def get_all_recipes():
    """
    Query for all recipes and return them in a list of recipe dictionaries
    """
    recipes = Recipe.query.all()
    return { "recipes": [recipe.to_dict() for recipe in recipes] }


@recipe_routes.route('/current')
@login_required
def get_user_recipes():
    """
    Query for all current user recipes and return list of recipe dictionaries
    """
    return { "user_recipes": [recipe.to_dict() for recipe in current_user.recipes] }


@recipe_routes.route('/<int:id>')
def get_recipe_details(id):
    """
    Query for single recipe and return single recipe details
    """
    recipe = Recipe.query.get(id)
    if not recipe:
        return { "errors": ["Recipe could not be found."] }, 404
    return recipe.to_dict_detailed()


@recipe_routes.route('/', methods=["POST"])
@login_required
def post_a_recipe():
    """
    Create and return a new Recipe
    """
    form = PostRecipeForm()

    form['csrf_token'].data = request.cookies['csrf_token']
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used

    if form.validate_on_submit():

        # this is how we can send a list of objects with files from the frontend (Refer to lines 175-179 in /react-app/src/components/RecipeForm/RecipeForm.js)
        # idk if this is the "correct" way to do this, but it's 12:30am and I'm just trying to get this to work
        method_images = [{"image": "" if image.mimetype == "dummy/jpeg" else image} for image in request.files.getlist("image")]
        method_details = [{"details": details, "step_number": (index + 1)} for index, details in enumerate(request.form.getlist("details"))]
        method_list = [{**image, **details} for image, details in zip(method_images, method_details)]
        # make sure methods are valid before proceeding, don't want to start sending aws uploads until all data has been validated
        if not is_valid_methods(method_list):
            return { "errors": ["Invalid methods"] }, 400


        preview_image = form.data["preview_image"]
        preview_image.filename = get_unique_filename(preview_image.filename)
        upload = upload_file_to_s3(preview_image)

        if "url" not in upload:
            # if the dictionary doesn't have a url key
            # it means that there was an error when we tried to upload
            # so we send back that error message
            return { "errors": [upload] }, 400

        new_recipe = Recipe(
            author_id = current_user.id,
            title = form.data["title"],
            total_time = form.data["total_time"],
            description = form.data["description"],
            preview_image_url = upload["url"]
        )
        db.session.add(new_recipe)


        # Get list of ingredients and tags
        ingredient_list = json.loads(form.data["ingredients"])
        tag_list = json.loads(form.data["tags"])


        # append ingredients to recipe.ingredients
        add_ingredients(new_recipe, ingredient_list)
        # append tags to recipe.tags
        add_tags(new_recipe, tag_list)


        add_method_errors = add_methods(new_recipe, method_list)
        # if there were any errors when uploading ot aws return the error message
        if add_method_errors:
            # this is where will remove the recipe image from aws bucket if there is an error thrown
            return add_method_errors


        db.session.commit()
        return new_recipe.to_dict_detailed()
    else:
        return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@recipe_routes.route('/<int:id>', methods=["PUT"])
@login_required
def update_a_recipe(id):
    """
    Update and return a new Recipe using Recipe id
    """
    form = UpdateRecipeForm()
    recipe = Recipe.query.get(id)
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']

    # Authorization
    if not recipe:
        return { "errors": ["Recipe could not be found" ] }, 404
    elif recipe.author.id != current_user.id:
        return { "errors": ["User is not authorized to edit this Recipe"] }, 403

    # Form validations
    if form.validate_on_submit():
        method_images = [{"image": "" if image.mimetype == "dummy/jpeg" else image} for image in request.files.getlist("image")]
        method_details = [{"details": details, "step_number": (index + 1)} for index, details in enumerate(request.form.getlist("details"))]
        method_ids = [{"id": id} for id in request.form.getlist("id")]

        method_list = [{**image, **details, **id} for image, details, id in zip(method_images, method_details, method_ids)]
        print("method list ====================================================", method_list)
        update_method_errors = update_methods(recipe, method_list)

        if update_method_errors:
            return update_method_errors

        # make sure methods are valid before proceeding, don't want to start sending aws uploads until all data has been validated
        if not is_valid_methods(method_list):
            return { "errors": ["Invalid methods"] }, 400

        recipe.title = form.data["title"]
        recipe.total_time = form.data["total_time"]
        recipe.description = form.data["description"]

        # this is where we check to see if there's a new image
        if form.data["preview_image"]:
            preview_image = form.data["preview_image"]
            preview_image.filename = get_unique_filename(preview_image.filename)
            upload = upload_file_to_s3(preview_image)

            if "url" not in upload:
                return { "errors": [upload] }, 400

            # going to want to delete the old image from the aws bucket, before reassigning to new image, will implement after MVP
            recipe.preview_image_url = upload["url"]

        # Get list of ingredients and tags
        ingredients_list = json.loads(form.data["ingredients"])
        tags_list = json.loads(form.data["tags"])

        update_ingredients(recipe, ingredients_list)
        update_tags(recipe, tags_list)

        db.session.commit()
        return recipe.to_dict_detailed()
    else:
        return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@recipe_routes.route('/<int:id>', methods=["DELETE"])
@login_required
def delete_recipe(id):
    """
    Delete existing recipe and all it's methods, ingredients, and reviews
    User must be logged in and authorized
    """
    recipe = Recipe.query.get(id)

    if not recipe:
        return { "errors": ["Recipe could not be found"] }, 404
    elif recipe.author.id != current_user.id:
        return { "errors": ["User is unauthorized to delete this recipe"] }, 403
    else:
        db.session.delete(recipe)
        db.session.commit()
        return { "message": "Successfully Removed" }


@recipe_routes.route('/<int:id>/reviews', methods=["POST"])
@login_required
def post_a_review(id):
    """
    Create and return a Review for a recipe using Recipe id
    """
    recipe = Recipe.query.get(id)
    if not recipe:
        return { "errors": ["Recipe could not be found."] }, 404
    elif recipe.author.id == current_user.id: # User cannot leave Review on their own Recipe
        return { "errors": ["User not authorized to leave comment on own Recipe"] }, 403
    elif current_user.id in [review.user_id for review in recipe.reviews]: # User cannot leave more than one Review per Recipe
        return { "errors": ["User cannot leave more than 1 Review per Recipe"] }, 401
    # should also prevent users from making more than one review per recipe

    form = ReviewForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        new_review = Review(
            user_id = current_user.id,
            rating = form.data["rating"],
            review = form.data["review"]
        )
        recipe.reviews.append(new_review)
        db.session.commit()
        return new_review.to_dict_summary()
    else:
        return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@recipe_routes.route('/<int:id>/likes', methods=["POST"])
@login_required
def like_recipe(id):
    """
    Add current logged in user to recipes liked_users, and return the recipe object
    """
    recipe = Recipe.query.get(id)

    # should users be able to like their own recipes? Maybe not?
    if not recipe:
        return { "errors": ["Recipe could not be found"] }, 404
    elif current_user in recipe.liked_users:
        return { "errors": ["User already liked Recipe"] }, 401
    else:
        recipe.liked_users.append(current_user)
        db.session.commit()
        return recipe.to_dict()


@recipe_routes.route('/<int:id>/likes', methods=["DELETE"])
@login_required
def remove_like(id):
    """
    Remove current user from Recipe liked_users and return Recipe as dictionary
    """
    recipe = Recipe.query.get(id)

    if not recipe:
        return { "errors": ["Recipe could not be foudn"] }, 404
    elif current_user not in recipe.liked_users:
        return { "errors": ["User has not liked this Recipe"]}, 401
    else:
        recipe.liked_users.remove(current_user)
        db.session.commit()
        return recipe.to_dict()
