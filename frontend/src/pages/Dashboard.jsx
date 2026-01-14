import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import GigCard from '../components/GigCard';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';

export default function Dashboard() {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('gigs');
    const [myGigs, setMyGigs] = useState([]);
    const [myBids, setMyBids] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [gigsRes, bidsRes] = await Promise.all([
                    api.get('/gigs/my-gigs'),
                    api.get('/bids/my-bids')
                ]);
                setMyGigs(gigsRes.data);
                setMyBids(bidsRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchData();
    }, [user]);

    const handleDeleteGig = async (gigId) => {
        if (!confirm('Are you sure you want to delete this gig?')) return;
        try {
            await api.delete(`/gigs/${gigId}`);
            setMyGigs(myGigs.filter(g => g._id !== gigId));
        } catch (err) {
            alert('Failed to delete gig');
        }
    };

    const handleDeleteBid = async (bidId) => {
        if (!confirm('Are you sure you want to delete this proposal?')) return;
        try {
            await api.delete(`/bids/${bidId}`);
            setMyBids(myBids.filter(b => b._id !== bidId));
        } catch (err) {
            alert('Failed to delete proposal');
        }
    };

    if (loading) return <div className="p-10 text-center">Loading dashboard...</div>;

    return (
        <div className="container mx-auto px-6 py-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
                <Link to="/gigs/new" className="bg-secondary text-primary px-6 py-2 rounded-full font-bold shadow hover:bg-teal-400 transition">
                    + Post New Gig
                </Link>
            </div>

            <div className="flex space-x-6 border-b border-slate-200 mb-8">
                <button
                    onClick={() => setActiveTab('gigs')}
                    className={`pb-4 px-2 font-semibold ${activeTab === 'gigs' ? 'text-secondary border-b-2 border-secondary' : 'text-slate-500 hover:text-primary transition'}`}
                >
                    My Gigs ({myGigs.length})
                </button>
                <button
                    onClick={() => setActiveTab('bids')}
                    className={`pb-4 px-2 font-semibold ${activeTab === 'bids' ? 'text-secondary border-b-2 border-secondary' : 'text-slate-500 hover:text-primary transition'}`}
                >
                    My Bids ({myBids.length})
                </button>
            </div>

            {activeTab === 'gigs' ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myGigs.length > 0 ? myGigs.map(gig => (
                        <div key={gig._id} className="relative group">
                            <GigCard gig={gig} />
                            <button
                                onClick={(e) => { e.stopPropagation(); handleDeleteGig(gig._id); }}
                                className="absolute top-4 right-4 bg-red-100 text-red-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow hover:bg-red-200 z-10"
                                title="Delete Gig"
                            >
                                <FaTrash size={14} />
                            </button>
                        </div>
                    )) : <p className="text-slate-500">You haven't posted any gigs yet.</p>}
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myBids.length > 0 ? myBids.map(bid => (
                        <div key={bid._id} className="relative group">
                            <Link to={`/gigs/${bid.gig._id}`} className="block h-full">
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition h-full flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-lg mb-2">{bid.gig.title}</h3>
                                        <div className="flex justify-between items-center mb-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${bid.status === 'hired' ? 'bg-secondary text-white' :
                                                    bid.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {bid.status.toUpperCase()}
                                            </span>
                                            <span className="font-semibold">₹{bid.price}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleDeleteBid(bid._id); }}
                                className="absolute top-4 right-4 bg-red-100 text-red-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow hover:bg-red-200 z-10"
                                title="Delete Proposal"
                            >
                                <FaTrash size={14} />
                            </button>
                        </div>
                    )) : <p className="text-slate-500">You haven't bid on any gigs yet.</p>}
                </div>
            )}
        </div>
    );
}
