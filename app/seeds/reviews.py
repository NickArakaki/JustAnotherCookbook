from app.models import db, Review, environment, SCHEMA, User
from sqlalchemy.sql import text
from faker import Faker


def seed_reviews():
    r1 = Review(
        user_id = 1,
        recipe_id = 1,
        rating = 5,
        review = "Best tarts I've ever had"
    )
    r2 = Review(
        user_id = 5,
        recipe_id = 1,
        rating = 5,
        review = "These are legit amazing!"
    )
    r3 = Review(
        user_id = 6,
        recipe_id = 1,
        rating = 5,
        review = "Takes me back to my childhood"
    )
    r4 = Review(
        user_id = 4,
        recipe_id = 1,
        rating = 3,
        review = "I've had better"
    )
    r5 = Review(
        user_id = 2,
        recipe_id = 1,
        rating = 5,
        review = "Seriously, if you haven't tried these yet what are you waiting for?"
    )
    r6 = Review(
        user_id = 6,
        recipe_id = 2,
        rating = 3,
        review = "You could have put more effort in it than that..."
    )

    db.session.add_all([r1, r2, r3, r4, r5, r6])

    db.session.commit()


def undo_reviews():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.reviews RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM reviews"))

    db.session.commit()
