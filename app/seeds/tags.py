from app.models import db, Tag, Recipe, environment, SCHEMA
from sqlalchemy.sql import text
from .utils import tags
import random

def seed_tags():
    db.session.add_all([Tag(tag=tag) for tag in tags])

    recipes = Recipe.query.all()
    [recipe.tags.extend(random.sample(Tag.query.all(), 5)) for recipe in recipes]
    db.session.commit()



def undo_tags():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.recipes_tags RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.tags RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM recipes_tags"))
        db.session.execute(text("DELETE FROM tags"))

    db.session.commit()
