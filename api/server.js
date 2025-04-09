const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../backend/.env') });
const { createServer } = require('http');
const app = require('../backend/dist/server').default;

createServer(app).listen(process.env.PORT || 3000);
