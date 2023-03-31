from app.models import db, Recipe, environment, SCHEMA
from sqlalchemy.sql import text
# from faker import Faker

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

    # for i in range(5):
    #     for r in range(6):
    #         recipe = Recipe(
    #             author_id = i,
    #             total_time = "", #Random number,
    #             title = "Faker",
    #             preview_image_url = "",# Random choice from list,
    #             description = ""#Faker,
    #         )
    #         pass
    #     pass
    db.session.add(r1)
    db.session.add(r2)
    db.session.commit()


def undo_recipes():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.recipes RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM recipes"))

    db.session.commit()
