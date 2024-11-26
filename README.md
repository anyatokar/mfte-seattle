# MFTE Seattle

This is the source for [https://mfte-seattle.com](https://mfte-seattle.com)

## Purpose

This web application helps people find rent-reduced housing by mapping buildings that participate in Seattle's MFTE (Multifamily Tax Exemption) program.

It currently supports ~3,000 monthly active users.

**New!** A feature that allows building managers to add real-time availability using a manager portal has been deployed (but not yet advertised).

## Technologies

### Frontend

This application is built with TypeScript and React. It uses React-Bootstrap for consistent styling, accessibility, and a responsive layout across devices.

### Backend

The backend relies fully on Google Cloud Firebase, using Firebase Hosting for serving the app, Firebase Authentication for secure user login, and Firestore as the database to manage and sync data in real-time. It also uses Google Analytics to better understand usage and impact.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started). To learn React, check out the [React documentation](https://reactjs.org/).

Create React App uses Jest as its test runner for unit testing.

For additional information regarding regarding database design and system architecture, see the [design documentation](./DESIGN.md).

### Usage

Users can search and filter for apartments that fit their criteria (such as number of bedrooms, neighborhood, and building name). They can create a free login to keep a short list of properties, view a personalized map, and add notes.

## Run App Locally

In the project directory, run:

```bash
yarn start
```

Runs the app in the development mode.\
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Contribute

This is an open-source project and contribution are welcome. For guidelines on how to contribute, please refer to the [contributing documentation](./CONTRIBUTE.md).

## Additional Information

### Disclaimer

MFTE is a government program. This app is not affiliated with the Seattle Office of Housing or any government office. For official information about MFTE please visit the [Seattle Office of Housing website](https://seattle.gov/housing).

Users should contact building management directly for complete information about apartment vacancies and the application process.

### Why MFTE

This app highlights the MFTE program because of the relatively quick application turnaround, higher availability, and modern apartments in sought-after locations.

### Data Source

Buildings are sourced from the spreadsheet of [Market-Rate Rental Properties with Affordable Housing Units Regulated by the City of Seattle (April 2024)](https://www.seattle.gov/documents/Departments/Housing/Renters/Affordable_Rental_Housing_MFTE-MHA-IZ.pdf). Updated spreadsheets are published by the Seattle Office of Housing roughly twice a year.

Vacancy information is submitted directly by building managers.
