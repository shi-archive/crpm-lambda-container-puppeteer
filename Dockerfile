FROM amazon/aws-lambda-nodejs:12

ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG AWS_REGION=us-east-1

# Install Chrome to get all of the dependencies installed
RUN yum install -y amazon-linux-extras
RUN amazon-linux-extras install epel -y
RUN yum install -y chromium

ENV AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
    AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
    AWS_REGION=$AWS_REGION

COPY jest.config.js package*.json tsconfig.json ${LAMBDA_TASK_ROOT}/
COPY bin/app.ts ${LAMBDA_TASK_ROOT}/bin/
COPY test/app.test.ts ${LAMBDA_TASK_ROOT}/test/

RUN npm install
RUN npm run build
RUN npm test

CMD [ "bin/app.lambdaHandler" ]
