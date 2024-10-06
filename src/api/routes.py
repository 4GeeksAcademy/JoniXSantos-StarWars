"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import datetime
from api.models import db, Users, Posts, Comments, Medias, Followers, Characters, FavoriteCharacters, Planets, FavoritePlanets, Starships, FavoriteStarships
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
import requests

api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API


@api.route('/hello', methods=['GET'])
def handle_hello():
    response_body = {}
    response_body['message'] = "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    return response_body, 200


@api.route("/login", methods=["POST"])
def login():
    response_body = {}
    data = request.json
    email = data.get("email", None)
    password = data.get("password", None)
    user = db.session.execute(db.select(Users).where(Users.email == email, Users.password == password, Users.is_active)).scalar()
    if not user:
        response_body['message'] = "Bad email or password"
        return response_body, 401
    access_token = create_access_token(identity={'email': user.email, 'user_id': user.id, 'is_active': user.is_active, 'is_admin': user.is_admin})
    response_body['message'] = f'Welcome, {email}'
    response_body['access_token'] = access_token
    response_body['results'] = user.serialize()
    return response_body, 200


@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    response_body = {}
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    response_body['logged_in_as'] = current_user
    return response_body, 200


@api.route('/users', methods=['GET', 'POST'])
def users():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Users)).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = 'List of the users and their posts (GET)'
        response_body['results'] = result
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        if not data.get('email') or not data.get('password'):
            response_body['message'] = 'Email or password required'
            return response_body, 400
        row = Users(email = data.get('email'),
                    password = data.get('password'),
                    is_active = data.get('is_active', True),
                    is_admin = data.get('is_admin', False),
                    first_name = data.get('first_name'),
                    last_name = data.get('last_name'))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = 'A new user was added to the data base (POST)'
        response_body['results'] = row.serialize()
        return response_body, 200


@api.route('/users/<int:id>', methods=['GET'])
def user(id):
    response_body = {}
    row = db.session.execute(db.select(Users)).where(Users.id == id).scalar()
    if not row:
        response_body['message'] = f'The user no. {id} does not exist'
        response_body['results'] = {}
        return response_body, 404
    if request.method == 'GET':
        response_body['message'] = f'This is the user no. {id} (GET)'
        response_body['results'] = row.serialize()
        return response_body, 200


@api.route('/posts', methods=['GET', 'POST'])
def posts():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Posts)).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = 'List of the posts (GET)'
        response_body['results'] = result
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        row = Posts(title = data.get('title'),
                    description = data.get('description'),
                    body = data.get('body'),
                    date = datetime.now(),
                    image_url = data.get('image_url'),
                    user_id = data.get('user_id'))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = 'A new post is created (POST)'
        response_body['results'] = row.serialize()
        return response_body, 200
    

@api.route('/users/<int:id>/posts', methods=['GET'])
def posts_by_user(id):
    response_body = {}
    rows = db.session.execute(db.select(Posts)).where(user_id = id).scalars()
    result = [row.serialize() for row in rows]
    response_body['message'] = f'List of the posts written by user no. {id} (GET)'
    response_body['results'] = result
    return response_body, 200
    

@api.route('/posts/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def post(id):
    response_body = {}
    row = db.session.execute(db.select(Posts)).where(Posts.id == id).scalar()
    if not row:
        response_body['message'] = f'The post no. {id} does not exist'
        response_body['results'] = {}
        return response_body, 404
    current_user = get_jwt_identity()
    if row.user_id != current_user['user_id']:
        response_body['message'] = f'You cannot change this post'
        response_body['results'] = {}
        return response_body, 404
    if request.method == 'GET':
        response_body['message'] = f'This is the post no. {id} (GET)'
        response_body['results'] = row.serialize()
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        row.title = data.get('title')
        row.description = data.get('description')
        row.body = data.get('body')
        row.date = datetime.now()
        row.image_url = data.get('image_url')
        row.user_id = data.get('user_id')
        db.session.commit()
        response_body['message'] = f'The post no. {id} is successfully edited (PUT)'
        response_body['results'] = row.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = f'The post no. {id} is sucessfully deleted (DELETE)'
        response_body['results'] = {}
        return response_body, 200


@api.route('/comments', methods=['GET', 'POST'])
def comments():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Comments)).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = 'List of the comments (GET)'
        response_body['results'] = result
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        row = Comments(body = data.get('body'),
                       user_id = data.get('user_id'),
                       post_id = data.get('post_id'))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = 'Your comment is posted (POST)'
        response_body['results'] = row.serialize()
        return response_body, 200


