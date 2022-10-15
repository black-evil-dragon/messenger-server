console.clear();

/*   Modules    */

const chalk = require('chalk');

const cookieParser = require('cookie-parser')


/*  Express */

const port = 8000
const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

/*  Express — Routes  */
require('./src/routes/routes')(app);



/*  Server  */

const http = require('http');
const server = http.createServer(app)


/*  Socket  */

const socket = require('socket.io')
const io = socket(server, {
    cors: {
        origin: '*',
        credential: true
    },
    cookie: {
        name: "authToken",
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24
      }
})

require('./src/socket/socket')(io);


/*  DataBase  */

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync("tmp/db.json")

const db_init = low(adapter)

const version = '0.0.3.12'
const proxy = '192.168.0.10'

db_init.defaults(
    {
        users: [],
        chats: [],
        temp: {
            userOnline: [],
            noticeTemp: []
        }
    }
).write()
db_init.get('temp').set('userOnline', []).write()

/*   Server     */

console.log(chalk.green('Server started successfully!\n'));

server.listen(port, (error) => {
    if (error) {
        throw Error(error)
    }
    console.log(`App listening on port: ${chalk.underline(port)}\nVersion: ${version}\n\n${chalk.bold('  URL:    ')}${proxy}\n`);
    console.log('Users socket ID:');
})