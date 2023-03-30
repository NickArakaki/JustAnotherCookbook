from app.models import Ingredient, Method, Tag, db
from app.api.utils.aws_utils import allowed_file, get_unique_filename, upload_file_to_s3

## POST HELPERS
def add_ingredients(recipe, ingredients_list):
    for ingredient in ingredients_list:
            new_ingredient = Ingredient(
                ingredient = ingredient["ingredient"],
                amount = ingredient["amount"],
                units = ingredient["units"]
            )
            recipe.ingredients.append(new_ingredient)


def add_methods(recipe, methods_list):
    # use later to delete if there's an error, will not be implemented for MVP
    method_image_urls = []

    for idx, method in methods_list:
        # implement the aws helpers here
        method_image = method["image"]
        method_image_url = ""
        if method_image:
            print("method image================", method_image)
            method_image.filename = get_unique_filename(method_image.filename)
            upload = upload_file_to_s3(method_image)

            # if error gets thrown by aws return the error
            if "url" not in upload:
                # this is where we will eventually delete all the successful aws uploads if one fails
                return { "errors": [upload] }, 400

            method_image_url = upload["url"]
            method_image_urls.append(upload["url"])

        new_method = Method(
            step_number = method["step_number"],
            details = method["details"],
            image_url = method_image_url
        )
        recipe.methods.append(new_method)


def add_tags(recipe, tags_list):
    db_tags = Tag.query.all()
    for tag in tags_list:
            existing_tag = [db_tag for db_tag in db_tags if db_tag.tag == tag]
            if not existing_tag:
                new_tag = Tag(tag=tag)
                db.session.add(new_tag)
                db.session.commit()
                recipe.tags.append(new_tag)
            else:
                recipe.tags.append(*existing_tag)


## UPDATE HELPERS
def update_ingredients(recipe, ingredients_list):
    ingredient_difference = len(ingredients_list) - len(recipe.ingredients)

    for new_ingredient, old_ingredient in zip(ingredients_list, recipe.ingredients):
                old_ingredient.ingredient = new_ingredient["ingredient"]
                old_ingredient.amount = new_ingredient["amount"]
                old_ingredient.units = new_ingredient["units"]

    if ingredient_difference > 0: # new ingredients to be added
        # iterate through, update existing ingredients with new data
        for ingredient in ingredients_list[(ingredient_difference * -1):]: # get list of new ingredients
                new_ingredient = Ingredient(
                    ingredient = ingredient["ingredient"],
                    amount = ingredient["amount"],
                    units = ingredient["units"]
                )
                recipe.ingredients.append(new_ingredient)
    elif ingredient_difference < 0: # fewer or same number of ingredients
        # delete the extra recipe ingredients
        for ingredient in recipe.ingredients[ingredient_difference:]:
            recipe.ingredients.remove(ingredient)


def update_methods(recipe, methods_list):
    methods_to_create = []
    methods_to_update = {}

    for method in methods_list:
        if method["id"]:
            methods_to_update[method["id"]] = method
        else:
            methods_to_create.append(method)

    # for each method in old methods compare to the methods to be updated by id
    for old_method in recipe.methods:
        print("old method before ==========================================", old_method.to_dict())
        id = str(old_method.id)

        if id not in methods_to_update:
            db.session.delete(old_method)
        else:
            method_to_update = methods_to_update[id]
            # if there is a new image deploy aws
                # if there is an error return the error
            new_method_image = method_to_update["image"]

            if new_method_image:
                new_method_image.filename = get_unique_filename(new_method_image.filename)
                print(new_method_image.filename)
                upload = upload_file_to_s3(new_method_image)

                 # if error gets thrown by aws return the error
                if "url" not in upload:
                    return { "errors": [upload] }, 400

                old_method.image_url = upload["url"]

            # update the method
            old_method.details = method_to_update["details"]
            old_method.step_number = method_to_update["step_number"]

    # create the new methods and append to recipe can use the add_methods helper function
    # if there is an error return the error
    add_method_error = add_methods(recipe, methods_to_create)
    if add_method_error:
        return add_method_error


def update_tags(recipe, tags_list):
    db_tags_list = Tag.query.all()

    new_tags = []

    for tag in tags_list:
        existing_tag = [db_tag for db_tag in db_tags_list if db_tag.tag == tag]
        if existing_tag:
            new_tags.append(*existing_tag)
        if not existing_tag:
            new_tag = Tag(tag=tag)
            db.session.add(new_tag)
            new_tags.append(new_tag)

    # compare incoming tags and recipe tags as sets
    # remove the ones that are in recipe tags and not incoming
    # add the ones that are in incoming and not in recipe tags
    tags_to_remove = set(recipe.tags) - set(new_tags)
    tags_to_add = set(new_tags) - set(recipe.tags)

    for tag in tags_to_remove:
        recipe.tags.remove(tag)
        if not tag.recipes:
            db.session.delete(tag)

    for tag in tags_to_add:
        recipe.tags.append(tag)


## VALIDATORS
def is_valid_methods(methods_list):
    is_valid = True

    for method in methods_list:
        if not method["details"]:
            is_valid = False
            break

        if method["image"]:
            # validate image file
            if not allowed_file(method["image"]):
                is_valid = False
                break
        # validate
        # if at any point it fails set is_valid to False and break
    return is_valid
