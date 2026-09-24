'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import KanbanBoard from '@/components/KanbanBoard';
import TableView from '@/components/TableView';
import CalendarView from '@/components/CalendarView';
import AllocationView from '@/components/AllocationView';
import DocsEditor from '@/components/DocsEditor';
import TaskModal from '@/components/TaskModal';
import InitiativeModal from '@/components/InitiativeModal';
import QuickFindModal from '@/components/QuickFindModal';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  addTaskComment,
  getMembers,
  getAllocationMatrix,
  getProjects,
  createProject,
  deleteProject,
  getDocs,
  createDoc,
  updateDoc,
  deleteDoc,
  getSocket
} from '@/lib/api';

export default function Home() {
  const [activeView, setActiveView] = useState('board');
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [docs, setDocs] = useState([]);
  const [allocationData, setAllocationData] = useState([]);

  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isInitiativeModalOpen, setIsInitiativeModalOpen] = useState(false);
  const [isQuickFindOpen, setIsQuickFindOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load initial data
  const loadAllData = useCallback(async () => {
    try {
      const [membersRes, projectsRes, docsRes] = await Promise.all([
        getMembers().catch(() => []),
        getProjects().catch(() => []),
        getDocs().catch(() => [])
      ]);

      setMembers(membersRes);
      if (membersRes.length > 0 && !currentUserId) {
        setCurrentUserId(membersRes[0]._id);
      }

      setProjects(projectsRes);
      setDocs(docsRes);
      if (docsRes.length > 0 && !selectedDocId) {
        setSelectedDocId(docsRes[0].id);
      }

      // Load tasks and allocations
      await refreshTasks();
      await refreshAllocations();
    } catch (err) {
      console.error('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUserId, selectedDocId]);

  const refreshTasks = async () => {
    try {
      const params = {};
      if (selectedProject) params.projectId = selectedProject;
      if (priorityFilter) params.priority = priorityFilter;
      if (assigneeFilter) params.assignee = assigneeFilter;
      if (searchQuery) params.search = searchQuery;

      const tasksRes = await getTasks(params);
      setTasks(tasksRes);
    } catch (e) {
      console.error('Error loading tasks:', e);
    }
  };

  const refreshAllocations = async () => {
    try {
      const matrix = await getAllocationMatrix();
      setAllocationData(matrix);
    } catch (e) {
      console.error('Error loading allocation matrix:', e);
    }
  };

  // Re-fetch when filters change
  useEffect(() => {
    refreshTasks();
  }, [selectedProject, priorityFilter, assigneeFilter, searchQuery]);

  // Initial mount, WebSockets & Keyboard shortcuts
  useEffect(() => {
    loadAllData();

    // Command/Ctrl + K shortcut for Quick Find
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsQuickFindOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const socket = getSocket();
    if (socket) {
      socket.on('connect', () => setIsConnected(true));
      socket.on('disconnect', () => setIsConnected(false));

      socket.on('task:created', (newTask) => {
        setTasks((prev) => [newTask, ...prev.filter((t) => t._id !== newTask._id)]);
        refreshAllocations();
      });

      socket.on('task:updated', (updated) => {
        setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
        refreshAllocations();
      });

      socket.on('task:deleted', (deletedId) => {
        setTasks((prev) => prev.filter((t) => t._id !== deletedId));
        refreshAllocations();
      });
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (socket) {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('task:created');
        socket.off('task:updated');
        socket.off('task:deleted');
      }
    };
  }, []);

  // Task Actions
  const handleSaveTask = async (taskData, id) => {
    try {
      if (id) {
        const updated = await updateTask(id, taskData);
        setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
      } else {
        const created = await createTask(taskData);
        setTasks((prev) => [created, ...prev]);
      }
      refreshAllocations();
    } catch (err) {
      console.error('Failed to save task:', err);
    }
  };

  const handleQuickCreateTask = async ({ title, status }) => {
    try {
      const activeMember = members.find((m) => m._id === currentUserId) || members[0];
      const payload = {
        title,
        status,
        priority: 'medium',
        projectId: selectedProject || projects[0]?._id,
        assignees: activeMember ? [activeMember._id] : [],
        estimatedHours: 4,
        dueDate: new Date(Date.now() + 86400000 * 3).toISOString()
      };
      const created = await createTask(payload);
      setTasks((prev) => [created, ...prev]);
      refreshAllocations();
    } catch (err) {
      console.error('Failed to quick create task:', err);
    }
  };

  const handleUpdateTask = async (id, fields) => {
    try {
      const updated = await updateTask(id, fields);
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
      refreshAllocations();
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      refreshAllocations();
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleAddComment = async (taskId, comment) => {
    try {
      const updated = await addTaskComment(taskId, comment);
      setTasks((prev) => prev.map((t) => (t._id === taskId ? updated : t)));
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  // SQLite Doc Actions
  const handleCreateDoc = async () => {
    try {
      const newDoc = await createDoc({
        title: 'Untitled Document',
        icon: '📝',
        content: '# Untitled Document\n\nStart typing notes or guidelines here...'
      });
      setDocs((prev) => [newDoc, ...prev]);
      setSelectedDocId(newDoc.id);
      setActiveView('docs');
    } catch (err) {
      console.error('Failed to create doc in SQLite:', err);
    }
  };

  const handleUpdateDoc = async (id, fields) => {
    try {
      const updated = await updateDoc(id, fields);
      setDocs((prev) => prev.map((d) => (d.id === id ? updated : d)));
    } catch (err) {
      console.error('Failed to update doc in SQLite:', err);
    }
  };

  const handleDeleteDoc = async (id, title = 'this document') => {
    if (!confirm(`Are you sure you want to delete document "${title}" from SQLite?`)) return;
    try {
      await deleteDoc(id);
      const remaining = docs.filter((d) => d.id !== id);
      setDocs(remaining);
      if (selectedDocId === id) {
        setSelectedDocId(remaining[0]?.id || null);
      }
    } catch (err) {
      console.error('Failed to delete doc:', err);
    }
  };

  const handleSearchDocs = async (q) => {
    try {
      const results = await getDocs(q);
      setDocs(results);
    } catch (err) {
      console.error('Failed to search docs:', err);
    }
  };

  // BSCF Initiative Actions
  const handleSaveProject = async (projectData) => {
    try {
      const created = await createProject(projectData);
      setProjects((prev) => [...prev, created]);
      setSelectedProject(created._id);
    } catch (err) {
      console.error('Failed to create project:', err);
      alert('Failed to create initiative');
    }
  };

  const handleDeleteProject = async (id, name = 'this initiative') => {
    if (!confirm(`Are you sure you want to delete initiative "${name}"?`)) return;
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
      if (selectedProject === id) {
        setSelectedProject(null);
      }
    } catch (err) {
      console.error('Failed to delete initiative:', err);
      alert('Failed to delete initiative');
    }
  };

  // Modal helpers
  const handleOpenTaskModal = (task = null) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleOpenCreateTaskWithDate = (date) => {
    setEditingTask({
      title: '',
      status: 'todo',
      priority: 'medium',
      dueDate: date.toISOString(),
      projectId: selectedProject || projects[0]?._id,
      assignees: currentUserId ? [currentUserId] : []
    });
    setIsTaskModalOpen(true);
  };

  const currentMember = members.find((m) => m._id === currentUserId) || members[0];

  return (
    <div className="flex h-screen w-screen bg-[#fbfbfa] text-zinc-900 overflow-hidden paper-canvas">
      {/* AppFlowy Style Sidebar */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        projects={projects}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        docs={docs}
        selectedDocId={selectedDocId}
        setSelectedDocId={setSelectedDocId}
        onOpenCreateDoc={handleCreateDoc}
        onOpenCreateProject={() => setIsInitiativeModalOpen(true)}
        onDeleteProject={handleDeleteProject}
        onDeleteDoc={handleDeleteDoc}
        onOpenSearch={() => setIsQuickFindOpen(true)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <Header
          activeView={activeView}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          onOpenCreateTask={() => handleOpenTaskModal(null)}
          onOpenCreateDoc={handleCreateDoc}
        />

        {/* Dynamic View Rendering */}
        <main className="flex-1 flex overflow-hidden">
          {activeView === 'board' && (
            <KanbanBoard
              tasks={tasks}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onOpenTaskModal={handleOpenTaskModal}
              onQuickCreateTask={handleQuickCreateTask}
            />
          )}

          {activeView === 'table' && (
            <TableView
              tasks={tasks}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onOpenTaskModal={handleOpenTaskModal}
            />
          )}

          {activeView === 'calendar' && (
            <CalendarView
              tasks={tasks}
              onOpenTaskModal={handleOpenTaskModal}
              onOpenCreateTaskWithDate={handleOpenCreateTaskWithDate}
            />
          )}

          {activeView === 'allocation' && (
            <AllocationView
              allocationData={allocationData}
              onOpenTaskModal={handleOpenTaskModal}
            />
          )}

          {activeView === 'docs' && (
            <DocsEditor
              docs={docs}
              selectedDocId={selectedDocId}
              setSelectedDocId={setSelectedDocId}
              onCreateDoc={handleCreateDoc}
              onUpdateDoc={handleUpdateDoc}
              onDeleteDoc={handleDeleteDoc}
              onSearchDocs={handleSearchDocs}
            />
          )}
        </main>
      </div>

      {/* Task Creation & Inspector Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
        onSaveTask={handleSaveTask}
        onDeleteTask={handleDeleteTask}
        onAddComment={handleAddComment}
        members={members}
        projects={projects}
        currentMember={currentMember}
      />

      {/* Custom Initiative Modal (replaces browser prompt) */}
      <InitiativeModal
        isOpen={isInitiativeModalOpen}
        onClose={() => setIsInitiativeModalOpen(false)}
        onCreateProject={handleSaveProject}
      />

      {/* Quick Find (⌘K) Command Palette Modal */}
      <QuickFindModal
        isOpen={isQuickFindOpen}
        onClose={() => setIsQuickFindOpen(false)}
        tasks={tasks}
        projects={projects}
        docs={docs}
        members={members}
        onSelectView={setActiveView}
        onSelectProject={setSelectedProject}
        onSelectDoc={setSelectedDocId}
        onOpenTaskModal={handleOpenTaskModal}
      />
    </div>
  );
}
