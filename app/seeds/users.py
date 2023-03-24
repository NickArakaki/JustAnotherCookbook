from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        username='Demo', email='demo@user.com', password='password')
    nick = User(
        username='Nick', email='nick@user.com', password='password')
    peeb = User(
        username='Peeb', email='peeb@user.com', password='password')
    gordon = User(
        username='G.Rams', email='gordon@user.com', password='password')
    joshua = User(
        username='J.Weiss', email='joshua@user.com', password='password')
    kenji = User(
        username='K.Lopez-Alt', email='kenji@user.com', password='password')

    db.session.add(demo)
    db.session.add(nick)
    db.session.add(peeb)
    db.session.add(gordon)
    db.session.add(joshua)
    db.session.add(kenji)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
