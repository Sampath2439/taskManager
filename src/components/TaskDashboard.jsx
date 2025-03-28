import React, { useState, useEffect } from 'react';
import { PlusIcon, XIcon } from 'lucide-react';
import StatusDropdown from './statusDropdown';
import Toast from './Toast'; // Import the new Toast component

const API_URL = 'https://taskmanagerbackend-production-b37e.up.railway.app/api/tasks';

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ name: '', status: 'Pending' });
  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState('success'); // Add this for toast type

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      showNotification('Error fetching tasks!', 'error');
    }
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000);
    return () => clearInterval(interval);
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification(message);
    setNotificationType(type);
    setTimeout(() => {
      setNotification(null);
      setNotificationType('success');
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const task = {
      name: newTask.name,
      status: newTask.status,
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
      
      if (!response.ok) throw new Error('Failed to add task');
      
      await fetchTasks();
      setNewTask({ name: '', status: 'Pending' });
      setIsModalOpen(false);
      showNotification('Task added successfully!', 'success');
    } catch (error) {
      console.error('Error adding task:', error);
      showNotification('Error adding task!', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete task');
      
      await fetchTasks();
      showNotification('Task deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting task:', error);
      showNotification('Error deleting task!', 'error');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus,
          completed_at: newStatus === 'Completed' ? new Date().toISOString() : null
        }),
      });
      
      if (!response.ok) throw new Error('Failed to update task status');
      
      await fetchTasks();
      showNotification(
        newStatus === 'Completed' ? 'Task marked as completed!' : 'Task status updated!',
        'success'
      );
    } catch (error) {
      console.error('Error updating task status:', error);
      showNotification('Error updating task status!', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      {/* New Toast Notification */}
      {notification && (
        <Toast 
          message={notification}
          type={notificationType}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Rest of the component remains the same */}
      <div className="mb-6 flex flex-row justify-between items-center gap-4 hidden lg:flex">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 w-auto">Task Dashboard</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center sm:justify-start gap-2 hover:bg-blue-700 transition sm:w-auto"
        >
          <PlusIcon size={20} />
          Add Task
        </button>
      </div>

      <div className="rounded-lg lg:shadow overflow-hidden">
        <div className="hidden lg:block">
          <table className="min-w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Name</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed At</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {tasks.map((task, index) => (
                <tr
                  key={task.id}
                  className={task.status === 'Completed' ? 'line-through text-gray-400' : ''}
                >
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">{index + 1}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">{task.name}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <StatusDropdown
                      status={task.status}
                      onStatusChange={(newStatus) => handleStatusChange(task.id, newStatus)}
                    />
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                    {task.created_at ? new Date(task.created_at._seconds * 1000).toLocaleString() : 'N/A'}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                    {task.completed_at ? new Date(task.completed_at._seconds * 1000).toLocaleString() : 'To be Completed'}
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

        {/* Mobile View */}
        <div className="mb-6 flex flex-col sm:flex-column sm:justify-center sm:items-center gap-4 block lg:hidden">
          <h1 className="text-5xl font-bold text-gray-800 w-full text-center">Task Dashboard</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white text-3xl px-4 py-6 rounded-3xl flex items-center justify-center gap-2 hover:bg-blue-700 transition w-full"
          >
            <PlusIcon size={20} />
            Add Task
          </button>
        </div>

        <div className="block lg:hidden bg-white border border-gray-200 shadow-lg rounded-lg">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className={`p-4 border-b ${task.status === 'Completed' ? 'line-through text-gray-400' : ''}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-xl text-gray-500">Task #{index + 1}</span>
                  <h3 className={`mt-2 text-2xl ${task.status === 'Completed' ? 'font-medium line-through text-gray-400' : 'font-bold text-gray-900'}`}>{task.name}</h3>
                </div>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-red-600 hover:text-red-900 text-xl"
                >
                  Delete
                </button>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xl text-gray-500">Status:</span>
                  <StatusDropdown
                    status={task.status}
                    onStatusChange={(newStatus) => handleStatusChange(task.id, newStatus)}
                  />
                </div>
                <div className="text-xl text-gray-500">
                  Created: {new Date(task.created_at._seconds * 1000).toLocaleString()}
                </div>
                <div className="text-xl text-gray-500">
                  Completed: {task.completed_at ? new Date(task.completed_at._seconds * 1000).toLocaleString() : 'To be Completed'}
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
