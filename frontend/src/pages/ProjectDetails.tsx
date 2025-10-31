import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';

type T = { id: number; title: string; dueDate?: string | null; isCompleted: boolean; projectId: number };

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState<{ id: number; title: string; description?: string; tasks: T[] } | null>(null);
  const [title, setTitle] = useState('');
  const [due, setDue] = useState('');

  const load = async () => {
    const res = await API.get(`/projects/${id}`);
    setProject(res.data);
  };

  useEffect(() => { load(); }, [id]);

  const addTask = async () => {
    if (!title.trim()) return alert('Task title required');
    await API.post(`/projects/${id}/tasks`, { title, dueDate: due || null });
    setTitle(''); setDue('');
    load();
  };

  const toggle = async (taskId: number) => {
    await API.post(`/tasks/${taskId}/toggle`);
    load();
  };

  const del = async (taskId: number) => {
    if (!confirm('Delete task?')) return;
    await API.delete(`/tasks/${taskId}`);
    load();
  };

  const update = async (taskId: number) => {
    const newTitle = prompt('New title');
    if (!newTitle) return;
    await API.put(`/tasks/${taskId}`, { title: newTitle, dueDate: null });
    load();
  };

  if (!project) return <div className="max-w-2xl w-full mx-auto card">Loading...</div>;

  return (
    <div className="max-w-2xl w-full mx-auto">
      <div className="card">
        <h2 className="heading">{project.title}</h2>
        <p className="text-gray-600 mt-1">{project.description}</p>
        <div className="flex items-center gap-2 mt-4">
          <input className="input flex-1" placeholder="Task title" value={title} onChange={e => setTitle(e.target.value)} />
          <input className="input" type="date" value={due} onChange={e => setDue(e.target.value)} />
          <button className="btn" onClick={addTask}>Add Task</button>
        </div>
        <ul className="mt-4 space-y-2 text-lg">
          {project.tasks.map(t => (
            <li key={t.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <input type="checkbox" className="h-5 w-5" checked={t.isCompleted} onChange={() => toggle(t.id)} />
                <span>{t.title}</span>
                <span className="text-sm text-gray-500">(Due: {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '—'})</span>
              </div>
              <div className="flex items-center gap-3">
                <button className="text-brand-700 hover:underline" onClick={() => update(t.id)}>Edit</button>
                <button className="text-red-600 hover:underline" onClick={() => del(t.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

