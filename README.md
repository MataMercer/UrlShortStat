# UrlShortStat
A web app for shortening urls and viewing usage stats.

## Description
It is a web app for shortening Urls. Users can view visits from people who used the shortened url. The app displays the visits on the graph, which
can display visits based on a 30 day period, month, or year basis. In addition, each graph features two data sets, one from the current time period and one
from the previous time period, to measure growth in visits. Users can also select how far back to view statistics, such as two months ago or two
years ago.

This app also has a user account system made with Passport.js. Users can register, login, or logout. There is a settings page for changing
account information or deleting the account entirely. This account system uses session-based authentication and requires cookies to be enabled to work. 

## How to Build (dev)

### Before starting
- Make sure you are in the server folder from root. 
- Port 3000 (for the client) and 5000 (for the server) are open. 
- Edit src/config/config.js file with your database information under "development" section. If you have a PostGreSQL database, put the credentials there. If not,
assign the development property with this object:
```
{
    dialect: "sqlite",
    storage: "./db.development.sqlite"
}
 ```


### Build Steps
Install server dependencies
``` console
npm install
```

Run server (dev server)
``` console
npm run dev
```

Install client dependencies
``` console
cd client
npm install
```


Run client (dev client)
``` Console
npm run start
```





## Screenshots 
![UrlShortStat Dashboard](https://i.imgur.com/s8ROyl4.png "")


