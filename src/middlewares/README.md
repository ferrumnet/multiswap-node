# asyncMiddleware.ts

Description: The `asyncMiddlewareLayer` function is a higher-order function designed to handle asynchronous operations within middleware by wrapping another function. It ensures any thrown errors are caught and handled appropriately, simplifying error handling across asynchronous middleware functions.

Parameters:

-   `fn`: A function that represents the middleware operation. It takes three parameters:
    -   `req`: The request object.
    -   `res`: The response object.
    -   `next`: A callback function to pass control to the next middleware function.

Returns:

-   A function that takes `req`, `res`, and `next` as arguments. This returned function uses `Promise.resolve` to execute the middleware function `fn` and handles any errors that occur during its execution.

Error Handling:

-   If an error is caught during the execution of `fn`, the error object is inspected and transformed to provide a meaningful error message. The function checks several properties (`message`, `msg`, `errors`) to determine the appropriate error message.
-   If an error occurs while handling the initial error (in the catch block), the catch error is sent as a 400 HTTP response using `res.http400`

# responseAppender.ts

### `responseAppender(req: any, res: any, next: any)`

Description: This middleware function is designed to append standard HTTP response methods to the `res` (response) object in an Express.js application. It enables the application to use standardized response formats across different routes and controllers, ensuring a consistent API behavior.

Parameters:

-   `req` (any): The HTTP request object. This function does not use `req` directly, but it is included to adhere to the middleware signature in Express.js.
-   `res` (any): The HTTP response object. This is augmented with several methods for returning standard responses.
-   `next` (any): The callback argument to the middleware function. This function does not use `next` as it does not need to pass control to subsequent middleware.

Appended Methods to `res`:

-   `res.http200`: A method set by importing from `standardResponses` module. Typically used to send a 200 OK response.
-   `res.http400`: A method set by importing from `standardResponses` module. Typically used to send a 400 Bad Request response.
-   `res.http401`: A method set by importing from `standardResponses` module. Typically used to send a 401 Unauthorized response.
-   `res.http404`: A method set by importing from `standardResponses` module. Typically used to send a 404 Not Found response.

Usage: This middleware should be used in the application setup, typically before defining routes, to ensure that all response objects in route handlers are equipped with these methods. It helps in maintaining a clean and consistent structure for handling API responses.

# standardResponses.ts

The file `standardResponses.ts` from the `ferrumnet/multiswap-node` repository contains several utility functions to standardize HTTP responses in a middleware setup. Here's a detailed breakdown of each function documented within this file:

### Function: `http200(data: any)`

This function is used to send a successful HTTP response with a status code of 200. It expects a parameter `data` which can include any data to be returned as part of the response body. The function:

-   Extracts a message from the `data` object if available and deletes the message property from the object.
-   Constructs a response object with a status code and message, and includes the rest of the data as the response body.

### Function: `http400(err: any, key: string = "")`

This function handles the HTTP 400 (Bad Request) responses. It takes an error object `err` and an optional string `key` to provide additional context. It:

-   Returns a response with a status code of 400 and includes the error message in the response status.

### Function: `http401(err: any)`

This function is used for handling HTTP 401 (Unauthorized) responses. It accepts an error object `err` and:

-   Sends a response with a status code of 401, incorporating the error message in the response status.

### Function: `http404(err: any, key: string = "")`

This function handles HTTP 404 (Not Found) responses. Similar to `http400`, it takes an error object `err` and an optional `key` for additional context. It:

-   Returns a response with a status code of 404 and includes the error message in the response status.

These functions are part of a module that likely gets used across the server to ensure consistency in how HTTP responses are formatted and sent back to clients, making it easier to handle different types of HTTP response scenarios consistently.

# standardStatuses.ts

The file `standardStatuses.ts` within the `middlewares/response` directory of the `multiswap-node` repository contains a module that exports several functions, each associated with different HTTP response statuses. Here's a detailed documentation of each function:

