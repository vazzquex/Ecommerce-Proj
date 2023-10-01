// Dependencies
import mongoose from 'mongoose';
import express from 'express';
import { Server } from 'socket.io';

import handlebars from 'express-handlebars';
import exphbs from 'express-handlebars';
import Handlebars from 'handlebars';

import swaggerJsDocs from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import cors from 'cors';

import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';

import productController from './controllers/product.controller.js';

//middleware
import { isAdmin, isAuth } from './middleware/auth.middleware.js';
import { loggerMiddleware } from './middleware/logger.middleware.js';

//passport
import incializePassport from './config/passport.confg.js';

//data
// import dataProducts from './data/products.json' assert {type: 'json'};

//model
import productModel from './DAOs/models/products.model.js';

//routes
import sessionsRouter from './routes/sessions.router.js';
import viewsRouter from './routes/views.router.js';
import viewsCartsRouter from './routes/views.cart.router.js'
import productsRouter from './routes/products.router.js';
import realTimeProductsRouter from './routes/realTimeProducts.router.js';
import chatRouter from './routes/chat.router.js';
import cartsRouter from './routes/carts.router.js';
import usersRouter from './routes/user.router.js';
import profileRouters from './routes/profile.router.js';
import mockingRouters from './routes/mocking.router.js';
import loggerTest from './routes/logger.test.router.js';
import documentationRouter from './routes/documentation.router.js';
import restoreRouter from './routes/restore.router.js';

import adminConsoleRouter from './routes/admin.console.js';

// Config
import config from './tools/config.js';
import mailingRoutes from './routes/mailing.js';

const app = express();
const port = 8080;

const corsOptions = {
	origin: 'http://localhost:8080',  // Reemplaza con la IP y puerto de tu servidor
	optionsSuccessStatus: 204,
  };

//app.use(cors(corsOptions));

app.use(loggerMiddleware);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('./src/public'));

//Handlebars

const handlebarsInstance = exphbs.create({
	handlebars: Handlebars
});

// Registrar el ayudante "eq"
Handlebars.registerHelper('eq', function (a, b) {
	return a === b;
});

app.engine('handlebars', handlebars.engine());
app.set('views', './src/views');
app.set('view engine', 'handlebars');

// Swagger Options for API
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'CoderShop API',
            version: '1.0.0',
            description: 'CoderShop API documentation'
        }
    },
    apis: ['./docs/**/*.yaml']
}
const spects = swaggerJsDocs(swaggerOptions)


//Coockies
app.use(cookieParser(config.secret));

// Session
app.use(
	session({
		store: MongoStore.create({
			mongoUrl:
				config.mongoUrl,
			mongoOptions: {
				useNewUrlParser: true,
			},
			ttl: 6000,
		}),
		secret: config.secret,
		resave: true,
		saveUninitialized: true,
	})
);

mongoose.set("strictQuery", false);
try {
	await mongoose.connect(config.mongoUrl);
} catch {
	console.error(`Database connection failed: ${error}`);
};

incializePassport();

app.use('/docs', isAdmin,swaggerUi.serve, swaggerUi.setup(spects))
app.use("/", profileRouters);

// api
app.use("/api/sessions", sessionsRouter);		
app.use("/api/users", usersRouter)				
app.use("/api/products", productsRouter);		
app.use("/api/carts", cartsRouter);				

//insert product data

// try {
//     await productModel.insertMany(dataProducts);
// } catch (err) {
//     console.log(`error al insertar data: ${err} `);
// }


const httpServer = app.listen(port, () => {
	console.log(`Escuchando por el puerto ${port}`);
});
const socketServer = new Server(httpServer);

//Routers
app.use("/products", profileRouters);
app.use("/carts", viewsCartsRouter);
app.use('/realTimeProducts', realTimeProductsRouter(socketServer));
app.use("/chat", chatRouter(socketServer));
app.use("/mockingproducts", mockingRouters);
app.use("/loggerTest", loggerTest)
app.use("/documentation", documentationRouter)
app.use("/restore", restoreRouter)
app.use("/admin-console", isAdmin, adminConsoleRouter)

//mailing
app.use('/api/sending', mailingRoutes)

