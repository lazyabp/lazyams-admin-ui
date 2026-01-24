# Tasks: Integrate Role Management

1.  **API Layer**:
    -   Create `src/api/role.js` to encapsulate all role-related API calls as defined in `swagger.json`.

2.  **UI - Role List View**:
    -   Create a new view component `src/views/system/role/index.vue`.
    -   This view will display a paginated table of roles.
    -   The table will have columns for Role Name, Role Value, Status, and Actions (Edit, Delete).
    -   Implement fetching roles using the `getRoles` API call.
    -   Add buttons for "Add Role" and "Batch Delete".

3.  **UI - Role Creation/Editing**:
    -   Create a dialog or a new page for creating and editing roles.
    -   The form will include fields for Role Name, Role Value, and Status.
    -   Implement `addRole` and `updateRole` API calls.

4.  **UI - Role Deletion**:
    -   Implement the `deleteRole` API call when the delete button is clicked.
    -   Implement the `batchDeleteRoles` API call for the batch delete button.

5.  **UI - Permission Assignment**:
    -   Create a dialog to manage role permissions.
    -   This dialog will display a tree of available menus.
    -   Implement `getMenuTree` to fetch all menus.
    -   Implement `getMenuIdsByRoleId` to show currently assigned permissions for a role.
    -   Implement `rolePermission` to update the permissions for a role.

6.  **Routing and Navigation**:
    -   Add a new route for the role management view in `src/router/index.js`.
    -   Add a new entry in the sidebar menu to navigate to the role management page.

7.  **Validation**:
    -   Add unit tests for the new components and API functions.
    -   Perform manual testing to ensure all features work as expected.
