# Run Kitty Run!

In Run Kitty Run, you (the player) are training a cat to be the best mouse catcher. The cat catches the mouse by crossing the finish line at the same time as the mouse.

### Game Design Document:
The game design document includes information about how to play and what levels exist can be found in the RunKittyRun GitHub wiki.

### Query Parameters
Run Kitty Run has three settings for configuration:

* Logging
* UI language
* Cookie name

To use either of these, you will append a CGI URL parameter to the tool. For example:

```
https://www.example.com/runkittyrun?api=/foo
```

More details are given below in each subsection.

#### Logging API
To change where data is logged to, you can pass it an `api` parameter  
`api=/some/path/here`

For example, configuring the logging endpoint to `/foo` as below:

```
https://www.example.com/runkittyrun?api=/foo
```

Would attempt to send the application log data to:

```
https://www.example.com/foo
```

You will be expected to have some server-side API at `/foo` that handles data collection.

If no `api` parameter is included, the application will attempt to log to QBank's API located at `https://<current hostname>:8080/api/v1/logging/genericlog`. Details regarding what specific data is collected can be found in the RunKittyRun [GitHub wiki](https://github.com/CLIxIndia-Dev/runkittyrun/wiki/Run-Kitty-Run-Logging).

#### UI Language
To change the UI language, you can pass it a `lang` parameter:
`lang=en`

This can be used in combination with the above setting, as follows:

```
https://www.example.com/runkittyrun?api=/foo&lang=hi
```

Would both log data to `/foo` and render the UI in Hindi.

Supported languages are:

* English (`lang=en`)
* Hindi (`lang=hi`)
* Telugu (`lang=te`)

#### Cookie name
Run Kitty Run collects the current, logged-in user name or ID from a cookie in the client browser. You can configure the name of the cookie it looks for with the `cookieName` parameter.

```
https://www.example.com/runkittyrun?cookieName=myUserIdCookie
```

The defaults that are searched for are `session_id`, `session_uuid`, and `user_id` (in that order). The first cookie found is used.

This user ID is included as the `session_id` parameter of the data payload sent in the logging messages, as well as in the `x-api-proxy` header.

Similarly, you can include this setting along with the others by combining them in the URL:

```
https://www.example.com/runkittyrun?cookieName=myUserIdCookie&lang=te&api=/foo
```
