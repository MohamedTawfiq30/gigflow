import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function CreateGig() {
    const [formData, setFormData] = useState({ title: '', description: '', budget: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/gigs', formData);
            navigate(`/gigs/${res.data._id}`);
        } catch (err) {
            alert(err.response?.data?.error || 'Error creating gig');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
                <h1 className="text-3xl font-bold text-primary mb-6">Post a New Gig</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Gig Title</label>
                        <input
                            type="text"
                            required
                            minLength={5}
                            placeholder="e.g., Build a React Website"
                            className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                        <textarea
                            required
                            minLength={20}
                            rows={5}
                            placeholder="Describe project details..."
                            className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Budget (₹)</label>
                        <input
                            type="number"
                            required
                            min={1}
                            className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
                            value={formData.budget}
                            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-secondary font-bold py-4 rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
                    >
                        {loading ? 'Posting...' : 'Publish Gig'}
                    </button>
                </form>
            </div>
        </div>
    );
}
