# Tasks: Backend API Integration

This file breaks down the work required for Phase 1 of the backend API integration.

## Phase 1: Auth and User Management

### 1. Project Setup & API Layer
- [x] Create `src/api/auth.js` for authentication-related API calls.
- [x] Create `src/api/user.js` for user management API calls.

### 2. Authentication
- [x] **Login**:
    - [x] Update the `login` function in `src/api/auth.js` to call `POST /api/Auth/Login`.
    - [x] Modify the `login` action in `src/store/modules/user.js` to use the new `login` service.
    - [x] Ensure the auth token from the response is correctly stored in cookies.
- [x] **Get User Info**:
    - [x] Implement a `getInfo` function in `src/api/user.js` to call `GET /api/User/Get/{userName}` or similar endpoint.
    - [x] Update the `getInfo` action in `src/store/modules/user.js` to use this service.
    - [x] Ensure user details (name, avatar, roles) are correctly parsed and stored in the Vuex state.
- [x] **Logout**:
    - [x] Update the `logout` action in `src/store/modules/user.js`.
    - [x] Ensure it clears the token from cookies and resets the Vuex store and router.
- [ ] **Validation**:
    - [ ] Manually test the full login/logout flow.
    - [ ] Verify that user information is displayed correctly in the navbar/header after login.
    - [ ] Verify that routing permissions work as expected based on the user's roles.

### 3. User Management Module
- [x] **Routing**:
    - [x] Create a new router file `src/router/modules/user.js`.
    - [x] Add a route for the user management page (`/user/list`).
    - [x] Import the new router module in `src/router/index.js`.
- [x] **View Component (`src/views/user/index.vue`)**:
    - [x] Create the basic structure of the view with `el-table`.
    - [x] Implement the function to fetch and display a paginated list of users from `GET /api/User/GetByPage`.
    - [x] Add `el-pagination` and connect it to the fetching logic.
- [x] **Create/Edit Functionality**:
    - [x] Add a button to open a "Add/Edit User" `el-dialog`.
    - [x] Create the form inside the dialog with fields for username, nickname, email, roles, etc.
    - [x] Implement the logic to pre-fill the form when editing a user (fetching data from `GET /api/User/GetUserById/{id}`).
    - [x] Implement the `save` function to call either `POST /api/User/Add` or `POST /api/User/Update`.
    - [x] Refresh the user list after a successful save.
- [x] **Delete Functionality**:
    - [x] Add a "Delete" button to each row in the user table.
    - [x] Implement a confirmation dialog before deleting.
    - [x] Call `DELETE /api/User/Delete/{id}` on confirmation.
    - [x] Refresh the user list after a successful deletion.
- [ ] **Validation**:
    - [ ] Manually test all CRUD operations on the User Management page.
    - [ ] Verify that pagination and filtering (if implemented) work correctly.
    - [ ] Check for correct error handling on API call failures.