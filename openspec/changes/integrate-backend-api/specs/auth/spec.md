# Spec: Authentication

This spec defines the requirements for user authentication.

## MODIFIED Requirements

### Requirement: Users SHALL be able to log in.

The system MUST allow users to log in using their username and password.

#### Scenario: Successful Login
-   **Given**: A user is on the login page.
-   **When**: They enter a valid username and password and click "Login".
-   **Then**:
    -   The system sends a `POST` request to the `/api/Auth/Login` endpoint.
    -   Upon success, the received authentication token is saved.
    -   The user is redirected to the dashboard page.
    -   The user's information (e.g., name, avatar) is displayed in the UI.

#### Scenario: Invalid Credentials
-   **Given**: A user is on the login page.
-   **When**: They enter an invalid username or password and click "Login".
-   **Then**:
    -   The system displays an error message indicating that the login failed.
    -   The user remains on the login page.

### Requirement: Users SHALL be able to log out.

The system MUST allow an authenticated user to log out.

#### Scenario: Successful Logout
-   **Given**: An authenticated user is in the application.
-   **When**: They click the "Log Out" button.
-   **Then**:
    -   The system clears the authentication token.
    -   The user is redirected to the login page.