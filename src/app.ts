import bodyParser from 'body-parser';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';

// @ts-ignore
import routerConfig from './routes/config';
import ApplicationError from './errors/application-error';
import logger from './logger';
import { trackerMiddleware }  from './middlewares/tracker-middleware'


const app = express();
app.use(helmet())
app.use(
  cors({
    origin: (origin: any, cb: (arg0: null, arg1: boolean) => any) => cb(null, true),
    credentials: true,
    preflightContinue: true,
    exposedHeaders: [
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Origin, Origin, X-Requested-With, Content-Type, Accept',
      'X-Password-Expired',
    ],
    optionsSuccessStatus: 200,
  }),
);

function logResponseTime(req: Request, res: Response, next: NextFunction) {
  const startHrTime = process.hrtime();

  res.on('finish', () => {
    const tracker = trackerMiddleware({})
    const { trackID, env, originatingFunction } = tracker
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
    const message = `tracker_ID:${trackID} env:${env} originatingFunction:${originatingFunction} ${req.method} ${res.statusCode} ${elapsedTimeInMs}ms\t${req.path}`;
    logger.log({
      level: 'debug',
      message,
      consoleLoggerOptions: { label: 'API' },
    });
  });

  next();
}

let envVariable = process.env.DOMAIN_URL || '';
let domainUrl: string[] = envVariable.split('//');

const options = {
  swagger: '2.0',
  definition: {
    info: {
      version: 'v1.0.0',
      title: "Megathron API's",
      description: 'This lists and describes megathron api endpoints',
    },
    host: `${domainUrl[1]}`,
    basePath: '/api/v1',
    schemes: ['http', 'https'],
  },
  apis: ['./src/*/*.ts'],
};

const swaggerDocs = swaggerJSDoc(options);

app.use(logResponseTime);

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//Routes
routerConfig.forEach((rou: any[]) => {
  let route = rou[0];
  let router = rou[1];
  app.use(route, router);
});

process.on('uncaughtException', function (err) {
  console.log(`uncaughtException Error ${err}`);
});

app.use((err: ApplicationError, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }
  return res.status(err.status || 500).json({
    error: err.message,
  });
});

export default app;