# Gamification Microservice

## Overview

This project provides a unified API interface for various gamification-related services. It uses Express.js for the server, MongoDB for session storage, and Passport.js for authentication.

## Project Details

- **Name:** Gamification Microservice
- **Version:** 1.0.0
- **Description:** Provides a unified API interface for the various services.

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [Environment Variables](#environment-variables)
4. [Authentication System Overview](authentication-system-overview)
5. [Contributing](#contributing)
6. [License](#license)

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/Actus-Go/Gamification-Microservice.git
    ```

2. Navigate to the project directory:

    ```sh
    cd gamification-microservice
    ```

3. Install dependencies:

    ```sh
    npm install
    ```

## Usage

1. Set up your `.env` file with the necessary environment variables (see below).
2. Start the development server:

    ```sh
    npm start
    ```

## Environment Variables

Create a `.env` file in the root of your project and add the following variables:

- `PORT`: Port number on which the server will run (e.g., 3000)
- `DB_URL`: MongoDB connection string (e.g., mongodb://localhost/test)
- `SECRET_KEY`: Secret key for session management
- `DEBUG`: Set to `true` or `false` to enable/disable debug mode

Example `.env` file:

```env
PORT=3000
DB_URL=mongodb://localhost/test
SECRET_KEY=your_secret_key
DEBUG=true
```

## Authentication System Overview

The authentication system harnesses several advanced libraries and frameworks, including OAuth2orize for OAuth 2.0 server implementation and Passport for handling user authentication in various strategies. JSON Web Tokens (JWTs) are used for secure transmission and verification of user credentials.

### OAuth 2.0 Authentication Workflow

#### OAuth 2.0 Server Configuration

The OAuth server facilitates the client registration and token issuance processes. It uses OAuth2orize, a Node.js library specifically designed for implementing OAuth 2.0 servers. The server is responsible for:

- Serializing and deserializing clients for session management.
- Exchanging client credentials for access tokens which are then used for authenticated requests.

#### Client Credentials Grant

In this flow:

- Registered clients can obtain access tokens directly by making authenticated requests to the token endpoint.
- The tokens are generated based on the client credentials and are signed with a secret key for security.
- Access tokens have a limited lifespan, typically set for one hour, to enhance security.

### User and Client Management

#### Client Registration

- New clients can register through an endpoint which requires them to be authenticated as a user, typically with administrative privileges for register his Backends if he has many.
- Each client receives unique credentials (client ID and secret) upon successful registration.
- These credentials are necessary to participate in the OAuth flow.

#### User Registration

- The system includes a dedicated endpoint for user registration.
- This process involves basic credential checks and role assignments, ensuring that only authorized users (Administrators) can register new Profiles in the system.

### Security Considerations

- The authentication system employs Passport to implement multiple strategies (such as local, basic, and OAuth2 client password strategies).
- The system is designed to be secure and robust, using environment variables to handle sensitive information securely.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License.
