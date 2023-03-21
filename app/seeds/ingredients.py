from app.models import db, Ingredient, environment, SCHEMA
from sqlalchemy.sql import text

def seed_ingredients():
    i1 = Ingredient(
        recipe_id = 1,
        ingredient = "Butter",
        amount = 14,
        units = "tbsp"
    )
    i2 = Ingredient(
        recipe_id = 1,
        ingredient = "All-Purpose Flour",
        amount = 1.5,
        units = "cup"
    )
    i3 = Ingredient(
        recipe_id = 1,
        ingredient = "Salt",
        amount = 0.125,
        units = "tsp"
    )
    i4 = Ingredient(
        recipe_id = 1,
        ingredient = "Sugar",
        amount = 1,
        units = "tbsp"
    )
    i5 = Ingredient(
        recipe_id = 1,
        ingredient = "Cold Water",
        amount = 2,
        units = "tbsp"
    )
    i6 = Ingredient(
        recipe_id = 1,
        ingredient = "Hot Water",
        amount = "1",
        units = "cup"
    )
    i7 = Ingredient(
        recipe_id = 1,
        ingredient = "Eggs (room temp)",
        amount = 3,
        units = ""
    )
    i8 = Ingredient(
        recipe_id = 1,
        ingredient = "Evaporated Milk (room temp)",
        amount = 0.5,
        units = "cup"
    )
    i9 = Ingredient(
        recipe_id = 1,
        ingredient = "Vanilla Extract",
        amount = 0.75,
        units = "tsp"
    )
    i10 = Ingredient(
        recipe_id = 1,
        ingredient = "Sugar",
        amount = 0.5,
        units = "cup"
    )
    i11 = Ingredient(
        recipe_id = 2,
        ingredient = "cereal",
        amount = 1,
        units = "cup"
    )
    i12 = Ingredient(
        recipe_id = 2,
        ingredient = "Milk",
        amount = 0.5,
        units = "cup"
    )

    db.session.add_all([i1,i2,i3,i4,i5,i6,i7,i8,i9,i10])
    db.session.add_all([i11,i12])
    db.session.commit()


def undo_ingredients():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.ingredients RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM ingredients"))

    db.session.commit()