@api.route('/posts/<int:id>/comments', methods=['GET'])
def comments_in_post(id):
    response_body = {}
    rows = db.session.execute(db.select(Comments)).where(post_id = id).scalars()
    result = [row.serialize() for row in rows]
    response_body['message'] = f'List of the comments in the post no. {id} (GET)'
    response_body['results'] = result
    return response_body, 200


@api.route('/users/<int:id>/comments', methods=['GET'])
def comments_by_user(id):
    response_body = {}
    rows = db.session.execute(db.select(Comments)).where(user_id = id).scalars()
    result = [row.serialize() for row in rows]
    response_body['message'] = f'List of the comments written by user no. {id} (GET)'
    response_body['results'] = result
    return response_body, 200
    

@api.route('/comments/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def comment(id):
    response_body = {}
    row = db.session.execute(db.select(Comments)).where(Comments.id == id).scalar()
    if not row:
        response_body['message'] = f'The comment no. {id} does not exist'
        response_body['results'] = {}
        return response_body, 404
    if request.method == 'GET':
        response_body['message'] = f'This is the comment no. {id} (GET)'
        response_body['results'] = row.serialize()
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        row.body = data.get('body'),
        row.user_id = data.get('user_id')
        row.post_id = data.get('post_id')
        db.session.commit()
        response_body['message'] = f'The comment no. {id} is successfully edited (PUT)'
        response_body['results'] = row.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = f'The comment no. {id} is sucessfully deleted (DELETE)'
        response_body['results'] = {}
        return response_body, 200
    

@api.route('/medias', methods=['GET', 'POST'])
def medias():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Medias)).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = 'List of the medias (GET)'
        response_body['results'] = result
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        row = Medias(media_type = data.get('media_type'),
                     url = data.get('url'),
                     post_id = data.get('post_id'))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = 'The media is attached (POST)'
        response_body['results'] = row.serialize()
        return response_body, 200


@api.route('/medias/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def media(id):
    response_body = {}
    row = db.session.execute(db.select(Medias)).where(Medias.id == id).scalar()
    if not row:
        response_body['message'] = f'The media no. {id} does not exist'
        response_body['results'] = {}
        return response_body, 404
    if request.method == 'GET':
        response_body['message'] = f'This is the media no. {id} (GET)'
        response_body['results'] = row.serialize()
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        row.media_type = data.get('media_type')
        row.url = data.get('url')
        row.post_id = data.get('post_id')
        db.session.commit()
        response_body['message'] = f'The media no. {id} is successfully edited (PUT)'
        response_body['results'] = row.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = f'The media no. {id} is sucessfully deleted (DELETE)'
        response_body['results'] = {}
        return response_body, 200
    

@api.route('/followers', methods=['GET', 'POST'])
def followers():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Followers)).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = 'List of the followers (GET)'
        response_body['results'] = result
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        row = Followers(following_id = data.get('following_id'),
                        follower_id = data.get('follower_id'))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = f'You are now following a new user (POST)'
        response_body['results'] = row.serialize()
        return response_body, 200
    

@api.route('/followers/<int:id>', methods=['DELETE'])
def follower():
    response_body = {}
    row = db.session.execute(db.select(Followers)).where(Followers.id == id).scalar()
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = f'You are no longer following this user (DELETE)'
        response_body['results'] = {}
        return response_body, 200
    

@api.route('/users/<int:id>/followers', methods=['GET'])
def user_followers(id):
    response_body = {}
    rows = db.session.execute(db.select(Followers)).where(follower_id = id).scalars()
    result = [row.serialize() for row in rows]
    response_body['message'] = f'List of the followers of the user no. {id} (GET)'
    response_body['results'] = result
    return response_body, 200


@api.route('/users/<int:id>/following', methods=['GET'])
def user_following(id):
    response_body = {}
    rows = db.session.execute(db.select(Followers)).where(following_id = id).scalars()
    result = [row.serialize() for row in rows]
    response_body['message'] = f'List of the users following user no. {id} (GET)'
    response_body['results'] = result
    return response_body, 200
    

