# MFTE Seattle

This is the source for https://mfte-seattle.com

## About

### Overview

This application helps users locate rent-reduced apartments that are part of Seattle's Multi-family Tax Exemption (MFTE) program. It supplements existing government resources to make this rent-reduced housing program easier to navigate for the people it is intended to reach. The platform currently supports over 100 active daily users.

### Usage

Users can search and filter MFTE apartments by criteria such as location and number of bedrooms. In the list tab, they can view detailed information about each property. Registered users can save a shortlist of properties, view a personalized map, and add notes for easy reference. This resource is completely free.

### Data source

Building data is sourced from the spreadsheet of MFTE buildings published by the Seattle Office of Housing roughly twice a year. Currently, there are over 300 properties that participate in the program.

Please visit https://mfte-seattle.com/about for more information.

## Technologies

Frontend – This application is built with TypeScript and React for a modular, efficient UI. Bootstrap is used for consistent styling and a responsive layout across devices, ensuring smooth functionality on both desktop and mobile.

Backend – The backend relies fully on Google Cloud Firebase, using Firebase Hosting for serving the app, Firebase Authentication for secure user login, and Firestore as the database to manage and sync data in real-time. It also uses Google Analytics to better understand usage and impact.

For additional information regarding regarding database design and system architecture, see the [design documentation](./DESIGN.md).

## Contributing

This is an open-source project and contribution are welcome. For guidelines on how to contribute, please refer to the [contributing documentation](./CONTRIBUTE.md).
