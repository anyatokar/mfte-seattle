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

You can deploy if your Google account has been added to the MFTE Seattle Firebase project.

Install Firebase CLI if you haven't already: https://firebase.google.com/docs/hosting/quickstart#install-cli

Note: Firebase hosting is already initialized so don't do Step 2 in the above doc.

Using the terminal, login to your Google account:

```
firebase login
```

If that doesn't work, try:

```
firebase login --reauth
```

Build the app:

```
yarn build
```

Test the build locally. TODO: Add emulator instructions.

Deploy the build:

```
firebase deploy --only hosting
```
