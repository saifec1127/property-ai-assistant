from models import PropertyPreferences


# -----------------------------------
# Process Flat-specific information
# -----------------------------------
def process_flat_preferences(
    message: str,
    preferences: PropertyPreferences
):

    # BHK Detection
    if "1bhk" in message or "1 bhk" in message:
        preferences.bhk = 1

    elif "2bhk" in message or "2 bhk" in message:
        preferences.bhk = 2

    elif "3bhk" in message or "3 bhk" in message:
        preferences.bhk = 3

    # Furnishing Detection
    if (
        "semi furnished" in message
        or "semi-furnished" in message
    ):
        preferences.furnishing = "semi_furnished"

    elif "unfurnished" in message:
        preferences.furnishing = "unfurnished"

    elif "furnished" in message:
        preferences.furnishing = "furnished"

    # Parking Detection
    if (
        "parking required" in message
        or "need parking" in message
        or "parking needed" in message
    ):
        preferences.parking_required = True

    elif (
        "no parking" in message
        or "parking not required" in message
    ):
        preferences.parking_required = False

    return preferences


# -----------------------------------
# Find missing Flat fields
# -----------------------------------
def get_flat_missing_fields(
    preferences: PropertyPreferences
):

    missing_fields = []

    if preferences.bhk is None:
        missing_fields.append("bhk")

    if preferences.furnishing is None:
        missing_fields.append("furnishing")

    return missing_fields


# -----------------------------------
# Generate grouped Flat question
# -----------------------------------
def get_flat_next_question(
    missing_fields: list[str]
):

    if (
        "budget" in missing_fields
        and "bhk" in missing_fields
        and "furnishing" in missing_fields
    ):
        return (
            "What is your approximate budget, how many BHK do you need, "
            "and do you prefer furnished, semi-furnished, or unfurnished?"
        )

    if (
        "budget" in missing_fields
        and "bhk" in missing_fields
    ):
        return (
            "What is your approximate budget and how many BHK do you need?"
        )

    if "budget" in missing_fields:
        return "What is your approximate budget?"

    if "bhk" in missing_fields:
        return "How many bedrooms do you need?"

    if "furnishing" in missing_fields:
        return (
            "Do you prefer furnished, semi-furnished, or unfurnished?"
        )

    return None