@api.route('/characters', methods=['GET'])
def characters():
    response_body = {}
    rows = db.session.execute(db.select(Characters)).scalars()
    result = [row.serialize() for row in rows]
    if len(result) == 0:
        url = 'https://swapi.tech/api/people'
        response = requests.get(url)
        if response.status_code != 200:
            response_body['message'] = 'Error fetching data from SWAPI'
            return response_body, 502
        data = response.json()
        total_records = data['total_records']
        for i in range(1, total_records + 1):
            character_url = f'https://swapi.tech/api/people/{i}'
            character_response = requests.get(character_url)
            if character_response.status_code == 200:
                character_data = character_response.json()['result']['properties']
                new_character = Characters(name=character_data['name'],
                                           height=character_data['height'],
                                           mass=character_data['mass'],
                                           hair_color=character_data['hair_color'],
                                           skin_color=character_data['skin_color'],
                                           eye_color=character_data['eye_color'],
                                           birth_year=character_data['birth_year'],
                                           gender=character_data['gender']
                                           )
                db.session.add(new_character)
        db.session.commit()
        rows = db.session.execute(db.select(Characters)).scalars()
        result = [row.serialize() for row in rows]
    response_body['message'] = 'List of the characters (GET)'
    response_body['results'] = result
    return response_body, 200
    

@api.route('/characters/<int:id>', methods=['GET'])
def character(id):
    response_body = {}
    row = db.session.execute(db.select(Characters)).where(Characters.id == id).scalar()
    if not row:
        response_body['message'] = f'The character no. {id} does not exist'
        response_body['results'] = {}
        return response_body, 404
    if request.method == 'GET':
        response_body['message'] = f'This is the character no. {id} (GET)'
        response_body['results'] = row.serialize()
        return response_body, 200
    

@api.route('/favorite-characters', methods=['GET', 'POST'])
def favorite_characters():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(FavoriteCharacters)).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = 'List of all favorite characters (GET)'
        response_body['results'] = result
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        row = FavoriteCharacters(user_id = data.get('user_id'),
                                 character_id = data.get('character_id'))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = 'You have a new favorite character (POST)'
        response_body['results'] = row.serialize()
        return response_body, 200
    

@api.route('/favorite-characters/<int:id>', methods=['DELETE'])
def favorite_character():
    response_body = {}
    row = db.session.execute(db.select(FavoriteCharacters)).where(FavoriteCharacters.id == id).scalar()
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = f'This character was removed from your favorites (DELETE)'
        response_body['results'] = {}
        return response_body, 200
    

@api.route('/users/<int:id>/favorite-characters', methods=['GET'])
def user_favorite_characters(id):
    response_body = {}
    rows = db.session.execute(db.select(FavoriteCharacters)).where(user_id = id).scalars()
    result = [row.serialize() for row in rows]
    response_body['message'] = f'List of the favorite characters of the user no. {id} (GET)'
    response_body['results'] = result
    return response_body, 200
    

@api.route('/planets', methods=['GET'])
def planets():
    response_body = {}
    rows = db.session.execute(db.select(Planets)).scalars()
    result = [row.serialize() for row in rows]
    if len(result) == 0:
        url = 'https://swapi.tech/api/planets'
        response = requests.get(url)
        if response.status_code != 200:
            response_body['message'] = 'Error fetching data from SWAPI'
            return response_body, 502
        data = response.json()
        total_records = data['total_records']
        for i in range(1, total_records + 1):
            planet_url = f'https://swapi.tech/api/planets/{i}'
            planet_response = requests.get(planet_url)
            if planet_response.status_code == 200:
                planet_data = planet_response.json()['result']['properties']
                new_planet = Planets(name=planet_data['name'],
                                     diameter=planet_data['diameter'],
                                     rotation_period=planet_data['rotation_period'],
                                     orbital_period=planet_data['orbital_period'],
                                     gravity=planet_data['gravity'],
                                     population=planet_data['population'],
                                     climate=planet_data['climate'],
                                     terrain=planet_data['terrain']
                                    )
                db.session.add(new_planet)
        db.session.commit()
        rows = db.session.execute(db.select(Planets)).scalars()
        result = [row.serialize() for row in rows]
    response_body['message'] = 'List of the planets (GET)'
    response_body['results'] = result
    return response_body, 200
    

@api.route('/planets/<int:id>', methods=['GET'])
def planet(id):
    response_body = {}
    row = db.session.execute(db.select(Planets)).where(Planets.id == id).scalar()
    if not row:
        response_body['message'] = f'The planet no. {id} does not exist'
        response_body['results'] = {}
        return response_body, 404
    if request.method == 'GET':
        response_body['message'] = f'This is the planet no. {id} (GET)'
        response_body['results'] = row.serialize()
        return response_body, 200
    

