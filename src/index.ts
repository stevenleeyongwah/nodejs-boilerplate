import express, {Request,Response,Application} from 'express';
// import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import { routes } from './routes';
import dotenv from 'dotenv'
import { URLSearchParams } from "url"

dotenv.config()

const app:Application = express();
const PORT = process.env.PORT || 8000;


// app.get("/", indexRouter);
app.use(cors());
// compresses all the responses
// app.use(compression());

// adding set of security middlewares
app.use(helmet());

// parse incoming request body and append data to `req.body`
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/api/', routes);
// add logger middleware
// app.use(logger);
app.get('/test', async (req: Request, res: Response) => {
  res.send('Hello World! This is a GET request.ss');
});

app.use('/api/', routes);

// add custom error handler middleware as the last middleware
// app.use(errorHandler);

app.listen(PORT, ():void => {
  console.log(`Server Running here 👉 http://localhost:${PORT}`);
});

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "root"
});

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
// });