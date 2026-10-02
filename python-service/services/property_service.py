from services.land_service import calculate_land_score
from services.flat_service import calculate_flat_score


# -----------------------------------
# Find and Rank Matching Properties
# -----------------------------------
async def find_matching_properties(
    database,
    preferences
):
    collection = database["properties"]

    # -----------------------------------
    # Hard filters
    #
    # Sirf fundamentally relevant
    # properties MongoDB se mangayenge.
    # -----------------------------------
    query = {
        "available": True
    }

    if preferences.property_type is not None:
        query["property_type"] = preferences.property_type

    if preferences.city is not None:
        query["city"] = preferences.city

    # -----------------------------------
    # Fetch candidate properties
    # -----------------------------------
    cursor = collection.find(query)

    properties = await cursor.to_list(
        length=50
    )

    ranked_properties = []

    # -----------------------------------
    # Score every property
    # -----------------------------------
    for property_item in properties:

        # Mongo ObjectId ko JSON-friendly string
        property_item["_id"] = str(
            property_item["_id"]
        )

        score = 0

        # Land scoring
        if preferences.property_type == "land":

            score = calculate_land_score(
                property_item,
                preferences
            )

        # Flat scoring
        elif preferences.property_type == "flat":

            score = calculate_flat_score(
                property_item,
                preferences
            )

        property_item["match_score"] = score

        ranked_properties.append(
            property_item
        )

    # -----------------------------------
    # Highest match score first
    # -----------------------------------
    ranked_properties.sort(
        key=lambda item: item["match_score"],
        reverse=True
    )

    return ranked_properties