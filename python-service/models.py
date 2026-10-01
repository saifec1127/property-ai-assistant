from pydantic import BaseModel


# -----------------------------------
# Incoming API Request
# -----------------------------------
class PropertyIntakeRequest(BaseModel):
    session_id: str
    message: str


# -----------------------------------
# User Property Preferences
# -----------------------------------
class PropertyPreferences(BaseModel):
    # Common fields
    property_type: str | None = None
    city: str | None = None
    area: str | None = None

    budget_min: int | None = None
    budget_max: int | None = None

    purpose: str | None = None

    # Land specific fields
    plot_size: int | None = None

    # Flat specific fields
    bhk: int | None = None
    furnishing: str | None = None
    parking_required: bool | None = None