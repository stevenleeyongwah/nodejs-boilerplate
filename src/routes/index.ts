import express from 'express';
// import { loginRoute, authGoogleRoute, authGoogleCallbackRoute, meRoute } from './user';
// import { formBlockRoute } from './formBlock';
// import { formPublishRoute } from './form';
// import { formSubmissionRoute } from './formSubmission';
import { userRoute } from './user';

export const routes = express.Router();

routes.use(userRoute);
// routes.use(authGoogleRoute);
// routes.use(authGoogleCallbackRoute);
// routes.use(meRoute);
// routes.use(formBlockRoute);
// routes.use(formPublishRoute);
// routes.use(formSubmissionRoute);
// routes.use(workspaceRoute);

