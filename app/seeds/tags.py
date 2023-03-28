from app.models import db, Tag, Recipe, environment, SCHEMA
from sqlalchemy.sql import text
import random

def seed_tags():
    tags = ["chocolate", "cookie", "dessert", "healthy", "entree", "lunch", "breakfast", "snack", "sandwich", "vegetarian", "soup"]
    db.session.add_all([Tag(tag=tag) for tag in tags])

    recipes = Recipe.query.all()
    [recipe.tags.extend(random.sample(Tag.query.all(), 5)) for recipe in recipes]
    db.session.commit()



def undo_tags():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.tags RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM tags"))

    db.session.commit()
