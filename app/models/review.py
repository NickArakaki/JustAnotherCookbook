from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone
from sqlalchemy.sql import func

class Review(db.Model):
    __tablename__ = "reviews"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    recipe_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("recipes.id")), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    review = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=func.now())

    recipe = db.relationship("Recipe", back_populates="reviews")
    author = db.relationship("User", back_populates="reviews")


    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "recipe_id": self.recipe_id,
            "rating": self.rating,
            "review": self.review,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }


    def to_dict_summary(self):
        return {
            "author": self.author.to_dict(),
            "rating": self.rating,
            "review": self.review,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
