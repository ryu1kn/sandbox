#!/usr/bin/make

# Set AWS_PROFILE env var
QUEUE_NAME=play--rx

process-messages:
	AWS_REGION=ap-southeast-2 node process-messages

push-messages:
	AWS_REGION=ap-southeast-2 node push-messages

create-queue:
	aws sqs create-queue --queue-name ${QUEUE_NAME}

describe-queue:
	aws sqs get-queue-url --queue-name ${QUEUE_NAME}

delete-queue:
	aws sqs get-queue-url --queue-name ${QUEUE_NAME} \
		| jq .QueueUrl \
		| xargs aws sqs delete-queue --queue-url
