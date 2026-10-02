export type PropertyPreferences = {
  property_type: "land" | "flat" | null;

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

export type PropertyRecommendation = {
  _id: string;

  property_id: string;

  property_type: "land" | "flat";

  title: string;

  city: string;
  area: string;

  price: number;

  match_score: number;

  plot_size?: number;

  bhk?: number;

  furnishing?: string;

  parking_available?: boolean;
};

export type PropertyIntakeResponse = {
  session_id: string;

  message: string;

  preferences: PropertyPreferences;

  missing_fields: string[];

  next_question: string | null;

  ready_for_recommendation: boolean;
};

export type PropertyRecommendationResponse = {
  session_id: string;

  preferences: PropertyPreferences;

  total_matches: number;

  recommendations: PropertyRecommendation[];
};
