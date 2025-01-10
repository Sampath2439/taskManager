import React, { useState, useEffect } from 'react';
import { PlusIcon, XIcon } from 'lucide-react';
import { Alert, AlertDescription } from './Alert';
import StatusDropdown from './statusDropdown';
import { db } from './firebase-config';
import { collection, addDoc, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ name: '', status: 'Pending' });
  const [notification, setNotification] = useState(null);

  const fetchTasks = async () => {
    const tasksCollection = collection(db, 'tasks');
    const tasksSnapshot = await getDocs(tasksCollection);
    const tasksList = tasksSnapshot.docs.map((doc, index) => ({
      id: index + 1,
      ...doc.data(),
    }));
    setTasks(tasksList);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const task = {
      name: newTask.name,
      status: newTask.status,
      created_at: new Date().toISOString(),
      completed_at: null,
    };

    try {
      await addDoc(collection(db, 'tasks'), task);
      fetchTasks();
      setNewTask({ name: '', status: 'Pending' });
      setIsModalOpen(false);
      showNotification('Task added successfully!');
    } catch (error) {
      console.error('Error adding task:', error);
      showNotification('Error adding task!');
    }
  };

  const handleDelete = async (index) => {
    try {
      const tasksCollection = collection(db, 'tasks');
      const tasksSnapshot = await getDocs(tasksCollection);
      const taskDoc = tasksSnapshot.docs[index - 1];
      await deleteDoc(taskDoc.ref);
      fetchTasks();
      showNotification('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
      showNotification('Error deleting task!');
    }
  };

  const handleStatusChange = async (index, newStatus) => {
    try {
      const tasksCollection = collection(db, 'tasks');
      const tasksSnapshot = await getDocs(tasksCollection);
      const taskDoc = tasksSnapshot.docs[index - 1];
      const updatedTask = {
        status: newStatus,
        completed_at: newStatus === 'Completed' ? new Date().toISOString() : null,
      };
      await updateDoc(taskDoc.ref, updatedTask);
      
      if (newStatus === 'Completed') {
        await addDoc(collection(db, 'completed_tasks'), {
          id: index,
          name: taskDoc.data().name,
          completed_at: updatedTask.completed_at,
        });
      }

      fetchTasks();
      showNotification(
        newStatus === 'Completed' ? 'Task marked as completed!' : 'Task status updated!'
      );
    } catch (error) {
      console.error('Error updating task status:', error);
      showNotification('Error updating task status!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Task Dashboard</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center sm:justify-start gap-2 hover:bg-blue-700 transition w-full sm:w-auto"
        >
          <PlusIcon size={20} />
          Add Task
        </button>
      </div>

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto z-50">
          <Alert className="bg-green-100 border-green-400 text-green-800">
            <AlertDescription>{notification}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Task Table/Cards */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Name</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed At</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  className={task.status === 'Completed' ? 'line-through text-gray-400' : ''}
                >
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">{task.id}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">{task.name}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <StatusDropdown
                      status={task.status}
                      onStatusChange={(newStatus) => handleStatusChange(task.id, newStatus)}
                    />
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(task.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                    {task.completed_at ? new Date(task.completed_at).toLocaleString() : 'To be Completed'}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 border-b ${task.status === 'Completed' ? 'line-through text-gray-400' : ''}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-sm text-gray-500">#{task.id}</span>
                  <h3 className="font-medium text-gray-900">{task.name}</h3>
                </div>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-red-600 hover:text-red-900 text-sm"
                >
                  Delete
                </button>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status:</span>
                  <StatusDropdown
                    status={task.status}
                    onStatusChange={(newStatus) => handleStatusChange(task.id, newStatus)}
                  />
                </div>
                <div className="text-sm text-gray-500">
                  Created: {new Date(task.created_at).toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">
                  Completed: {task.completed_at ? new Date(task.completed_at).toLocaleString() : 'N/A'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">Add New Task</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <XIcon size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Task Name
                </label>
                <input
                  type="text"
                  value={newTask.name}
                  onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Status
                </label>
                <select
                  value={newTask.status}
                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 order-1 sm:order-2"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDashboard;
