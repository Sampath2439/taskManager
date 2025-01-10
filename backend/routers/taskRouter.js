import express from 'express';
import { 
  getTasks,
  createTask,
  deleteTask,
  updateTaskStatus,
} from '../controllers/taskController.js';

const router = express.Router();

router.get('/tasks', getTasks);
router.post('/tasks', createTask);
router.delete('/tasks/:id', deleteTask);
router.patch('/tasks/:id/status', updateTaskStatus);

export default router;