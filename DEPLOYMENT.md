# Deploying the app

## Environment
The environment variables and keys are available from a maintainer via a LastPass share. Contact a maintainer for those credentials

## Setup
Install the gcloud CLI. On macOS:

```
brew install google-cloud-sdk
```

Set the project in gcloud

```
gcloud config set project mfte-simple-92c08
```

## Deploying

Make sure the app and docker containers are built:
```
yarn build
```

Log in to the Google account that has been added to the MFTE Seattle Firebase project:

```
gcloud auth login
```

Assuming you have tested this build, now submit the build to GCloud and deploy it:

```
gcloud builds submit --tag gcr.io/mfte-simple-92c08/mfte-simple/deploy-image .docker

gcloud run deploy mfte-simple --image gcr.io/mfte-simple-92c08/mfte-simple/deploy-image --platform "managed" --allow-unauthenticated --region us-west1
```