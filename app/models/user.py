from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

users_liked_recipes = db.Table(
    "users_liked_recipes",
    db.Column("recipe_id", db.Integer, db.ForeignKey(add_prefix_for_prod("recipes.id")), primary_key=True),
    db.Column("user_id", db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), primary_key=True)
)
# Add schema to recipes_tags table in production
if environment == "production":
    users_liked_recipes = SCHEMA

class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)

    reviews = db.relationship("Review", back_populates="author")
    recipes = db.relationship("Recipe", back_populates="author")
    liked_recipes = db.relationship("Recipe", secondary=users_liked_recipes, back_populates="liked_users")

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email
        }

    def to_dict_author(self):
        return {
            "id": self.id,
            "username": self.username
        }
