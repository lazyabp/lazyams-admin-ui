# Design: Backend API Integration

This document details the technical design for integrating the backend API, focusing on Phase 1: Authentication and User Management.

## 1. System Context

The `vue-element-admin` frontend will transition from using a mock server to making live HTTP requests to the backend API specified in `swagger.json`. The core of this change involves creating a dedicated API layer and updating the application's state management and UI components to interact with it.

## 2. API Service Layer

- **Location**: All new API-related files will be located in the `src/api/` directory.
- **Structure**: We will create one file per API `tag` from the `swagger.json` file. For Phase 1, this means:
    - `src/api/auth.js`: For login and registration endpoints.
    - `src/api/user.js`: For all user-related CRUD operations.
- **Implementation**: Each file will export functions corresponding to an API endpoint. These functions will use the existing `axios` instance configured in `src/utils/request.js`, which already handles `baseURL`, `timeout`, and interceptors for token management and error handling.

**Example (`src/api/auth.js`):**
```javascript
import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/Auth/Login',
    method: 'post',
    data
  })
}
```

## 3. Authentication Flow

The current authentication logic in `src/store/modules/user.js` will be modified to work with the new API.

- **Login Action (`login`)**:
    1. It will call the `login` function from `src/api/auth.js`.
    2. Upon a successful response, it will extract the authentication token.
    3. The token will be stored in cookies using `setToken` from `src/utils/auth.js`.
    4. The token will be committed to the Vuex store.
- **Get User Info Action (`getInfo`)**:
    1. After a successful login, this action will be dispatched.
    2. It will call an API function in `src/api/user.js` (e.g., `getProfile`) which corresponds to `/api/User/Get/{userName}` or a new `/api/user/me` endpoint if available.
    3. The user's information (roles, name, avatar) will be retrieved from the response.
    4. The user data will be committed to the Vuex store. This data will be used for dynamic route generation and UI display.
- **Logout Action (`logout`)**:
    1. It will dispatch an action to call the backend's logout endpoint if one exists.
    2. It will remove the token from cookies using `removeToken`.
    3. It will reset the router and Vuex store state.

## 4. User Management Module

A new module for managing users will be created.

- **View Component (`src/views/user/index.vue`)**:
    - This will be the main component for the user management page.
    - It will use `el-table` to display a list of users fetched from `/api/User/GetByPage`.
    - It will include `el-pagination` for server-side pagination.
    - It will feature a search/filter input to query users.
    - It will have buttons for "Add User", "Edit", and "Delete".
- **Data Fetching**:
    - The `created` or `mounted` lifecycle hook will call an API function to fetch the initial list of users.
- **Create/Edit User**:
    - Clicking "Add User" or "Edit" will open an `el-dialog` component containing a form (`el-form`).
    - The form will be bound to a `user` object. For editing, this object will be pre-filled with the user's data.
    - Form submission will call the corresponding API function in `src/api/user.js` (`/api/User/Add` or `/api/User/Update`).
    - Upon success, the dialog will close, and the user table will be refreshed.
- **Delete User**:
    - Clicking "Delete" will show a confirmation dialog (`el-popconfirm` or `this.$confirm`).
    - Upon confirmation, it will call the delete API (`/api/User/Delete/{id}`) and refresh the table on success.
- **Routing**:
    - A new route definition will be added to a new file, e.g., `src/router/modules/user.js`.
    ```javascript
    const userRouter = {
      path: '/user',
      component: Layout,
      redirect: '/user/list',
      name: 'User',
      meta: { title: 'User Management', icon: 'user' },
      children: [
        {
          path: 'list',
          name: 'UserList',
          component: () => import('@/views/user/index'),
          meta: { title: 'User List' }
        }
      ]
    }
    ```
    - This new router module will be imported into `src/router/index.js`.
