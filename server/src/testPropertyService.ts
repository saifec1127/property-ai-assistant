import "dotenv/config";

import {
  processPropertyIntake,
  getPropertyRecommendations
} from "./property/propertyServiceClient";


async function run() {

  const sessionId = "node-python-test-1";

  const intakeResult =
    await processPropertyIntake(
      sessionId,
      "I need a 3BHK flat in Sector 137 Noida around 80 lakh"
    );

  console.log(
    "Intake Result:",
    intakeResult
  );

  if (
    intakeResult.ready_for_recommendation
  ) {

    const recommendations =
      await getPropertyRecommendations(
        sessionId
      );

    console.log(
      "Recommendations:",
      recommendations
    );
  }
}


run().catch((error) => {
  console.error(error);
});