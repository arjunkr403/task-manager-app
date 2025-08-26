import dotenv from 'dotenv';

// load env for backend before importing any other module
dotenv.config({ path: '../.env.dev' });

// start the app
import('./index.js');
