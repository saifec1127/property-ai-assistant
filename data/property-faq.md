# Property Frequently Asked Questions

## What type of properties can I search for?

You can currently search for residential properties such as:

- Flats
- Apartments
- Residential plots
- Residential land

The available options depend on the current property inventory.

---

## Which city is currently supported?

The current primary property market supported by the platform is Prayagraj, Uttar Pradesh.

Additional cities can be added later.

---

## Which areas of Prayagraj are supported?

The property database may contain listings from areas such as:

- Civil Lines
- Kareli
- Naini
- Jhunsi
- Allahpur
- George Town
- Tagore Town
- Katra
- Teliarganj
- Govindpur
- Phaphamau
- Shantipuram
- Jhalwa
- Dhoomanganj
- Rajrooppur
- Kalindipuram
- Sulem Sarai
- Mundera
- Bamrauli
- Preetam Nagar
- Lukerganj
- Ashok Nagar
- Daraganj
- Mutthiganj
- Kydganj
- Meerapur
- Arail
- Trivenipuram

Availability depends on the current inventory.

---

## Can I search properties using my budget?

Yes.

You can provide your preferred budget.

For example:

- Property under ₹40 lakh
- Flat around ₹60 lakh
- Plot between ₹30 lakh and ₹50 lakh
- 3BHK around ₹80 lakh

The recommendation service will try to find properties matching your budget.

---

## Can I search by BHK?

Yes.

For flats and apartments, you can specify configurations such as:

- 1BHK
- 2BHK
- 3BHK
- 4BHK

Example:

"I need a 3BHK flat in Kareli."

---

## Can I search by furnishing type?

Yes.

Supported furnishing preferences may include:

- Furnished
- Semi-furnished
- Unfurnished

Example:

"I need a semi-furnished 3BHK flat."

---

## Can I search for properties with parking?

Yes.

You can specify whether parking is required.

Example:

"I need a 3BHK flat with parking."

The recommendation system can use parking availability as a matching factor.

---

## Can I search for plots by size?

Yes.

You can specify the required plot size.

Example:

"I need a 1500 sq ft plot in Naini."

The system will try to find listings close to your preferred plot size.

---

## Can I search by area and budget together?

Yes.

Example:

"Show me plots in Kareli under ₹50 lakh."

The system can use both:

- Location
- Budget

to find matching properties.

---

## What happens if I do not provide enough information?

The Property AI Assistant may ask a follow-up question.

Example:

User:

"I want to buy a property."

Assistant:

"Which city and preferred area are you interested in?"

The assistant can continue collecting information until enough details are available for property recommendations.

---

## What information is useful for property recommendations?

Useful information includes:

- Property type
- City
- Preferred area
- Budget
- BHK
- Furnishing preference
- Parking requirement
- Plot size
- Property purpose

You do not always need to provide all information in one message.

The assistant can collect missing information during the conversation.

---

## How are properties ranked?

Properties may be ranked based on how closely they match the user's preferences.

Matching factors can include:

- Location
- Budget
- BHK
- Plot size
- Furnishing
- Parking
- Property purpose

Properties with a higher match score are normally shown before lower-scoring properties.

---

## Does the AI create property listings?

No.

The AI should only recommend properties available in the current property database.

It should not invent:

- Properties
- Prices
- Locations
- Amenities
- Availability
- Plot sizes
- BHK information

---

## Are property prices final?

No.

The price shown represents the price stored in the current property inventory.

The final transaction price may change because of:

- Negotiation
- Seller decision
- Property condition
- Market conditions
- Transaction costs

Users should confirm the final price before making a purchase decision.

---

## Does the listed property price include registration charges?

Not necessarily.

Unless explicitly mentioned in the property data, the listing price should not be assumed to include:

- Registration charges
- Stamp duty
- Brokerage
- Legal fees
- Loan charges
- Other transaction expenses

---

## Can the assistant tell me about a locality?

Yes, if information about that locality exists in the property knowledge base.

Example questions:

- Tell me about Kareli.
- What property options are available in Naini?
- Tell me about Civil Lines property options.
- Which property categories are available in Jhunsi?

The response should use available locality information and should not invent unsupported facts.

