import "dotenv/config";

import {
  askHiba,
} from "./askHiba";


async function run() {
  const question =
    "Who is Hiba's father?";

  const sessionId =
    "pinecone-father-test";


  console.log(
    "\n======================"
  );

  console.log(
    "PINECONE RAG TEST"
  );

  console.log(
    "======================"
  );


  console.log(
    "\nQuestion:"
  );

  console.log(question);


  const answer =
    await askHiba(
      question,
      sessionId
    );


  console.log(
    "\nAI Answer:"
  );

  console.log(answer);


  console.log(
    "\n======================"
  );
}


run().catch((error) => {
  console.error(
    "Test failed:",
    error
  );
});