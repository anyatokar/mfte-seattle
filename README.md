# MFTE Seattle

This is the source for [https://mfte-seattle.com](https://mfte-seattle.com)

## About

### Purpose

The purpose of this website is to help people find safe and comfortable rent-reduced housing. It aims to supplement existing government resources by mapping all buildings that participate in the MFTE (Multifamily Tax Exemption) program.

The platform currently supports over 100 active daily users.

### Disclaimers

MFTE is a government program. This app is not affiliated with the Seattle Office of Housing or any government office. For official information about MFTE please visit the [Seattle Office of Housing website](https://seattle.gov/housing).

Users should contact building property management directly for current information about apartment vacancies or renter qualifications.

### Why MFTE

This app highlights the MFTE program because of the relatively quick application turnaround, higher availability, and modern apartments in sought-after locations.

### Data Source

Buildings are sourced from the spreadsheet of [Market-Rate Rental Properties with Affordable Housing Units Regulated by the City of Seattle (April 2024)](https://www.seattle.gov/documents/Departments/Housing/Renters/Affordable_Rental_Housing_MFTE-MHA-IZ.pdf). Updated spreadsheets are published by the Seattle Office of Housing roughly twice a year.

### Usage

Users can search and filter for apartments that fit their criteria (such as number of bedrooms, neighborhood, and building name). They can create a free login to keep a short list of properties, view a personalized map, and add notes.

Users are encouraged to explore the [MFTE map](./all-buildings) page to get started.

## Technologies

### Frontend

This application is built with TypeScript and React for a modular, efficient UI. Bootstrap is used for consistent styling and a responsive layout across devices, ensuring smooth functionality on both desktop and mobile.

### Backend

The backend relies fully on Google Cloud Firebase, using Firebase Hosting for serving the app, Firebase Authentication for secure user login, and Firestore as the database to manage and sync data in real-time. It also uses Google Analytics to better understand usage and impact.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started). To learn React, check out the [React documentation](https://reactjs.org/).

Create React App uses Jest as its test runner for unit testing.

For additional information regarding regarding database design and system architecture, see the [design documentation](./DESIGN.md).

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