1.  status200(data: any)

    -   Purpose: Constructs a successful response object.
    -   Parameters:
        -   `data`: The payload to be included in the response.
    -   Returns: An object with a status code of `200` and the provided data.
    -   Usage: Used to send a successful response to the client with the specified data.
    -   Code:

        typescriptCopy code

        `return {
          code: 200,
          data: data
        }`

2.  status400(data: any)

    -   Purpose: Constructs a client error response object.
    -   Parameters:
        -   `data`: The error message or data to be included in the response.
    -   Returns: An object with a status code of `400` and the error message.
    -   Usage: Used to indicate that the client made an incorrect request.
    -   Code:

        typescriptCopy code

        `return {
          code: 400,
          message: data
        }`

3.  status401(data: any)

    -   Purpose: Constructs a response object for authentication errors.
    -   Parameters:
        -   `data`: The error message or data indicating the authentication failure.
    -   Returns: An object with a status code of `401` and the error message.
    -   Usage: Used to indicate that the request requires user authentication.
    -   Code:

        typescriptCopy code

        `return {
          code: 401,
          message: data
        }`

These functions provide a standardized way to handle HTTP responses across the application, ensuring consistency in how responses are structured and sent to clients.


# auth.middleware.ts

Here's a detailed breakdown of each function within the `auth.middleware.ts` file:

#### Middleware `auth`

-   Purpose: This middleware function is designed to handle authorization checks for API requests. It allows for the enforcement of specific rights required to access various parts of an application.
-   Parameters:
    -   `...requiredRights`: An array of strings that specifies the rights needed to access the function.
-   Behavior:
    -   Checks if the authorization header is present in the request. If not, it sends a 401 response with the message "Authorization header missing".
    -   If the authorization header is present, it attempts to validate the token extracted from the header.
    -   If the token is valid, it calls `next()` to pass control to the next middleware function. Otherwise, it sends a 401 response with "Invalid token".
-   Error Handling:
    -   Catches and logs any error that occurs during the token validation process, then sends a 401 response with "Invalid token".

#### Function `validateAuth`

-   Purpose: Validates the token based on the request's URL to determine the type of API being accessed.
-   Parameters:
    -   `token`: The token extracted from the authorization header.
    -   `req`: The request object.
-   Returns: Boolean indicating whether the token is valid for the requested API.
-   Behavior:
    -   Checks if the request URL includes "securityKey" and calls `authSecurityKeyApis` or `authJobApis` accordingly.

#### Function `authSecurityKeyApis`

-   Purpose: Validates tokens specifically for security key related APIs.
-   Parameters:
    -   `token`: The token to be validated.
-   Returns: Boolean indicating if the token matches the expected security key after decryption.
-   Behavior:
    -   Decrypts the token using a key from the environment configuration and compares it to the expected key.

#### Function `authJobApis`

-   Purpose: Validates tokens specifically for job related APIs.
-   Parameters:
    -   `token`: The token to be validated.
-   Returns: Boolean indicating if the token is valid for job APIs.
-   Behavior:
    -   Validates the token by checking if it meets specific job-related authorization criteria.

#### Function `isAuthJobTokenValid`

-   Purpose: Checks the validity of a job API token.
-   Parameters:
    -   `token`: The token to be validated.
    -   `key`: The key used for token decryption.
-   Returns: Boolean indicating whether the token is valid.
-   Behavior:
    -   Decrypts the token and checks if the decrypted token corresponds to a valid JSON object with valid date constraints.

#### Function `validateDates`

-   Purpose: Validates date constraints within the token data.
-   Parameters:
    -   `data`: Data object containing start and end date-time fields.
-   Returns: Boolean indicating whether the current date falls between the start and end dates specified in the token data.
-   Behavior:
    -   Compares the current date to the start and end dates provided within the token data, checking if it falls within the specified range.

These functions collectively provide robust authorization middleware for different types of API requests based on token validation and time constraints.


