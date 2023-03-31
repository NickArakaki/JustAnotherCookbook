from app.models import db, Recipe, environment, SCHEMA
from sqlalchemy.sql import text
from .utils import images_and_names
from random import randint
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

    count = 0

    for i in range(5):
        for r in range(6):
            # image_and_name = ran
            print(count ,images_and_names[count])
            print(i)
            recipe = Recipe(
                author_id = i + 1,
                total_time = randint(15, 120),
                preview_image_url = images_and_names[count][0],
                title = images_and_names[count][1],
                description = fake.sentence()
            )
            count = count + 1
            db.session.add(recipe)

    db.session.add(r1)
    db.session.add(r2)
    db.session.commit()


def undo_recipes():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.recipes RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM recipes"))

    db.session.commit()
