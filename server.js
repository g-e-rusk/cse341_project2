/* eslint-disable no-undef */
const express = require('express');
const mongodb = require('./database/database');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');

const app = express();

const port = process.env.PORT || 3000;

app
    .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .use(session({
        secret: "secret",
        resave: false,
        saveUninitialized: true ,
    }))
    // Basic express session({..}) initialization
    .use(passport.initialize())
    // init passport on every route call
    .use(passport.session())
    // allow passport to use "express-session"
    .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-type, Accept, Z-key'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST, PUT, DELETE, OPTIONS');
    next();
})
    .use(cors({ 
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}))
    .use('/', require('./routes'))
    .use('/account', require('./routes/accounts'));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
async function(accessToken, refreshToken, profile, done) {
    try {
        const db = mongodb.getDatabase().db();

        let user = await db.collection('users').findOne({
            githubId: profile.id
        });

        if (!user) {
            user = {
                githubId: profile.id,
                username: profile.username,
                displayName: profile.displayName || profile.username,
                email: profile.emails?.[0]?.value || null,
                role: 'user', //default role
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            const result = await db.collection('users').insertOne(user);
            user._id = result.insertedId;
        }

        profile.dbUser = user;
        profile.role = user.role;

        return done(null, profile);
    } catch (error) {
        return done(error, null);
    }
   
}
));

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get('/', (req, res) => { 
    if (req.session.user !== undefined) {
        const user = req.session.user;
        const displayName = user.displayName || user.username || user._json?.name || user._json?.login || 'GitHub User';
        res.send(`Logged in as ${displayName}`);
    } else {
        res.send("Logged out");
    }
});

app.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/api-docs'}),
    (req, res) => {
        req.session.user = {
            ...req.user.dbUser,
            githubProfile: {
                username: req.user.username,
                displayName: req.user.displayName
            }
        };
        res.redirect('/');
    });

mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    }
    else {
        app.listen(port, () => {
    console.log(`Database is listening and node is running on port ${port}`)});
    }
});


