import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';

type Project = { id: number; title: string; description?: string; createdAt: string };

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const load = async () => {
    const res = await API.get('/projects');
    setProjects(res.data);
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (title.trim().length < 3) return alert('Title min 3 chars');
    await API.post('/projects', { title, description: desc });
    setTitle(''); setDesc('');
    load();
  };

  const del = async (id: number) => {
    if (!confirm('Delete project?')) return;
    await API.delete(`/projects/${id}`);
    load();
  };

  return (
    <div className="max-w-2xl w-full mx-auto">
      <div className="card">
        <h2 className="heading mb-4">Projects</h2>
        <div className="flex gap-2 mb-4">
          <input className="input flex-1" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <input className="input flex-1" placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
          <button className="btn" onClick={create}>Create</button>
        </div>
        <ul className="space-y-2 text-lg">
          {projects.map(p => (
            <li key={p.id} className="flex items-center justify-between p-3 border rounded-lg">
              <Link className="text-brand-700 hover:underline" to={`/projects/${p.id}`}>{p.title}</Link>
              <button className="text-red-600 hover:underline" onClick={() => del(p.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

