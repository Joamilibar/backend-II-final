import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import { engine } from 'express-handlebars';
import path from 'path';
import mongoose from './config/database.js';
import MongoStore from 'connect-mongo';
import sessionsRouter from './routes/api/sessions.router.js';
import viewsRouter from './routes/views.router.js';
import productsRouter from './routes/api/products.router.js';
import cartsRouter from './routes/api/carts.router.js';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import cookieParser from 'cookie-parser';
import Utils from './common/utils.js';




const app = express();
const PORT = 8080;


app.engine('hbs', engine({
    helpers: {
        gt: (a, b) => a > b,
        lt: (a, b) => a < b,
        add: (a, b) => a + b,
        subtract: (a, b) => a - b
    },
    extname: 'hbs',
    defaultLayout: 'main.hbs',
    // layoutsDir: path.join(Utils.__dirname, 'views/layouts'),
    // partialsDir: path.join(Utils.__dirname, 'views/partials'),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));


app.set('view engine', 'hbs');
app.set('views', './src/views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
}))

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/sessions', sessionsRouter);
app.use('/api', productsRouter);
app.use('/api', cartsRouter)
app.use('/', viewsRouter);

app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
});