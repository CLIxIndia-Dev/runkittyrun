# Run Kitty Run!

In Run Kitty Run, you (the player) are training a cat to be the best mouse catcher. The cat catches the mouse by crossing the finish line at the same time as the mouse.

### Game Design Document:
The game design document includes information about how to play and what levels exist can be found in the RunKittyRun GitHub wiki.

### Query Parameters
#### API
To change where data is logged to, you can pass it an 'api' parameter  
`api=/some/url/here`

The default is QBank's API located at `:8080/api/v1/logging/genericlog` and specifics regarding what specific data is collected can be found in the RunKittyRun GitHub wiki.

To change the cookie name (for where to find a user ID or session ID), pass in the `cookieName` parameter. The defaults that are searched for are `session_id`, `session_uuid`, and `user_id` (in that order). The first cookie found is used.

Example:

`cookieName=userId`

#### Language
To change the language, you can pass it a 'lang' parameter  
`lang=en`

Supported languages are English (lang=en), Hindi (lang=hi), and Telugu (lang=te).
