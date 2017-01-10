
const AWS = require('aws-sdk');
const Rx = require('rx');

const POLLING_INTERVAL = 1000;
const QUEUE_URL = 'https://ap-southeast-2.queue.amazonaws.com/650892143834/play--rx';

const sqs = new AWS.SQS();

const source = Rx.Observable.create(observer => {
  const params = {QueueUrl: QUEUE_URL};
  const intervalId = setInterval(() => {
    console.log('polling');
    sqs.receiveMessage(params).promise()
      .then(data => observer.onNext(data))
      .catch(e => observer.onError(e));
  }, POLLING_INTERVAL);

  return () => {
    clearInterval(intervalId);
  };
});

const sequence = source
  .pluck('Messages')
  .flatMap(messages => Rx.Observable.from(messages))
  .do(message => processMessage(message.Body, message.MessageId));

const subscription = sequence.subscribe(
  message => {
    const params = {
      QueueUrl: QUEUE_URL,
      ReceiptHandle: message.ReceiptHandle
    };
    return sqs.deleteMessage(params);   // what happens if you return a promise? does it propagate error?
  },
  e => {
    console.error(e.stack);
  }
);

setTimeout(() => {
  subscription.dispose()
}, 5000);

function processMessage(messageContents, messageId) {
  console.log('message', messageContents);
}
