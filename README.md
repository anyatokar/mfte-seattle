# MFTE Seattle

This is the source for [https://mfte-seattle.com](https://mfte-seattle.com)

## Purpose

This web application rent-reduced housing in Seattle by featuring currently available and generally existing units in a user-friendly and accessible way.

It currently supports 3,000 monthly active users on average.

**New!** Soft-launched a feature that allows building managers to add real-time availability using a manager portal.

## Technologies

### Frontend

This application is built with TypeScript and React. It uses React-Bootstrap for consistent styling, accessibility, and a responsive layout across devices.

### Backend

The backend relies fully on Google Cloud Firebase, using Firebase Hosting for serving the app, Firebase Authentication for secure user login, and Firestore as the database to manage and sync data in real-time. It also uses Google Analytics to better understand usage and impact.

For additional information regarding regarding database design and system architecture, see the [design documentation](./DESIGN.md).

### Usage

Prospective renters can search and filter for apartments that fit their criteria. They can create a free login to keep a short list of properties, view a personalized map, and add notes. Building managers can create a free manager account to add and update listings.

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

This is an open-source project and contributions are welcome. For guidelines on how to contribute, please refer to the [contributing documentation](./CONTRIBUTE.md).

### Data Source

Data is sourced from the spreadsheet of [Market-Rate Rental Properties with Affordable Housing Units Regulated by the City of Seattle (April 2024)](https://www.seattle.gov/documents/Departments/Housing/Renters/Affordable_Rental_Housing_MFTE-MHA-IZ.pdf) and from direct communication with property owners.

Real-time availability information is submitted directly by building managers.
