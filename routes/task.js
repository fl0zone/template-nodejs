const { Router } = require('express');
const { createTask, deleteTask, getTasks, getTask, updateTask  } = require('../controllers/task');

const router = Router();

router.post('/createTask', createTask);
router.get('/getTasks', getTasks);
router.get('/getTask', getTask);
router.put('/updateTask', updateTask );
router.delete('/deleteTask', deleteTask);

module.exports = router;