const config = require('./src/config.js');
const app = require('./src/app.js')(config);
'use strict';

app.listen(app.context.port, () => {
    console.log(`Server started on port ${app.context.port}`);