const config = require('./src/config.js');
const app = require('./src/app.js')(config);

app.listen(app.context.port, () => {
<<<<<<< HEAD
    console.log(`Server started on port ${app.context.port}`);
=======
    console.log(`Server started on port ${app.context.port}`);
});
>>>>>>> parent of 91758dd... Hello World
