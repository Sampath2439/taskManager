// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-config.json');

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://taskmanagement-d4abb-default-rtdb.firebaseio.com',
});

// Get Firestore instance
const db = admin.firestore();

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Fetch tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const tasksSnapshot = await db.collection('tasks').get();
        const tasks = tasksSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Error fetching tasks' });
    }
});

// Add task
app.post('/api/tasks', async (req, res) => {
    try {
        const task = {
            ...req.body,
            created_at: admin.firestore.FieldValue.serverTimestamp(),
            completed_at: null
        };

        const docRef = await db.collection('tasks').add(task);
        const newTask = await docRef.get();

        res.status(201).json({
            id: docRef.id,
            ...newTask.data()
        });
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ error: 'Error adding task' });
    }
});

// Update task
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const task = req.body;

        // If status is being updated to 'Completed', add completed_at timestamp
        if (task.status === 'Completed') {
            task.completed_at = admin.firestore.FieldValue.serverTimestamp();
        }

        const taskRef = db.collection('tasks').doc(id);
        await taskRef.update(task);

        // Get the updated document
        const updatedTask = await taskRef.get();
        
        res.json({
            id,
            ...updatedTask.data()
        });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Error updating task' });
    }
});

// Delete task
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection('tasks').doc(id).delete();
        res.json({ id, message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Error deleting task' });
    }
});

// Add endpoint for updating task status specifically
app.patch('/api/tasks/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const taskRef = db.collection('tasks').doc(id);
        const updateData = {
            status,
            completed_at: status === 'Completed' ? admin.firestore.FieldValue.serverTimestamp() : null
        };

        await taskRef.update(updateData);

        // If task is completed, add to completed_tasks collection
        if (status === 'Completed') {
            const taskDoc = await taskRef.get();
            const taskData = taskDoc.data();
            
            await db.collection('completed_tasks').add({
                name: taskData.name,
                created_at: taskData.created_at,
                completed_at: updateData.completed_at
            });
        }

        const updatedTask = await taskRef.get();
        res.json({
            id,
            ...updatedTask.data()
        });
    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).json({ error: 'Error updating task status' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));