@api.route('/favorite-planets', methods=['GET', 'POST'])
def favorite_planets():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(FavoritePlanets)).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = 'List of all favorite planets (GET)'
        response_body['results'] = result
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        row = FavoritePlanets(user_id = data.get('user_id'),
                              planet_id = data.get('planet_id'))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = 'You have a new favorite planet (POST)'
        response_body['results'] = row.serialize()
        return response_body, 200
    

@api.route('/favorite-planets/<int:id>', methods=['DELETE'])
def favorite_planet():
    response_body = {}
    row = db.session.execute(db.select(FavoritePlanets)).where(FavoritePlanets.id == id).scalar()
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = f'This planet was removed from your favorites (DELETE)'
        response_body['results'] = {}
        return response_body, 200
    

@api.route('/users/<int:id>/favorite-planets', methods=['GET'])
def user_favorite_planets(id):
    response_body = {}
    rows = db.session.execute(db.select(FavoritePlanets)).where(user_id = id).scalars()
    result = [row.serialize() for row in rows]
    response_body['message'] = f'List of the favorite planets of the user no. {id} (GET)'
    response_body['results'] = result
    return response_body, 200


@api.route('/starships', methods=['GET'])
def starships():
    response_body = {}
    rows = db.session.execute(db.select(Starships)).scalars()
    result = [row.serialize() for row in rows]
    if len(result) == 0:
        url = 'https://swapi.tech/api/starships'
        response = requests.get(url)
        if response.status_code != 200:
           response_body['message'] = 'Error fetching data from SWAPI'
           return response_body, 502
        data = response.json()
        total_records = data['total_records']
        for i in range(1, total_records + 1):
            starship_url = f'https://swapi.tech/api/starships/{i}'
            starship_response = requests.get(starship_url)
            if starship_response.status_code == 200:
                starship_data = starship_response.json()['result']['properties']
                new_starship = Starships(model=starship_data['model'],
                                         starship_class=starship_data['starship_class'],
                                         manufacturer=starship_data['manufacturer'],
                                         cost_in_credits=starship_data['cost_in_credits'],
                                         length=starship_data['length'],
                                         crew=starship_data['crew'],
                                         passengers=starship_data['passengers'],
                                         max_atmosphering_speed=starship_data['max_atmosphering_speed'],
                                         hyperdrive_rating=starship_data['hyperdrive_rating'],
                                         MGLT=starship_data['MGLT'],
                                         cargo_capacity=starship_data['cargo_capacity'],
                                         consumables=starship_data['consumables']
                                    )
                db.session.add(new_starship)
        db.session.commit()
        rows = db.session.execute(db.select(Starships)).scalars()
        result = [row.serialize() for row in rows]
    response_body['message'] = 'List of the starships (GET)'
    response_body['results'] = result
    return response_body, 200
    

@api.route('/starships/<int:id>', methods=['GET'])
def starship(id):
    response_body = {}
    row = db.session.execute(db.select(Starships)).where(Starships.id == id).scalar()
    if not row:
        response_body['message'] = f'The starship no. {id} does not exist'
        response_body['results'] = {}
        return response_body, 404
    if request.method == 'GET':
        response_body['message'] = f'This is the starship no. {id} (GET)'
        response_body['results'] = row.serialize()
        return response_body, 200
    

@api.route('/favorite-starships', methods=['GET', 'POST'])
def favorite_starships():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(FavoriteStarships)).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = 'List of all favorite starships (GET)'
        response_body['results'] = result
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        row = FavoriteStarships(user_id = data.get('user_id'),
                                starship_id = data.get('starship_id'))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = 'You have a new favorite starship (POST)'
        response_body['results'] = row.serialize()
        return response_body, 200
    

@api.route('/favorite-starships/<int:id>', methods=['DELETE'])
def favorite_starship():
    response_body = {}
    row = db.session.execute(db.select(FavoriteStarships)).where(FavoriteStarships.id == id).scalar()
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = f'This starship was removed from your favorites (DELETE)'
        response_body['results'] = {}
        return response_body, 200
    

@api.route('/users/<int:id>/favorite-starships', methods=['GET'])
def user_favorite_starships(id):
    response_body = {}
    rows = db.session.execute(db.select(FavoriteStarships)).where(user_id = id).scalars()
    result = [row.serialize() for row in rows]
    response_body['message'] = f'List of the favorite starships of the user no. {id} (GET)'
    response_body['results'] = result
    return response_body, 200
