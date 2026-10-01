from fastapi import FastAPI

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


app = FastAPI()


# -----------------------------------
# Temporary Session Store
#
# Production me later MongoDB / Redis use karenge.
# -----------------------------------
sessions = {}


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
# Property Intake API
# -----------------------------------
@app.post("/intake")
def intake(request: PropertyIntakeRequest):

    # JavaScript:
    # request.message.toLowerCase()
    #
    # Python:
    message = request.message.lower()

    # -----------------------------------
    # Get existing session
    # or create new preferences
    # -----------------------------------
    preferences = sessions.get(
        request.session_id,
        PropertyPreferences()
    )

    # -----------------------------------
    # Property Type Detection
    # -----------------------------------
    if "plot" in message or "land" in message:
        preferences.property_type = "land"

    elif "flat" in message or "apartment" in message:
        preferences.property_type = "flat"

    # -----------------------------------
    # Common Location Detection
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
    # Common Missing Fields
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
    # Property-specific Missing Fields
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

    # First priority:
    # property type missing
    if preferences.property_type is None:

        next_question = (
            "Are you looking for a plot/land or a flat, "
            "and which city and preferred area are you interested in?"
        )

    # Second priority:
    # location incomplete
    elif preferences.city is None or preferences.area is None:

        next_question = (
            "Which city and preferred area are you interested in?"
        )

    # Land-specific question
    elif preferences.property_type == "land":

        next_question = get_land_next_question(
            missing_fields
        )

    # Flat-specific question
    elif preferences.property_type == "flat":

        next_question = get_flat_next_question(
            missing_fields
        )

    # -----------------------------------
    # Check if enough data exists
    # -----------------------------------
    ready_for_recommendation = (
        len(missing_fields) == 0
    )

    # -----------------------------------
    # Save current session
    # -----------------------------------
    sessions[request.session_id] = preferences

    # -----------------------------------
    # Send API response
    # -----------------------------------
    return {
        "session_id": request.session_id,
        "message": request.message,
        "preferences": preferences,
        "missing_fields": missing_fields,
        "next_question": next_question,
        "ready_for_recommendation": ready_for_recommendation
    }