import aws from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

aws.config.update({ region: process.env.AWS_REGION });
const sqs = new aws.SQS();
const queueUrl = process.env.AWS_QUEUE_URL || '';

export const queueMessage = async (message: any) => {
  try {
    console.log('QUEUE');
    const params = {
      MessageGroupId: message.transactionHash,
      MessageDeduplicationId: message.transactionHash,
      MessageBody: JSON.stringify(message),
      QueueUrl: queueUrl,
    };
    const queue = await sqs.sendMessage(params).promise();
    console.log(queue);
  } catch (e: any) {
    throw new Error(e.message);
  }
};
