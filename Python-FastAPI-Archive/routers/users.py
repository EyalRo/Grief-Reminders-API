import os
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated
from jose import JWTError, jwt

from ..db import crud, schemas

ALGORITHM = "HS256"
SECRET_KEY = os.getenv("SECRET_KEY")
ISSUER = os.getenv("ISSUER")

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


@router.get("/")
def get_user_data(token: Annotated[str, Depends(oauth2_scheme)]):

    if SECRET_KEY is None:
        raise HTTPException(status_code=500, detail="!!! No Secret Key !!!")
    try:
        payload = jwt.decode(token, SECRET_KEY, issuer=ISSUER)
        user_id = payload["id"]

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    userdata = crud.get_user_by_id(user_id)
    if userdata is None:
        raise HTTPException(status_code=404, detail="User not found")
    return userdata


@router.put("/{user_id}")
async def update_user(
    request: Request,
    user_id: str,
    user: schemas.User,
    token: Annotated[str, Depends(oauth2_scheme)],
):
    if SECRET_KEY is None:
        raise HTTPException(status_code=500, detail="!!! No Secret Key !!!")
    try:
        payload = jwt.decode(token, SECRET_KEY, issuer=ISSUER)
        user_id_from_token = payload.get("id")
        if user_id_from_token != user_id:
            raise HTTPException(
                status_code=403, detail="Not authorized to update this user"
            )
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    updated_user = crud.update_user(user_id, user)
    if updated_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return updated_user
