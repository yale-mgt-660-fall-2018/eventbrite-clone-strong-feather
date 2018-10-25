const Router = require('koa-router');
const indexControllers = require('../controllers/index.js');
const userControllers = require('../controllers/users.js');
const taskControllers = require('../controllers/tasks.js');
const { mustBeAuthorized, loadUserTasks } = require('../services/middleware.js');

const router = new Router();
router.get('/', loadUserTasks, indexControllers.index);
router.post('/user/login', userControllers.login);
router.post('/user/register', userControllers.register);
router.get('/user/logout', userControllers.logout);

router.use('/tasks/', mustBeAuthorized, loadUserTasks);
router.post('/tasks/create', taskControllers.create);
router.post('/tasks/:taskID/toggle', taskControllers.toggle);
router.post('/tasks/:taskID/delete', taskControllers.delete);

module.exports = router;
