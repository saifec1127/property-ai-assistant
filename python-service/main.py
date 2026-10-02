from contextlib import asynccontextmanager

from fastapi import FastAPI

from db.mongodb import (
    create_mongo_client,
    MONGODB_DB_NAME
)

from models import (
    PropertyIntakeRequest,
    PropertyPreferences
)

from parsers import (
    extract_budget_range,
    extract_city_and_area,
    extract_purpose
)

from services.land_service import (
    process_land_preferences,
    get_land_missing_fields,
    get_land_next_question
)

from services.flat_service import (
    process_flat_preferences,
    get_flat_missing_fields,
    get_flat_next_question
)

from services.session_service import (
    get_session_preferences,
    save_session_preferences
)

from services.property_service import (
    find_matching_properties
)


# -----------------------------------
# FastAPI Lifespan
# MongoDB connection startup/shutdown
# -----------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):

    mongo_client = create_mongo_client()

    database = mongo_client[MONGODB_DB_NAME]

    # MongoDB connection test
    await database.command("ping")

    # Save DB references in FastAPI app
    app.state.mongo_client = mongo_client
    app.state.database = database

    print("MongoDB Atlas connected")

    yield

    # Application shutdown
    await mongo_client.close()

    print("MongoDB connection closed")


# -----------------------------------
# Create FastAPI Application
# IMPORTANT:
# Routes must come AFTER this
# -----------------------------------
app = FastAPI(
    lifespan=lifespan
)


# -----------------------------------
# Health Check
# -----------------------------------
@app.get("/health")
def health():

    return {
        "status": "ok",
        "service": "property-preference-service"
    }


# -----------------------------------
# Get Property Recommendations
# -----------------------------------
@app.get("/recommendations/{session_id}")
async def get_recommendations(session_id: str):

    database = app.state.database

    preferences = await get_session_preferences(
        database,
        session_id
    )

    properties = await find_matching_properties(
        database,
        preferences
    )

    top_properties = properties[:5]

    return {
        "session_id": session_id,
        "preferences": preferences,
        "total_matches": len(properties),
        "recommendations": top_properties
    }


# -----------------------------------
# Property Intake API
# -----------------------------------
@app.post("/intake")
async def intake(request: PropertyIntakeRequest):

    message = request.message.lower()

    database = app.state.database

    # -----------------------------------
    # Get existing preferences from MongoDB
    # -----------------------------------
    preferences = await get_session_preferences(
        database,
        request.session_id
    )

    # -----------------------------------
    # Property Type Detection
    # -----------------------------------
    if "plot" in message or "land" in message:
        preferences.property_type = "land"

    elif "flat" in message or "apartment" in message:
        preferences.property_type = "flat"

    # -----------------------------------
    # Location Detection
    # -----------------------------------
    city, area = extract_city_and_area(message)

    if city is not None:
        preferences.city = city

    if area is not None:
        preferences.area = area

    # -----------------------------------
    # Budget Detection
    # -----------------------------------
    budget_min, budget_max = extract_budget_range(message)

    if budget_min is not None:
        preferences.budget_min = budget_min

    if budget_max is not None:
        preferences.budget_max = budget_max

    # -----------------------------------
    # Purpose Detection
    # -----------------------------------
    purpose = extract_purpose(message)

    if purpose is not None:
        preferences.purpose = purpose

    # -----------------------------------
    # Property-specific processing
    # -----------------------------------
    if preferences.property_type == "land":

        preferences = process_land_preferences(
            message,
            preferences
        )

    elif preferences.property_type == "flat":

        preferences = process_flat_preferences(
            message,
            preferences
        )

    # -----------------------------------
    # Missing Fields
    # -----------------------------------
    missing_fields = []

    if preferences.property_type is None:
        missing_fields.append("property_type")

    if preferences.city is None:
        missing_fields.append("city")

    if preferences.area is None:
        missing_fields.append("area")

    if preferences.budget_max is None:
        missing_fields.append("budget")

    # -----------------------------------
    # Property-specific missing fields
    # -----------------------------------
    if preferences.property_type == "land":

        land_missing_fields = get_land_missing_fields(
            preferences
        )

        missing_fields.extend(
            land_missing_fields
        )

    elif preferences.property_type == "flat":

        flat_missing_fields = get_flat_missing_fields(
            preferences
        )

        missing_fields.extend(
            flat_missing_fields
        )

    # -----------------------------------
    # Generate Next Question
    # -----------------------------------
    next_question = None

    if preferences.property_type is None:

        next_question = (
            "Are you looking for a plot/land or a flat, "
            "and which city and preferred area are you interested in?"
        )

    elif preferences.city is None or preferences.area is None:

        next_question = (
            "Which city and preferred area are you interested in?"
        )

    elif preferences.property_type == "land":

        next_question = get_land_next_question(
            missing_fields
        )

    elif preferences.property_type == "flat":

        next_question = get_flat_next_question(
            missing_fields
        )

    # -----------------------------------
    # Recommendation readiness
    # -----------------------------------
    ready_for_recommendation = (
        len(missing_fields) == 0
    )

    # -----------------------------------
    # Save preferences in MongoDB
    # -----------------------------------
    await save_session_preferences(
        database,
        request.session_id,
        preferences
    )

    return {
        "session_id": request.session_id,
        "message": request.message,
        "preferences": preferences,
        "missing_fields": missing_fields,
        "next_question": next_question,
        "ready_for_recommendation": ready_for_recommendation
    }