from pydantic import BaseModel


class AuthDetailsRegistration(BaseModel):
    username: str
    emailid: str
    password: str

class AuthDetailsLogin(BaseModel):
    emailid: str
    password: str