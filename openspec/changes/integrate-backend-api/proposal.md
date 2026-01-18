# Proposal: Integrate Backend API

This proposal outlines the plan to integrate a backend API, defined by a `swagger.json` specification, into the `vue-element-admin` frontend.

## 1. Objective

The primary goal is to replace the mock data and API implementation in `vue-element-admin` with live data from the backend API. This involves:
- Implementing API service modules to communicate with the backend.
- Updating the UI components and Vuex store to consume the new API services.
- Ensuring the application functions correctly with the live backend.

## 2. Scope & Phased Approach

Given the large number of API endpoints, the integration will be executed in phases. This proposal covers **Phase 1**, which focuses on the most critical features:

- **Authentication**: Implement user login and logout against the backend's `/api/Auth/Login` endpoint.
- **User Management**: Implement full CRUD (Create, Read, Update, Delete) functionality for users.

Subsequent phases will cover other modules like `Role`, `Menu`, `Carousel`, etc., and will be detailed in separate proposals.

## 3. High-Level Plan

1.  **API Service Layer**: Create new JavaScript modules under `src/api/` for each backend resource (`auth.js`, `user.js`). These modules will use the existing `request` utility.
2.  **Authentication Flow**:
    - Modify the `login` action in `src/store/modules/user.js` to call the new authentication service.
    - Update the `getInfo` action to fetch user details from the backend.
    - Adjust the logout functionality.
3.  **User Management Module**:
    - Create a new view component `src/views/user/index.vue` to display a list of users.
    - Implement features for creating, editing, and deleting users, likely using a modal or separate views.
    - Add the new User Management page to the router (`src/router/modules/`) and the sidebar menu.

## 4. Out of Scope for Phase 1

- Integration of other modules (`Role`, `Menu`, `Carousel`, etc.).
- Social login functionalities.
- File uploads.
- Changes to the overall UI theme or layout, beyond what is necessary for the new features.
