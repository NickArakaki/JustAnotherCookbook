from app.models import db, Recipe, environment, SCHEMA
from sqlalchemy.sql import text

def seed_recipes():
    r1 = Recipe(
        author_id = 3,
        total_time = 120,
        title= "Hong Kong Egg Tarts",
        description = "Hong Kong egg tarts are small (usually about 3 inches in diameter) circular tarts of flaky pastry, filled with a smooth, lightly sweetened egg custard.",
    )
    r2 = Recipe(
        author_id = 1,
        total_time = 5,
        title= "Cereal and Milk",
        description = "Cereal with milk. Perfect for mornings when you're running late.",
    )
    db.session.add(r1)
    db.session.add(r2)
    db.session.commit()


def undo_recipes():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.recipes RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM recipes"))

    db.session.commit()
