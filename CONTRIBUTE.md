# Contributing

To contribute to the project, please follow these steps:

1. **Coordinate with Maintainers**: Reach out to the maintainers to obtain secret keys and coordinate your work.
2. **Access the Trello Board**: Track tasks and updates on our [Trello board](https://trello.com/b/2B1wmi72/mfte-capstone).
3. **Clone the Repository**: Clone the app from GitHub to get started with development.

## Testing

```bash
yarn test
```

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## Code Formatting

To format the code in the `src` folder:

```bash
yarn prettier ./src -w
```

To format the entire codebase:

```bash
yarn prettier . -w
```

## Updating Dependencies

To update dependencies to the latest version within the specified range in `package.json`, run:

```bash
yarn upgrade
```

This will not upgrade to new major versions (e.g., 4.x.x to 5.x.x). For major upgrades, manually update the version constraints in `package.json`.

## Deployment

For deployment instructions, please refer to the [deployment documentation](./DEPLOYMENT.md).
