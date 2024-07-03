from fastapi import APIRouter, Depends, HTTPException


router = APIRouter(
    prefix="/contacts",
    tags=["contacts"],
    responses={404: {"description": "Not found"}},
)
