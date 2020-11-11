Endpoints

Index:
For internal users if we render a react app:
'/' => send the static index file of the react app add here your default react app static file
'/api/login' => renders the view template of the login for external calls
'/api/welcome' => renders the welcome template for external calls


Users: (auth)
Pages rendering:
Get:
'/users/login' => renders the view template of the login for external calls, on success redirect the user to the session defined redirect url
'/users/register' => renders register page and redirect user to login page on success

Api endpoints
Get:
//api endpoints
'/loginFacebook' => takes the redirect data and add it to the session then use facebook login strategy
'/loginFacebook/callback' => endpoint used for facebook to callback to the express server when the login is processed
'/userinfo' => usefull to check the information of the session from the front end or using react
'/logout' => logout the session

Post:
'/login' => receive a json as a payload with email and password and authenticate using local strategy
'/register' => receive a json as a payload with the user register data, validates it and register the user using local strategy

Apis: "functions like the nodemailer"
Post
'/apis/sendmail'

The api server handles the navigation and authentication, as well as confirmation for new users. It talks with the server that contains all the prices and data to display the price change each month.
The front end is developed using react.

You can see a fully functional example of this app in https://tu-mejor-precio.herokuapp.com 
The login by facebook needs the server to have ssl certificates and in heroku that is a paid feature so is not working there, but the feature is fully functional when used in an https server.
