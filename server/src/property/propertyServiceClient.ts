const PROPERTY_SERVICE_URL =
  process.env.PROPERTY_SERVICE_URL;

if (!PROPERTY_SERVICE_URL) {
  throw new Error(
    "PROPERTY_SERVICE_URL is missing"
  );
}

export type PropertyIntakeResponse = {
  session_id: string;

  preferences: {
    property_type: string | null;
    city: string | null;
    area: string | null;

    budget_min: number | null;
    budget_max: number | null;

    purpose: string | null;

    plot_size: number | null;

    bhk: number | null;
    furnishing: string | null;
    parking_required: boolean | null;
  };

  missing_fields: string[];

  next_question: string | null;

  ready_for_recommendation: boolean;
};


export async function processPropertyIntake(
  sessionId: string,
  message: string
): Promise<PropertyIntakeResponse> {

  const response = await fetch(
    `${PROPERTY_SERVICE_URL}/intake`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        session_id: sessionId,
        message
      })
    }
  );

  if (!response.ok) {
    throw new Error(
      `Property service failed: ${response.status}`
    );
  }

  return response.json();
}

export async function getPropertyRecommendations(
  sessionId: string
) {

  const response = await fetch(
    `${PROPERTY_SERVICE_URL}/recommendations/${sessionId}`
  );

  if (!response.ok) {
    throw new Error(
      `Property recommendation service failed: ${response.status}`
    );
  }

  return response.json();
}