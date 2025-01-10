import { db } from '../config/firebase-config.js';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc
} from 'firebase/firestore';

export const getTasks = async (req, res) => {
  try {
    const tasksCollection = collection(db, 'tasks');
    const tasksSnapshot = await getDocs(tasksCollection);
    const tasksList = tasksSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(tasksList);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

export const createTask = async (req, res) => {
  try {
    const { name, status } = req.body;
    const task = {
      name,
      status,
      created_at: new Date().toISOString(),
      completed_at: null,
    };

    const docRef = await addDoc(collection(db, 'tasks'), task);
    res.status(201).json({ id: docRef.id, ...task });
  } catch (error) {
    res.status(500).json({ message: 'Error creating task' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteDoc(doc(db, 'tasks', id));
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const taskRef = doc(db, 'tasks', id);
    const updateData = {
      status,
      completed_at: status === 'Completed' ? new Date().toISOString() : null
    };

    await updateDoc(taskRef, updateData);

    if (status === 'Completed') {
      const task = (await getDoc(taskRef)).data();
      await addDoc(collection(db, 'completed_tasks'), {
        name: task.name,
        completed_at: updateData.completed_at,
        created_at: task.created_at,
      });
    }

    res.json({ id, ...updateData });
  } catch (error) {
    res.status(500).json({ message: 'Error updating task status' });
  }
};