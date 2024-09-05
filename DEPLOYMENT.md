# Deployment

**Note**: The app auto-deploys when a pull request is merged.

## Environment

Environment variables and keys are shared via LastPass. Please contact a maintainer to obtain these credentials.

## Setup

1. **Install the Google Cloud CLI**:
   On macOS:

   ```bash
   brew install google-cloud-sdk
   ```

2. **Set the Google Cloud project**:
   ```bash
   gcloud config set project mfte-simple-92c08
   ```

## Deploying

You can deploy if your Google account has been added to the MFTE Seattle Firebase project.

1. **Install Firebase CLI**:
   If you haven't installed it, follow the instructions here: [Firebase CLI Quickstart](https://firebase.google.com/docs/hosting/quickstart#install-cli).

   **Note**: Firebase Hosting is already initialized, so you can skip Step 2 in the documentation.

2. **Login to Firebase**:

   ```bash
   firebase login
   ```

   If you encounter issues, try:

   ```bash
   firebase login --reauth
   ```

3. **Build the App**:

   ```bash
   yarn build
   ```

4. **Test the Build Locally**:

   ```bash
   yarn start
   ```

   TODO: Add instructions for testing with an emulator.

5. **Deploy the App**:
   ```bash
   firebase deploy --only hosting
   ```
