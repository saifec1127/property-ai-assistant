from models import PropertyPreferences
from parsers import extract_plot_size


# -----------------------------------
# Process Land-specific information
# -----------------------------------
def process_land_preferences(
    message: str,
    preferences: PropertyPreferences
):

    # Detect plot size
    plot_size = extract_plot_size(message)

    if plot_size is not None:
        preferences.plot_size = plot_size

    return preferences


# -----------------------------------
# Find missing Land fields
# -----------------------------------
def get_land_missing_fields(
    preferences: PropertyPreferences
):

    missing_fields = []

    if preferences.plot_size is None:
        missing_fields.append("plot_size")

    if preferences.purpose is None:
        missing_fields.append("purpose")

    return missing_fields


# -----------------------------------
# Generate grouped Land question
# -----------------------------------
def get_land_next_question(
    missing_fields: list[str]
):

    if (
        "budget" in missing_fields
        and "plot_size" in missing_fields
        and "purpose" in missing_fields
    ):
        return (
            "What is your approximate budget, preferred plot size, "
            "and is the property for self-use or investment?"
        )

    if (
        "budget" in missing_fields
        and "plot_size" in missing_fields
    ):
        return (
            "What is your approximate budget and preferred plot size?"
        )

    if "budget" in missing_fields:
        return "What is your approximate budget?"

    if "plot_size" in missing_fields:
        return "What plot size are you looking for?"

    if "purpose" in missing_fields:
        return "Is the property for self-use or investment?"

    return None