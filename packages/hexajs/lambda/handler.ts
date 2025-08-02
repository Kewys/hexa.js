import awsLambdaFastify from "aws-lambda-fastify";
import app from "./server";

export const proxy = awsLambdaFastify(app);
