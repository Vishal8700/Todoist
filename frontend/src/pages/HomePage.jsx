
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Header from '../components/Header/Header.jsx';
import TaskList from '../components/TaskList/TaskList.jsx';
import TaskForm from '../components/TaskForm/TaskForm';
import TaskFilter from '../components/TaskFilter/TaskFilter';
import Calendar from '../components/Calendar/Calendar';
import MeetingForm from '../components/MeetingForm/MeetingForm';
import Footer from '../components/footer/Footer.jsx'; // Corrected import path to match file system casing
import Modal from '../components/Modal/Modal';
import { generateId } from '../utils/helpers';
import './HomePage.css';
import MemberList from '../components/MemberList/MemberList';
import AssignedTasksToggle from '../components/AssignedTasksToggle/AssignedTasksToggle'; // Import the new component

/**
 * HomePage component that serves as the main page of the application.
 * Manages tasks and meetings with calendar integration.
 * @returns {JSX.Element} The rendered HomePage component
 */
function HomePage() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState(() => {
    const savedMeetings = localStorage.getItem('meetings');
    return savedMeetings ? JSON.parse(savedMeetings) : [];
  });

  // Fetch all tasks function
  const fetchAllTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const tasks = await response.json();
      setTasks(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Fetch assigned tasks function
  const fetchAssignedTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/assigned`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch assigned tasks');
      }

      const data = await response.json();
      setAssignedTasks(data);
    } catch (error) {
      console.error('Error fetching assigned tasks:', error);
    }
  };

  useEffect(() => {
    fetchAllTasks();
  }, [API_BASE_URL]);

  // Removed the addTask function - TaskForm will handle API calls

  // Update deleteTask to use backend
  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks(prevTasks => prevTasks.filter(task => task._id !== id));
      // Also remove from assigned tasks if it was assigned
      setAssignedTasks(prevAssignedTasks => prevAssignedTasks.filter(task => task._id !== id));

    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Update toggleTaskCompletion to use backend
  // Note: This might become redundant if status replaces completed
  const toggleTaskCompletion = async (id) => {
    try {
      const task = tasks.find(t => t._id === id);
      if (!task) return; // Task not found

      // Determine new status based on current status
      let newStatus;
      if (task.status === 'completed') {
          newStatus = 'pending'; // Or 'in-progress' depending on desired flow
      } else {
          newStatus = 'completed';
      }


      const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
        method: 'PATCH', // Using PATCH for status update
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        },
        body: JSON.stringify({ status: newStatus }), // Update status instead of completed
      });

      if (!response.ok) {
        throw new Error('Failed to update task status');
      }

      // Update the tasks state
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === id ? { ...task, status: newStatus } : task
        )
      );

      // If the task was also in assignedTasks, update its status there too
      setAssignedTasks(prevAssignedTasks =>
        prevAssignedTasks.map(task =>
          task._id === id ? { ...task, status: newStatus } : task
        )
      );


    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  // Update updateTask to use backend and handle status
  // This function will now be called by TaskForm's handleSubmit when editing
  const updateTask = (updatedTask) => {
      // TaskForm's handleSubmit already updated the backend.
      // We just need to update the state here.
      setTasks(prevTasks =>
        prevTasks.map(task => (task._id === updatedTask._id ? updatedTask : task))
      );
      // Also update in assigned tasks if it exists there
      setAssignedTasks(prevAssignedTasks =>
        prevAssignedTasks.map(task => (task._id === updatedTask._id ? updatedTask : task))
      );
      setEditTask(null);
      setShowTaskForm(false);
  };

  // Function to handle task creation after TaskForm submits successfully
  const handleTaskAdded = (newTask) => {
     
      setTasks(prevTasks => [...prevTasks, newTask]);

      fetchAssignedTasks(); 
      setShowTaskForm(false);
  };


  // Remove localStorage effect for tasks since we're using backend storage
  useEffect(() => {
    localStorage.setItem('meetings', JSON.stringify(meetings));
  }, [meetings]);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/members`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch members');
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [API_BASE_URL]); // Added API_BASE_URL to dependency array

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [editMeeting, setEditMeeting] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('date-asc');
  const [view, setView] = useState('tasks'); // 'tasks' or 'calendar'

  useEffect(() => {
    // Keep meetings in local storage if they are not backend-managed
    localStorage.setItem('meetings', JSON.stringify(meetings));
    // Tasks are now backend-managed, no need to save to local storage
    // localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [meetings]); // Removed tasks from dependency array

  const addMeeting = (meeting) => {
    const newMeeting = {
      ...meeting,
      id: generateId(),
    };
    setMeetings([...meetings, newMeeting]);
    setShowMeetingForm(false);
  };

  const updateMeeting = (updatedMeeting) => {
    setMeetings(
      meetings.map((meeting) => (meeting.id === updatedMeeting.id ? updatedMeeting : meeting))
    );
    setEditMeeting(null);
    setShowMeetingForm(false);
  };

  const deleteMeeting = (id) => {
    setMeetings(meetings.filter((meeting) => meeting.id !== id));
  };

  const handleEditTask = (task) => {
    setEditTask(task);
    setShowTaskForm(true);
  };

  const handleEditMeeting = (meeting) => {
    setEditMeeting(meeting);
    setShowMeetingForm(true);
  };

  const handleCalendarSlotSelect = (slotInfo) => {
    setShowMeetingForm(true);
  };

  const handleCalendarEventSelect = (event) => {
    if (event.type === 'meeting') {
      const meeting = meetings.find(m => m.id === event.id);
      if (meeting) handleEditMeeting(meeting);
    } else {
      // Assuming task events in calendar use _id from backend
      const task = tasks.find(t => t._id === event.id);
      if (task) handleEditTask(task);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    // Filter based on status instead of completed
    if (filter === 'all') return true;
    if (filter === 'active') return task.status !== 'completed';
    if (filter === 'completed') return task.status === 'completed';
    if (filter === 'high') return task.priority === 'high';
    if (filter === 'medium') return task.priority === 'medium';
    if (filter === 'low') return task.priority === 'low';
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sort === 'date-asc') {
      // Handle null/undefined due dates
      const dateA = a.dueDate ? new Date(a.dueDate) : new Date(8640000000000000); // Max date for null
      const dateB = b.dueDate ? new Date(b.dueDate) : new Date(8640000000000000); // Max date for null
      return dateA - dateB;
    }
    if (sort === 'date-desc') {
       // Handle null/undefined due dates
      const dateA = a.dueDate ? new Date(a.dueDate) : new Date(-8640000000000000); // Min date for null
      const dateB = b.dueDate ? new Date(b.dueDate) : new Date(-8640000000000000); // Min date for null
      return dateB - dateA;
    }
    if (sort === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    if (sort === 'alpha-asc') {
      return a.title.localeCompare(b.title);
    }
    if (sort === 'alpha-desc') {
      return b.title.localeCompare(a.title);
    }
    return 0;
  });

  const [assignedTasks, setAssignedTasks] = useState([]);

  // Fetch assigned tasks
  useEffect(() => {
    fetchAssignedTasks();
  }, [API_BASE_URL]);

  // Modify the assignedTask status update function
  const updateAssignedTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/assigned/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task status');
      }

      // Update the assignedTasks state
      const updatedAssignedTasks = assignedTasks.map(t =>
        t._id === taskId ? { ...t, status: newStatus } : t
      );
      setAssignedTasks(updatedAssignedTasks);

      // Fetch all tasks to get the updated main task status
      fetchAllTasks(); // Keep this to ensure the main task list reflects the status change
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  // Modify the return statement to include assigned tasks
  return (
    <div className="app">
      <Header
        onAddTask={() => {
            setEditTask(null); // Clear editTask when adding a new task
            setShowTaskForm(true);
        }}
        onAddMeeting={() => setShowMeetingForm(true)}
        view={view}
        onViewChange={setView}
      />
      <main className="main-content">
        {view === 'tasks' ? (
          <>
            <TaskFilter
              filter={filter}
              setFilter={setFilter}
              sort={sort}
              setSort={setSort}
            />
            {/* Add the new AssignedTasksToggle component here */}
            <AssignedTasksToggle
              assignedTasks={assignedTasks}
              onUpdateAssignedTaskStatus={updateAssignedTaskStatus}
            />
            <div className="tasks-container">

              {sortedTasks.length > 0 ? (
                <TaskList
                  tasks={sortedTasks}
                  onToggleComplete={toggleTaskCompletion} // Keep toggle for checkbox visual
                  onEdit={handleEditTask}
                  onDelete={deleteTask}
                  // Removed onUpdateTaskStatus prop
                />
              ) : (
                <div className="empty-state">
                  <h2>No tasks found</h2>
                  <p>Add a new task to get started or change your filters.</p>
                </div>
              )}
            </div>
          </>
        ) : view === 'calendar' ? (
          <Calendar
            tasks={tasks}
            meetings={meetings}
            onSelectSlot={handleCalendarSlotSelect}
            onSelectEvent={handleCalendarEventSelect}
          />
        ) : (
          <MemberList />
        )}
      </main>
      <Footer />

      <Modal isOpen={showTaskForm} onClose={() => {
        setShowTaskForm(false);
        setEditTask(null);
      }}>
        <TaskForm
          onSubmit={editTask ? updateTask : handleTaskAdded}
          editTask={editTask}
          users={users}
        />
      </Modal>

      <Modal isOpen={showMeetingForm} onClose={() => {
        setShowMeetingForm(false);
        setEditMeeting(null);
      }}>
        <MeetingForm
          onSubmit={editMeeting ? updateMeeting : addMeeting}
          editMeeting={editMeeting}
          onClose={() => setShowMeetingForm(false)}
        />
      </Modal>
    </div>
  );
}

HomePage.propTypes = {
  //not needed much more
};

export default HomePage;
