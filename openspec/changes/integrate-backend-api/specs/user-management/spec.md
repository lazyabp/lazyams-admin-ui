# Spec: User Management

This spec defines the requirements for managing users.

## ADDED Requirements

### Requirement: Administrators SHALL be able to view a list of users.

The system MUST provide a page for administrators to manage users.

#### Scenario: Navigating to User Management
-   **Given**: An administrator is logged in.
-   **When**: They navigate to the "User Management" section.
-   **Then**:
    -   The system displays a page with "User List" in the title.
    -   The system sends a request to `GET /api/User/GetByPage` to fetch the first page of users.
    -   A table is displayed, showing the list of users with columns such as Username, Nickname, Email, and Roles.
    -   Pagination controls are visible if there is more than one page of users.

### Requirement: Administrators SHALL be able to create a new user.

The system MUST allow administrators to create a new user.

#### Scenario: Opening the create user form
-   **Given**: An administrator is on the user management page.
-   **When**: They click the "Add User" button.
-   **Then**: A dialog or form appears with fields for creating a new user (e.g., Username, Password, Email).

#### Scenario: Successful User Creation
-   **Given**: The "Add User" form is open.
-   **When**: The administrator fills in the required fields with valid data and clicks "Save".
-   **Then**:
    -   The system sends a `POST` request to `/api/User/Add` with the new user's data.
    -   The form/dialog closes.
    -   The user list is refreshed to show the newly created user.
    -   A success notification is displayed.

### Requirement: Administrators SHALL be able to update an existing user.

The system MUST allow administrators to update an existing user's information.

#### Scenario: Opening the edit user form
-   **Given**: An administrator is on the user management page.
-   **When**: They click the "Edit" button for a specific user.
-   **Then**: A dialog or form appears, pre-filled with that user's current information.

#### Scenario: Successful User Update
-   **Given**: The "Edit User" form is open for a specific user.
-   **When**: The administrator modifies the user's information and clicks "Save".
-   **Then**:
    -   The system sends a `POST` request to `/api/User/Update` with the updated data.
    -   The form/dialog closes.
    -   The user list is refreshed to show the updated information for that user.
    -   A success notification is displayed.

### Requirement: Administrators SHALL be able to delete a user.

The system MUST allow administrators to delete a user.

#### Scenario: Opening the delete confirmation
-   **Given**: An administrator is on the user management page.
-   **When**: They click the "Delete" button for a specific user.
-   **Then**: A confirmation prompt is displayed.

#### Scenario: Successful User Deletion
-   **Given**: The delete confirmation prompt is visible.
-   **When**: The administrator confirms the deletion.
-   **Then**:
    -   The system sends a `DELETE` request to `/api/User/Delete/{id}`.
    -   The user is removed from the list.
    -   A success notification is displayed.