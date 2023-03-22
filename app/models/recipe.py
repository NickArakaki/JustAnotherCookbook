from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone
from sqlalchemy.sql import func

class Recipe(db.Model):
    __tablename__ = "recipes"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    author_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    title = db.Column(db.String, nullable=False)
    total_time = db.Column(db.Integer, nullable=False)
    description = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=func.now())

    reviews = db.relationship("Review", back_populates="recipe", cascade="all, delete-orphan")
    author = db.relationship("User", back_populates="recipes")
    ingredients = db.relationship("Ingredient", back_populates="recipe", cascade="all, delete-orphan")
    methods = db.relationship("Method", back_populates="recipe", cascade="all, delete-orphan")


    def to_dict(self):
        return {
            "id": self.id,
            "author_id": self.author_id,
            "title": self.title,
            "total_time": self.total_time,
            "description": self.description
        }


    def to_dict_detailed(self):
        return {
            "id": self.id,
            "author": self.author.to_dict(),
            "title": self.title,
            "total_time": self.total_time,
            "description": self.description,
            "ingredients": [ingredient.to_dict() for ingredient in self.ingredients],
            "methods": [method.to_dict() for method in self.methods],
            "reviews": [review.to_dict_summary() for review in self.reviews]
        }
