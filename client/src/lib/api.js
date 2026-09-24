import { io } from 'socket.io-client';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export function getSocket() {
  if (!socket && typeof window !== 'undefined') {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5
    });
  }
  return socket;
}

// Tasks API
export async function getTasks(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v) query.append(k, v);
  });
  const res = await fetch(`${API_BASE}/tasks?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}

export async function getTask(id) {
  const res = await fetch(`${API_BASE}/tasks/${id}`);
  if (!res.ok) throw new Error('Failed to fetch task');
  return res.json();
}

export async function createTask(taskData) {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData)
  });
  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
}

export async function updateTask(id, taskData) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData)
  });
  if (!res.ok) throw new Error('Failed to update task');
  return res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete task');
  return res.json();
}

export async function clearAllTasks() {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to clear tasks');
  return res.json();
}

export async function addTaskComment(id, comment) {
  const res = await fetch(`${API_BASE}/tasks/${id}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(comment)
  });
  if (!res.ok) throw new Error('Failed to add comment');
  return res.json();
}

// Members & Allocation API
export async function getMembers() {
  const res = await fetch(`${API_BASE}/members`);
  if (!res.ok) throw new Error('Failed to fetch members');
  return res.json();
}

export async function getAllocationMatrix() {
  const res = await fetch(`${API_BASE}/members/allocation-matrix`);
  if (!res.ok) throw new Error('Failed to fetch allocation matrix');
  return res.json();
}

// Projects API
export async function getProjects() {
  const res = await fetch(`${API_BASE}/projects`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

export async function createProject(projectData) {
  const res = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData)
  });
  if (!res.ok) throw new Error('Failed to create project');
  return res.json();
}

export async function deleteProject(id) {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete project');
  return res.json();
}

// SQLite Docs API
export async function getDocs(query = '') {
  const url = query ? `${API_BASE}/docs?q=${encodeURIComponent(query)}` : `${API_BASE}/docs`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch documents');
  return res.json();
}

export async function getDoc(id) {
  const res = await fetch(`${API_BASE}/docs/${id}`);
  if (!res.ok) throw new Error('Failed to fetch document');
  return res.json();
}

export async function createDoc(docData) {
  const res = await fetch(`${API_BASE}/docs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(docData)
  });
  if (!res.ok) throw new Error('Failed to create document');
  return res.json();
}

export async function updateDoc(id, docData) {
  const res = await fetch(`${API_BASE}/docs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(docData)
  });
  if (!res.ok) throw new Error('Failed to update document');
  return res.json();
}

export async function deleteDoc(id) {
  const res = await fetch(`${API_BASE}/docs/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete document');
  return res.json();
}
