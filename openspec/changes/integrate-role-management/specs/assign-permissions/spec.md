## ADDED Requirements
### Requirement: The user should be able to assign menu permissions to a role.
The user SHALL be able to assign menu permissions to a role.

#### Scenario:
-   Given the user is on the role management page
-   When the user clicks the "Edit" button for a role
-   And a dialog appears with the role's details
-   And there is a button or tab for "Permissions"
-   When the user clicks on "Permissions"
-   Then a tree of all available menus should be displayed
-   And the menus currently assigned to the role should be checked
-   When the user checks or unchecks menus and clicks "Save"
-   Then a POST request should be made to `/api/Role/RolePermission` with the role ID and the new list of menu IDs
-   And a success message should be displayed