## ADDED Requirements
### Requirement: The user should be able to delete a role.
The user SHALL be able to delete a role.

#### Scenario:
-   Given the user is on the role management page
-   When the user clicks the "Delete" button for a role
-   Then a confirmation dialog should appear
-   When the user confirms the deletion
-   Then a DELETE request should be made to `/api/Role/Delete/{id}`
-   And the role list should be refreshed to remove the deleted role

### Requirement: The user should be able to batch delete roles.
The user SHALL be able to batch delete roles.

#### Scenario:
-   Given the user is on the role management page
-   And the user has selected multiple roles in the table
-   When the user clicks the "Batch Delete" button
-   Then a confirmation dialog should appear
-   When the user confirms the deletion
-   Then a DELETE request should be made to `/api/Role/BatchDelete` with the IDs of the selected roles
-   And the role list should be refreshed to remove the deleted roles