
const AWS = require('aws-sdk');

const POLLING_INTERVAL = 1000;

const sqs = new AWS.SQS();

setInterval(() => {
  const item = createItem();
  console.log(item);
  const params = {
    QueueUrl: 'https://ap-southeast-2.queue.amazonaws.com/650892143834/play--rx',
    MessageBody: item
  };
  sqs.sendMessage(params).promise().catch(e => {
    console.error(e.stack);
    process.exit(1);
  });
}, POLLING_INTERVAL);

function createItem() {
  const integer = Math.floor(Math.random() * 10000);
  const decimalLength = String(integer).length;
  return `ITEM_${'0'.repeat(4 - decimalLength)}${integer}`;
}
