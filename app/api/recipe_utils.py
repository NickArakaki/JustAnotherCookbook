from app.models import Ingredient, Method, Tag

def add_ingredients(recipe, ingredients_list):
    for ingredient in ingredients_list:
            new_ingredient = Ingredient(
                ingredient = ingredient["ingredient"],
                amount = ingredient["amount"],
                units = ingredient["units"]
            )
            recipe.ingredients.append(new_ingredient)


def add_methods(recipe, methods_list):
    for idx, method in enumerate(methods_list):
                new_method = Method(
                    step_number = idx + 1,
                    details = method["details"],
                    image_url = method["image_url"]
                )
                recipe.methods.append(new_method)


def add_tags(recipe, tags_list):
    db_tags = Tag.query.all()
    for tag in tags_list:
            existing_tag = [db_tag for db_tag in db_tags if db_tag.tag == tag]

            if not existing_tag:
                new_tag = Tag(tag=tag)
                recipe.tags.append(new_tag)
            else:
                recipe.tags.append(existing_tag[0])


def update_methods(recipe, methods_list):
    pass

def update_tags(recipe, tags_list):
    pass
