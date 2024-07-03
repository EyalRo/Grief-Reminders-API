import couchdb, os, hashlib
from dotenv import load_dotenv
from fastapi import HTTPException

from ..db import schemas

load_dotenv()

DB_STRING = os.getenv("DB_STRING")


if DB_STRING:
    couch = couchdb.Server(DB_STRING)
    db = couch["inactive-account"]


####################
# Users - Retrieve
####################


async def get_user_by_email(email: str):
    mango = {
        "selector": {"type": "user", "email_address": email},
    }

    for user in db.find(mango):
        return user
    return None


def get_user_by_email_and_password(email: str, password: str):
    hashed_password = hashlib.sha256(password.encode("utf-8")).hexdigest()
    mango = {
        "selector": {
            "type": "user",
            "email_address": email,
            "password_hash": hashed_password,
        },
    }

    for user in db.find(mango):
        return user
    return None


def get_user_by_id(id: str):
    mango = {"selector": {"_id": id}}

    for user in db.find(mango):
        return user
    return None


def create_user(email: str, password: str):
    """
    Create a new user.

    Returns:
        The created user.

    Raises:
        HTTPException: If the user already exists or there is a server error.
    """
    try:
        # Check if the user already exists
        existing_user = get_user_by_email(email)
        if existing_user:
            raise HTTPException(status_code=409, detail="User already exists")

        # Create the new user
        hashed_password = hashlib.sha256(password.encode("utf-8")).hexdigest()
        user_data = dict(email_address=email, hashed_password=hashed_password)
        new_user = db.save(user_data)

        return new_user

    except Exception as e:
        raise HTTPException(status_code=500, detail="Server Error")


async def update_user(user_id: str, user: schemas.User):
    """
    Update an existing user.

    Args:
        user_id: The ID of the user to update.
        user: The updated user data.

    Returns:
        The updated user.

    Raises:
        HTTPException: If the user does not exist or there is a server error.
    """
    try:
        # Check if the user exists
        existing_user = get_user_by_id(user_id)
        if not existing_user:
            raise HTTPException(status_code=404, detail="User not found")

        # Update the user document
        db[user_id] = user

        # Fetch the updated user
        updated_user = get_user_by_id(user_id)

        return updated_user

    except Exception as e:
        raise HTTPException(status_code=500, detail="Server Error")
