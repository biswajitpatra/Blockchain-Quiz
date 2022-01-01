import { CloudTasksClient } from "@google-cloud/tasks";
import { credentials } from "@grpc/grpc-js";

const client =
  process.env.NODE_ENV === "production"
    ? new CloudTasksClient()
    : new CloudTasksClient({
        port: 8123,
        servicePath: process.env.GCP_HOST,
        sslCreds: credentials.createInsecure(),
      });

const parent = client.queuePath(
  process.env.GCP_PROJECT_ID,
  process.env.GCP_PROJECT_LOCATION,
  process.env.GCP_QUEUE_NAME
);

export async function addQuizTask(
  uniqueTaskId,
  transactionHash,
  signedToken,
  quizId,
  startTime,
  questions,
  duration,
  answers,
  hashSalt
) {
  await client.createTask({
    parent: parent,
    task: {
      name: `projects/${process.env.GCP_PROJECT_ID}/locations/${process.env.GCP_PROJECT_LOCATION}/queues/${process.env.GCP_QUEUE_NAME}/tasks/${uniqueTaskId}-start`,
      scheduleTime: {
        seconds: parseInt(startTime),
      },
      httpRequest: {
        httpMethod: "POST",
        url: `${process.env.CLIENT_URL}/api/quiz/${quizId}/startQuiz`,
        headers: {
          "Content-Type": "application/json",
        },
        body: Buffer.from(
          JSON.stringify({ questions, transactionHash, signedToken })
        ).toString("base64"),
      },
    },
  });

  await client.createTask({
    parent: parent,
    task: {
      name: `projects/${process.env.GCP_PROJECT_ID}/locations/${process.env.GCP_PROJECT_LOCATION}/queues/${process.env.GCP_QUEUE_NAME}/tasks/${uniqueTaskId}-end`,
      scheduleTime: { seconds: parseInt(startTime) + parseInt(duration) },
      httpRequest: {
        httpMethod: "POST",
        url: `${process.env.CLIENT_URL}/api/quiz/${quizId}/sendAnswers`,
        headers: {
          "Content-Type": "application/json",
        },
        body: Buffer.from(
          JSON.stringify({
            answers,
            hashSalt,
            transactionHash,
            signedToken,
          })
        ).toString("base64"),
      },
    },
  });
}
