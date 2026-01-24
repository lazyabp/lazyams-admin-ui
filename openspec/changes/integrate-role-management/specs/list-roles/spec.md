## ADDED Requirements
### Requirement: The user should be able to see a paginated list of roles.
The user SHALL be able to see a paginated list of roles.

#### Scenario:
-   Given the user is on the role management page
-   When the page loads
-   Then a request should be made to `/api/Role/GetByPage`
-   And the response should be displayed in a table
-   And the table should have columns for "Role Name", "Role Value", "Status", and "Actions"
-   And pagination controls should be visible if there are multiple pages of roles