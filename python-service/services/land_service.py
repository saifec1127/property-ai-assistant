from models import PropertyPreferences
from parsers import extract_plot_size


# -----------------------------------
# Process Land-specific information
# -----------------------------------
def process_land_preferences(
    message: str,
    preferences: PropertyPreferences
):
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


# -----------------------------------
# Calculate Land Match Score
# -----------------------------------
def calculate_land_score(
    property_item: dict,
    preferences: PropertyPreferences
):
    score = 0

    # Area = 35 points
    if (
        preferences.area is not None
        and property_item.get("area") == preferences.area
    ):
        score += 35

    # Budget = maximum 30 points
    price = property_item.get("price")

    if (
        price is not None
        and preferences.budget_max is not None
    ):

        if price <= preferences.budget_max:
            score += 30

        else:
            difference = price - preferences.budget_max

            percentage_over = (
                difference / preferences.budget_max
            ) * 100

            if percentage_over <= 5:
                score += 20

            elif percentage_over <= 10:
                score += 10

    # Plot size = maximum 25 points
    property_size = property_item.get("plot_size")

    if (
        property_size is not None
        and preferences.plot_size is not None
    ):

        size_difference = abs(
            property_size - preferences.plot_size
        )

        if size_difference == 0:
            score += 25

        elif size_difference <= 100:
            score += 22

        elif size_difference <= 250:
            score += 15

        elif size_difference <= 500:
            score += 8

    # Purpose = 10 points
    if (
        preferences.purpose == "self_use"
        and property_item.get("purpose") == "residential"
    ):
        score += 10

    elif preferences.purpose == "investment":
        score += 5

    return score