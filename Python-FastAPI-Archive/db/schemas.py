from typing import Optional, Literal
from pydantic import BaseModel
from datetime import date

##################################
# JWT
##################################


class Token(BaseModel):
    token: str


##################################
# User Accounts
##################################


# Common for all user interactions
class UserBase(BaseModel):
    email_address: str


# Password needed for Login
class UserLoginData(UserBase):
    password: str


# All single user data
class User(UserLoginData):
    hashed_password: str
    type: Literal["user"]
    first_name: str
    last_name: str
    phone_number: Optional[str] = None
    allow_email: bool = True
    allow_phone: bool = True
    is_admin: bool = False


##################################
# Network Account (Social etc)
##################################


class NetworkAccount(BaseModel):
    type: Literal["network_account"]
    account_name: str
    last_update: date
    social_network: str
    managed_by_account: str


##################################
# Contacts
##################################


class Contact(BaseModel):
    type: Literal["contact"]
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email_address: Optional[str] = None
    phone_number: Optional[str] = None
    allow_email: bool = False
    allow_phone: bool = False
    managed_by_account: str


##################################
# Networks
##################################


class Network(BaseModel):
    type: Literal["network"]
    network_name: str
    days_to_deactivate: Optional[int] = None
    link: Optional[str] = None
    actions: Optional[str] = None
