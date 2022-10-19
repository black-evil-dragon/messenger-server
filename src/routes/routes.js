const Routes = require('../server');

module.exports = function (app) {/*
    app.use(function (req, res, next) {
        if ('OPTIONS' == req.method) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
            res.send(200);
        }
        else {
            next();
        }
    });*/

    app.get('/', Routes.homePage)
        .get('/users', Routes.getUsers)

        .post('/api/signup', Routes.SignUp)
        .post('/api/signin', Routes.SignIn)
        .post('/api/logout', Routes.logout)

        .post('/api/refresh', Routes.refresh)
        .post('/api/auth', Routes.authUser)
        .post('/api/update/data', Routes.updateData)

        .post('/api/delete/contact', Routes.deleteContact)

        .post('/api/chat/create', Routes.createChat)
        .post('/api/chat/delete', Routes.createChat)
}

