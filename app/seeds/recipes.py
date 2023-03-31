from app.models import db, Recipe, environment, SCHEMA, Ingredient, User
from sqlalchemy.sql import text
from .utils import images_and_names, measurement_units, ingredients_list
from random import randint, choice
from faker import Faker

fake = Faker()

def seed_recipes():
    r1 = Recipe(
        author_id = 3,
        total_time = 120,
        title= "Hong Kong Egg Tarts",
        preview_image_url = "https://omnivorescookbook.com/wp-content/uploads/2021/04/200918_Hong-Kong-Egg-Tart_2.jpg",
        description = "Hong Kong egg tarts are small (usually about 3 inches in diameter) circular tarts of flaky pastry, filled with a smooth, lightly sweetened egg custard.",
    )
    r2 = Recipe(
        author_id = 1,
        total_time = 5,
        title= "Cereal and Milk",
        preview_image_url = "https://npr.brightspotcdn.com/dims4/default/8a456cf/2147483647/strip/true/crop/1000x667+0+0/resize/880x587!/quality/90/?url=http%3A%2F%2Fnpr-brightspot.s3.amazonaws.com%2Flegacy%2Fsites%2Fkera%2Ffiles%2F201811%2Fcereal___milk.jpg",
        description = "Cereal with milk. Perfect for mornings when you're running late.",
    )

    db.session.add(r1)
    db.session.add(r2)

    count = 0

    users = User.query.all()
    for user in users:
        for r in range(3):
            recipe = Recipe(
                author_id = user.id,
                total_time = randint(15, 120),
                preview_image_url = images_and_names[count][0],
                title = images_and_names[count][1],
                description = "This is not a real recipe, but I hope that you enjoy all the same. " + fake.sentence(),
            )

            for i in range(randint(3, 8)):
                recipe.ingredients.append(Ingredient(
                    ingredient = choice(ingredients_list),
                    amount = randint(1, 10),
                    units = choice(measurement_units)
                ))

            db.session.add(recipe)
            count = count + 1


    db.session.commit()


def undo_recipes():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.recipes RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM recipes"))

    db.session.commit()
