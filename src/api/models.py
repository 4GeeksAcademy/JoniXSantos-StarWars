from flask_sqlalchemy import SQLAlchemy
from datetime import datetime


db = SQLAlchemy()


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    is_admin = db.Column(db.Boolean(), unique=False, nullable=False)
    first_name = db.Column(db.String, unique=False, nullable=True)
    last_name = db.Column(db.String, unique=False, nullable=True)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        # Do not serialize the password, its a security breach
        return {'id': self.id,
                'email': self.email,
                'is_active': self.is_active,
                'is_admin': self.is_admin,
                'first_name': self.first_name,
                'last_name': self.last_name,
                'posts': [row.serialize() for row in self.post_to]}


class Posts(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, unique=False, nullable=False)
    description = db.Column(db.String, unique=False, nullable=True)
    body = db.Column(db.String, unique=False, nullable=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    image_url = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user_to = db.relationship('Users', foreign_keys=[user_id], backref=db.backref('post_to', lazy='select'))

    def __repr__(self):
        return f'Post: {self.title}'

    def serialize(self):
        return {'id': self.id,
                'title': self.title,
                'description': self.description,
                'body': self.body,
                'date': self.data,
                'image_url': self.image_url,
                'user_id': self.user_id}


class Comments(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.String, unique=False, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True)
    user_to = db.relationship('Users', foreign_keys =[user_id], backref=db.backref('comment_to', lazy='select'))
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), unique=True)
    post_to = db.relationship('Posts', foreign_keys=[post_id], backref=db.backref('comment_to', lazy='select'))

    def __repr__(self):
        return f'Comment: {self.body}'

    def serialize(self):
        return {'id': self.id,
                'body': self.body,
                'user_id': self.user_id,
                'post_id': self.post_ïd}


class Medias(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    media_type = db.Column(db.Enum('image', 'video', 'podcast', name='media_type'))
    url = db.Column(db.String)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), unique=True)
    post_to = db.relationship('Posts', foreign_keys=[post_id], backref=db.backref('media_to', lazy='select'))

    def __repr__(self):
        return f'Media: {self.media_type} type'

    def serialize(self):
        return {'id': self.id,
                'media_type': self.media_type,
                'url': self.url,
                'post_id': self.post_id}


class Followers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    following_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    following_to = db.relationship('Users', foreign_keys=[following_id], backref=db.backref('following_to', lazy='select'))
    follower_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    follower_to = db.relationship('Users', foreign_keys=[follower_id], backref=db.backref('follower_to', lazy='select'))

    def __repr__(self):
        return f'following: {self.following_id} - follower: {self.follower_id}'

    def serialize(self):
        return {'id': self.id,
                'following_id': self.following_id,
                'follower_id': self.follower_id}


class Characters(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    height = db.Column(db.String)
    mass = db.Column(db.String)
    hair_color = db.Column(db.String)
    skin_color = db.Column(db.String)
    eye_color = db.Column(db.String)
    birth_year = db.Column(db.String)
    gender = db.Column(db.String)

    def __repr__(self):
        return f'Character: {self.name}'

    def serialize(self):
        return {'id': self.id,
                'name': self.name,
                'height': self.height,
                'mass': self.mass,
                'hair_color': self.hair_color,
                'skin_color': self.skin_color,
                'eye_color': self.eye_color,
                'birth_year': self.birth_year,
                'gender': self.gender}


class FavoriteCharacters(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user_to = db.relationship('Users', foreign_keys=[user_id], backref=db.backref('favorite_characters_to', lazy='select'))
    character_id = db.Column(db.Integer, db.ForeignKey('characters.id'))
    character_to = db.relationship('Characters', foreign_keys=[character_id], backref=db.backref('favorite_characters_to', lazy='select'))

    def __repr__(self):
        return f'Favorite Character: {self.character_to.name}'

    def serialize(self):
        return {'id': self.id,
                'user_id': self.user_id,
                'character_id': self.character_id}


class Planets(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    diameter = db.Column(db.String)
    rotation_period = db.Column(db.String)
    orbital_period = db.Column(db.String)
    gravity = db.Column(db.String)
    population = db.Column(db.String)
    climate = db.Column(db.String)
    terrain = db.Column(db.String)

    def __repr__(self):
        return f'Planet: {self.name}'

    def serialize(self):
        return {'id': self.id,
                'name': self.name,
                'diameter': self.diameter,
                'rotation_period': self.rotation_period,
                'orbital_period': self.orbital_period,
                'gravity': self.gravity,
                'population': self.population,
                'climate': self.climate,
                'terrain': self.terrain}


class FavoritePlanets(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user_to = db.relationship('Users', foreign_keys=[user_id], backref=db.backref('favorite_planets_to', lazy='select'))
    planet_id = db.Column(db.Integer, db.ForeignKey('planets.id'))
    planet_to = db.relationship('Planets', foreign_keys=[planet_id], backref=db.backref('favorite_planets_to', lazy='select'))

    def __repr__(self):
        return f'Favorite Planet: {self.planet_to.name}'

    def serialize(self):
        return {'id': self.id,
                'user_id': self.user_id,
                'planet_id': self.planet_id}


class Starships(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    model = db.Column(db.String)
    starship_class = db.Column(db.String)
    manufacturer = db.Column(db.String)
    cost_in_credits = db.Column(db.String)
    length = db.Column(db.String)
    crew = db.Column(db.String)
    passengers = db.Column(db.String)
    max_atmosphering_speed = db.Column(db.String)
    hyperdrive_rating = db.Column(db.String)
    MGLT = db.Column(db.String)
    cargo_capacity = db.Column(db.String)
    consumables = db.Column(db.String)

    def __repr__(self):
        return f'Starship: {self.model}'

    def serialize(self):
        return {'id': self.id,
                'model': self.model,
                'starship_class': self.starship_class,
                'manufacturer': self.manufacturer,
                'cost_in_credits': self.cost_in_credits,
                'length': self.length,
                'crew': self.crew,
                'passengers': self.passengers,
                'max_atmosphering_speed': self.max_atmosphering_speed,
                'hyperdrive_rating': self.hyperdrive_rating,
                'MGLT': self.MGLT,
                'cargo_capacity': self.cargo_capacity,
                'consumables': self.consumables}


class FavoriteStarships(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user_to = db.relationship('Users', foreign_keys=[user_id], backref=db.backref('favorite_starships_to', lazy='select'))
    starship_id = db.Column(db.Integer, db.ForeignKey('starships.id'))
    starship_to = db.relationship('Starships', foreign_keys=[starship_id], backref=db.backref('favorite_starships_to', lazy='select'))

    def __repr__(self):
        return f'Favorite Starship: {self.starship_to.model}'

    def serialize(self):
        return {'id': self.id,
                'user_id': self.user_id,
                'starship_id': self.starship_id}
