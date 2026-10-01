import re


# -----------------------------------
# Extract Budget
#
# Examples:
# "50 lakh"
# "45 to 50 lakh"
# "45-50 lakh"
# "1 crore"
# "1 to 1.5 crore"
# -----------------------------------
def extract_budget_range(message: str):

    # Example: 45 to 50 lakh
    lakh_range = re.search(
        r"(\d+(?:\.\d+)?)\s*(?:to|-)\s*(\d+(?:\.\d+)?)\s*lakh",
        message
    )

    if lakh_range:
        min_value = float(lakh_range.group(1))
        max_value = float(lakh_range.group(2))

        return (
            int(min_value * 100000),
            int(max_value * 100000)
        )

    # Example: 1 to 1.5 crore
    crore_range = re.search(
        r"(\d+(?:\.\d+)?)\s*(?:to|-)\s*(\d+(?:\.\d+)?)\s*crore",
        message
    )

    if crore_range:
        min_value = float(crore_range.group(1))
        max_value = float(crore_range.group(2))

        return (
            int(min_value * 10000000),
            int(max_value * 10000000)
        )

    # Example: 50 lakh
    lakh_single = re.search(
        r"(\d+(?:\.\d+)?)\s*lakh",
        message
    )

    if lakh_single:
        value = float(lakh_single.group(1))

        return (
            None,
            int(value * 100000)
        )

    # Example: 1.5 crore
    crore_single = re.search(
        r"(\d+(?:\.\d+)?)\s*crore",
        message
    )

    if crore_single:
        value = float(crore_single.group(1))

        return (
            None,
            int(value * 10000000)
        )

    return (None, None)


# -----------------------------------
# Extract Plot Size
#
# Examples:
# 1500 sqft
# 1800 sq ft
# 2000 square feet
# -----------------------------------
def extract_plot_size(message: str):

    size_match = re.search(
        r"(\d+)\s*(?:sqft|sq ft|square feet)",
        message
    )

    if size_match:
        return int(size_match.group(1))

    return None


# -----------------------------------
# Extract common location information
# -----------------------------------
def extract_city_and_area(message: str):

    city = None
    area = None

    if "prayagraj" in message or "allahabad" in message:
        city = "Prayagraj"

    elif "noida" in message:
        city = "Noida"

    if "naini" in message:
        area = "Naini"

    elif "sector 137" in message:
        area = "Sector 137"

    return city, area


# -----------------------------------
# Extract Purpose
# -----------------------------------
def extract_purpose(message: str):

    if "investment" in message:
        return "investment"

    if (
        "self use" in message
        or "self-use" in message
        or "own house" in message
        or "own home" in message
    ):
        return "self_use"

    return None