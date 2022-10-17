console.clear();

/*   Modules    */

const chalk = require('chalk');
const cookieParser = require('cookie-parser')
require('dotenv').config()


/*  Express */

const port = process.env.port || 8000
const host = process.env.host || '127.0.0.1'

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
const version = require('./package.json').version;


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
const adapter = new FileSync("./db/db.json")

const db_init = low(adapter)


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

server.listen(port, host, (error) => {
    if (error) {
        throw Error(error)
    }
    console.log(chalk.green('Server started successfully!\n'));

    console.log(`App listening on port: ${chalk.underline(port)}\nVersion: ${version}\n\n${chalk.bold('  URL:    ')}${host}\n`);
    console.log('Users socket ID:');
})