---

## Can I compare multiple properties?

Yes.

If multiple matching properties are available, the assistant can explain differences such as:

- Price
- Location
- BHK
- Furnishing
- Parking
- Plot size
- Match score

---

## What if no exact property matches my requirement?

The assistant may show the nearest available matches.

For example, if the user requests:

"3BHK under ₹70 lakh"

and no exact property exists, the system may show close alternatives while clearly explaining the differences.

---

## Can I ask follow-up questions?

Yes.

The assistant maintains conversation context within the same chat session.

Example:

User:

"I need a flat in Kareli."

Assistant:

"What is your budget?"

User:

"Around ₹65 lakh."

The second message is treated as part of the same property search.

---

## Why does the assistant ask multiple questions?

The assistant asks follow-up questions when important property preferences are missing.

This improves recommendation accuracy and avoids making assumptions about user requirements.

---

## Can I search using natural language?

Yes.

You do not need to use a fixed search format.

Examples:

- "I need a flat."
- "Show me a 3BHK in Kareli."
- "Anything around 60 lakh?"
- "I need parking."
- "Show me a plot in Naini."
- "I want land around 1500 square feet."

The AI system interprets these requirements and uses them for property search.

---

## Does the system use AI?

Yes.

AI may be used for:

- Understanding natural-language questions
- Rewriting follow-up questions
- Semantic property knowledge retrieval
- Generating user-friendly responses
- Validating generated answers

Structured property matching is handled separately to improve accuracy.

---

## What is semantic search?

Semantic search tries to understand the meaning of a user's question instead of matching only exact words.

For example:

"Tell me about homes available in Kareli."

may retrieve information containing terms such as:

- flats
- residential property
- apartment
- housing

even if the exact word "homes" is not present.

---

## What is RAG?

RAG stands for Retrieval-Augmented Generation.

In this application:

1. The user's question is processed.
2. Relevant property information is retrieved from the knowledge base.
3. The retrieved information is provided to the language model.
4. The language model generates an answer using that context.

This helps reduce unsupported answers.

---

## Where does structured property data come from?

Structured property listings are stored in the application's property database.

This can include:

- MongoDB property records
- Property IDs
- Prices
- Locations
- BHK
- Furnishing
- Parking
- Availability
- Plot size

---

## Where does general property information come from?

General property information is stored in the property knowledge base.

It may contain:

- Location descriptions
- FAQs
- Company information
- Property terminology
- General buying information

This information can be converted into embeddings and stored in a vector database such as Pinecone.

---

## Can the system use MongoDB and Pinecone together?

Yes.

MongoDB is useful for structured filtering such as:

- Price
- BHK
- Plot size
- Parking
- Availability

Pinecone is useful for semantic retrieval from unstructured property information.

Some questions may use one source, while other questions may combine information from both sources.

---

## Example of structured search

User:

"Show me a 3BHK flat in Kareli under ₹70 lakh with parking."

This type of query is suitable for structured property filtering.

---

## Example of semantic search

User:

"Tell me about property options in Kareli."

This type of query can use property knowledge stored in the vector database.

---

## Can both structured search and semantic search be used together?

Yes.

Example:

"Show me a plot under ₹50 lakh in Kareli and also tell me about the area."

The system may:

1. Retrieve suitable plots from structured property data.
2. Retrieve Kareli information from the semantic knowledge base.
3. Combine both sources.
4. Generate one final response.

---

## Does the assistant answer unrelated questions?

The assistant is designed specifically for property assistance.

If a user asks an unrelated question such as:

"Who is Virat Kohli?"

the assistant should politely explain that the question is outside the property assistance scope and suggest property-related questions.

For example:

"You can ask me to find a flat, search plots by budget, compare property options, or explore locations in Prayagraj."

---

## What should I ask the Property AI Assistant?

You can ask questions such as:

- Show me flats in Kareli.
- Find a 3BHK under ₹70 lakh.
- Show me residential plots in Naini.
- I need a plot around 1500 sq ft.
- Find a semi-furnished flat with parking.
- What property options are available in Civil Lines?
- Compare these properties.
- Show me properties according to my budget.
- Tell me about supported property locations in Prayagraj.