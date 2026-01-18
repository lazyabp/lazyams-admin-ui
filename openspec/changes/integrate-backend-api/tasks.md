# Tasks: Backend API Integration

This file breaks down the work required for Phase 1 of the backend API integration.

## Phase 1: Auth and User Management

### 1. Project Setup & API Layer
- [ ] Create `src/api/auth.js` for authentication-related API calls.
- [ ] Create `src/api/user.js` for user management API calls.

### 2. Authentication
- [ ] **Login**:
    - [ ] Update the `login` function in `src/api/auth.js` to call `POST /api/Auth/Login`.
    - [ ] Modify the `login` action in `src/store/modules/user.js` to use the new `login` service.
    - [ ] Ensure the auth token from the response is correctly stored in cookies.
- [ ] **Get User Info**:
    - [ ] Implement a `getInfo` function in `src/api/user.js` to call `GET /api/User/Get/{userName}` or similar endpoint.
    - [ ] Update the `getInfo` action in `src/store/modules/user.js` to use this service.
    - [ ] Ensure user details (name, avatar, roles) are correctly parsed and stored in the Vuex state.
- [ ] **Logout**:
    - [ ] Update the `logout` action in `src/store/modules/user.js`.
    - [ ] Ensure it clears the token from cookies and resets the Vuex store and router.
- [ ] **Validation**:
    - [ ] Manually test the full login/logout flow.
    - [ ] Verify that user information is displayed correctly in the navbar/header after login.
    - [ ] Verify that routing permissions work as expected based on the user's roles.

### 3. User Management Module
- [ ] **Routing**:
    - [ ] Create a new router file `src/router/modules/user.js`.
    - [ ] Add a route for the user management page (`/user/list`).
    - [ ] Import the new router module in `src/router/index.js`.
- [ ] **View Component (`src/views/user/index.vue`)**:
    - [ ] Create the basic structure of the view with `el-table`.
    - [ ] Implement the function to fetch and display a paginated list of users from `GET /api/User/GetByPage`.
    - [ ] Add `el-pagination` and connect it to the fetching logic.
- [ ] **Create/Edit Functionality**:
    - [ ] Add a button to open a "Add/Edit User" `el-dialog`.
    - [ ] Create the form inside the dialog with fields for username, nickname, email, roles, etc.
    - [ ] Implement the logic to pre-fill the form when editing a user (fetching data from `GET /api/User/GetUserById/{id}`).
    - [ ] Implement the `save` function to call either `POST /api/User/Add` or `POST /api/User/Update`.
    - [ ] Refresh the user list after a successful save.
- [ ] **Delete Functionality**:
    - [ ] Add a "Delete" button to each row in the user table.
    - [ ] Implement a confirmation dialog before deleting.
    - [ ] Call `DELETE /api/User/Delete/{id}` on confirmation.
    - [ ] Refresh the user list after a successful deletion.
- [ ] **Validation**:
    - [ ] Manually test all CRUD operations on the User Management page.
    - [ ] Verify that pagination and filtering (if implemented) work correctly.
    - [ ] Check for correct error handling on API call failures.
