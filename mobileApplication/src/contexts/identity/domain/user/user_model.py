from dataclasses import dataclass
import uuid

@dataclass
class Email:
    address: str

class HashedPassword:
    value: str

@dataclass
class User:
    id: uuid.UUID
    username: str
    email: Email
    password: HashedPassword

def change_password(self, new_password: HashedPassword):
    self.password = new_password