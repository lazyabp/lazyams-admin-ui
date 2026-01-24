## ADDED Requirements
### Requirement: The user should be able to update an existing role.
The user SHALL be able to update an existing role.

#### Scenario:
-   Given the user is on the role management page
-   When the user clicks the "Edit" button for a role
-   Then a dialog should appear with a form pre-filled with the role's data
-   And the form should have fields for "Role Name", "Role Value", and "Status"
-   When the user modifies the form and clicks "Save"
-   Then a POST request should be made to `/api/Role/Update` with the updated data
-   And the role list should be refreshed to show the updated role