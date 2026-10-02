import os

from dotenv import load_dotenv
from pymongo import AsyncMongoClient


load_dotenv()


MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_DB_NAME = os.getenv(
    "MONGODB_DB_NAME",
    "property_ai"
)


if not MONGODB_URI:
    raise ValueError("MONGODB_URI is missing")


def create_mongo_client():
    return AsyncMongoClient(
        MONGODB_URI,
        serverSelectionTimeoutMS=5000,
        maxPoolSize=50
    )