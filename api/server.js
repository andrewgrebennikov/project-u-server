// See https://github.com/typicode/json-server#module
const jsonServer = require('json-server');

const server = jsonServer.create();

// Uncomment to allow write operations
const fs = require('fs');
const path = require('path');
const filePath = path.join('db.json');
const data = fs.readFileSync(filePath, "utf-8");
const db = JSON.parse(data);
const router = jsonServer.router(db);

// Comment out to allow write operations
// const router = jsonServer.router('db.json')

const middlewares = [jsonServer.defaults(), jsonServer.bodyParser];

server.use(middlewares)

server.post('/login', (req, res) => {
    try {
        const {username, password} = req.body;
        const {users = []} = db;

        const userFromBd = users.find((user) => user.username === username && user.password === password);

        if (userFromBd) {
            return res.json(userFromBd);
        }

        return res.status(403).json({message: 'User not found'});
    } catch (e) {
        console.log(e);
        return res.status(500).json({message: e.message});
    }
});

server.use((req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).json({message: 'AUTH ERROR'});
    }

    next();
});

// Add this before server.use(router)
server.use(jsonServer.rewriter({
    '/api/*': '/$1',
    '/blog/:resource/:id/show': '/:resource/:id'
}))
server.use(router)
server.listen(3000, () => {
    console.log('JSON Server is running')
})

// Export the Server API
module.exports = server
