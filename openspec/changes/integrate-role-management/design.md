# Design: Integrate Role Management

## Architectural Approach

The implementation will follow the existing architecture of the `vue-element-admin` template.

-   **API Abstraction**: API calls will be abstracted into a dedicated module (`src/api/role.js`), similar to `src/api/user.js`. This keeps API logic separate from UI components.
-   **Component-Based UI**: The UI will be built using Vue components. A main view component will manage the overall layout and data fetching, while dialogs or separate components will handle creation, editing, and permission assignment.
-   **State Management**: For simplicity, we will initially manage state within the components themselves. If the complexity grows, we can consider using Vuex for more centralized state management, following the pattern in `src/store/modules/user.js`.
-   **Routing**: A new route will be added to `src/router/index.js` to make the role management page accessible.
-   **UI Library**: The existing `element-ui` library will be used for UI components like tables, forms, dialogs, and trees to maintain a consistent look and feel.

## Data Flow

1.  **Fetching Roles**:
    -   The `RoleView` component will call the `getRoles` function from `src/api/role.js`.
    -   The API function will make an HTTP request to the backend.
    -   The response data will be stored in the component's state and rendered in the table.

2.  **Creating/Updating a Role**:
    -   The `RoleForm` (dialog/component) will collect user input.
    -   On submission, it will call either `addRole` or `updateRole` from `src/api/role.js`.
    -   After a successful API call, the role list will be refreshed.

3.  **Deleting a Role**:
    -   The `RoleView` component will call `deleteRole` or `batchDeleteRoles` on button clicks.
    -   After a successful API call, the role list will be refreshed.

4.  **Assigning Permissions**:
    -   The `PermissionDialog` will fetch the complete menu tree and the role's current permissions.
    -   It will render a tree view with checkboxes.
    -   On save, it will call `rolePermission` with the role ID and the selected menu IDs.

## File Structure

```
src/
├── api/
│   └── role.js         # New file for role API calls
├── router/
│   └── index.js        # Modified to add the new route
├── views/
│   └── system/
│       └── role/
│           └── index.vue # New file for the role management view
└── layout/
    └── components/
        └── Sidebar/
            └── ...       # Modified to add the menu item
```
