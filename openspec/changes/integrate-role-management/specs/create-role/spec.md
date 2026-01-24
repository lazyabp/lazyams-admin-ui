## ADDED Requirements
### Requirement: The user should be able to create a new role.
The user SHALL be able to create a new role.

#### Scenario:
-   Given the user is on the role management page
-   When the user clicks the "Add Role" button
-   Then a dialog should appear with a form
-   And the form should have fields for "Role Name", "Role Value", and "Status"
-   When the user fills out the form and clicks "Save"
-   Then a POST request should be made to `/api/Role/Add` with the form data
-   And the role list should be refreshed to show the new role