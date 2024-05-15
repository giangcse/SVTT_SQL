from hashlib import sha3_256
from app.config import secret_key, algorithm

SECRET_KEY = secret_key
ALGORITHM = algorithm

passwd = input("Type password: ")
print(sha3_256(bytes(passwd, 'utf-8')).hexdigest())

# 28dac06a86df34adba461d94e4181b8acc21d292a0df7b14574d4467bff33644
# pssd:  admin@131299  username: adminThan;