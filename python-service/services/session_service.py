from models import PropertyPreferences


# -----------------------------------
# Get existing session from MongoDB
# -----------------------------------
async def get_session_preferences(
    database,
    session_id: str
):
    collection = database["property_sessions"]

    session = await collection.find_one(
        {
            "session_id": session_id
        }
    )

    # Agar session nahi mila to blank preferences
    if session is None:
        return PropertyPreferences()

    preferences_data = session.get(
        "preferences",
        {}
    )

    return PropertyPreferences(
        **preferences_data
    )


# -----------------------------------
# Save / Update session in MongoDB
# -----------------------------------
async def save_session_preferences(
    database,
    session_id: str,
    preferences: PropertyPreferences
):
    collection = database["property_sessions"]

    await collection.update_one(
        {
            "session_id": session_id
        },
        {
            "$set": {
                "preferences": preferences.model_dump()
            }
        },
        upsert=True
    )