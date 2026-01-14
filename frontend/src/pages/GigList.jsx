import { useEffect, useState } from 'react';
import api from '../services/api';
import GigCard from '../components/GigCard';

export default function GigList() {
    const [gigs, setGigs] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGigs = async () => {
            try {
                const res = await api.get(`/gigs${search ? `?search=${search}` : ''}`);
                setGigs(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        // Debounce search
        const timer = setTimeout(() => fetchGigs(), 500);
        return () => clearTimeout(timer);
    }, [search]);

    return (
        <div className="container mx-auto px-6 py-10">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-primary mb-4">Explore Opportunities</h1>
                <p className="text-slate-500 max-w-xl mx-auto mb-8">Find the perfect project for your skills or browse what others are working on.</p>

                <div className="max-w-2xl mx-auto relative">
                    <input
                        type="text"
                        placeholder="Search by title or description..."
                        className="w-full px-6 py-4 rounded-full border-2 border-slate-200 focus:border-secondary outline-none shadow-sm text-lg transition"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20">Loading...</div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {gigs.length > 0 ? gigs.map(gig => (
                        <GigCard key={gig._id} gig={gig} />
                    )) : (
                        <div className="col-span-full text-center py-10 text-slate-500">
                            No gigs found matching "{search}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
