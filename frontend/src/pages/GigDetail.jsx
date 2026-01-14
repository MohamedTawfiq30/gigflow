import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import BidCard from '../components/BidCard';

export default function GigDetail() {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [gig, setGig] = useState(null);
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);

    // Bid form state
    const [bidMessage, setBidMessage] = useState('');
    const [bidPrice, setBidPrice] = useState('');

    useEffect(() => {
        api.get(`/gigs/${id}`)
            .then(res => {
                setGig(res.data.gig);
                setBids(res.data.bids || []);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    const handleBidSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post(`/bids/${id}`, { message: bidMessage, price: bidPrice });
            setBids([...bids, { ...res.data, bidder: user }]); // Optimistic update
            setBidMessage('');
            setBidPrice('');
            alert('Bid placed successfully!');
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to place bid');
        }
    };

    const handleHire = async (bidId) => {
        if (!confirm('Are you sure you want to hire this freelancer?')) return;
        try {
            const res = await api.patch(`/gigs/${id}/hire/${bidId}`);
            setGig(res.data.gig);
            // Update local bids state
            setBids(bids.map(b => {
                if (b._id === bidId) return { ...b, status: 'hired' };
                return { ...b, status: 'rejected' };
            }));
        } catch (err) {
            alert(err.response?.data?.error || 'Hire failed');
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!gig) return <div className="p-10 text-center">Gig not found</div>;

    const isOwner = user && gig.owner?._id === user._id;
    const hasBid = bids.some(b => b.bidder._id === user?._id);

    return (
        <div className="container mx-auto px-6 py-10">
            <div className="grid lg:grid-cols-3 gap-10">
                {/* Left Column: Gig Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start mb-6">
                            <h1 className="text-3xl font-bold text-primary">{gig.title}</h1>
                            <span className={`px-4 py-2 rounded-full font-bold text-sm ${gig.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-secondary text-white'}`}>
                                {gig.status.toUpperCase()}
                            </span>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-slate-500 mb-8 pb-8 border-b border-slate-100">
                            <span>Posted by <strong className="text-slate-700">{gig.owner?.fullName || 'Unknown'}</strong></span>
                            <span>{new Date(gig.createdAt).toLocaleDateString()}</span>
                            <span>Budget: <strong className="text-primary text-lg">₹{gig.budget}</strong></span>
                        </div>

                        <div className="prose max-w-none text-slate-700">
                            <p className="whitespace-pre-line">{gig.description}</p>
                        </div>
                    </div>

                    {/* Bids Section */}
                    <div>
                        <h3 className="text-2xl font-bold text-primary mb-6">
                            {isOwner ? `Proposals (${bids.length})` : 'Your Proposal'}
                        </h3>

                        {bids.length > 0 ? (
                            <div className="space-y-4">
                                {bids.map(bid => (
                                    <BidCard
                                        key={bid._id}
                                        bid={bid}
                                        isOwner={isOwner}
                                        onHire={handleHire}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 italic">No proposals yet.</p>
                        )}
                    </div>
                </div>

                {/* Right Column: Action Box / Sidebar */}
                <div className="lg:col-span-1">
                    {user && !isOwner && gig.status === 'open' && !hasBid && (
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 sticky top-6">
                            <h3 className="text-xl font-bold text-primary mb-4">Place a Bid</h3>
                            <form onSubmit={handleBidSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Your Price (₹)</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full px-4 py-2 rounded border"
                                        value={bidPrice}
                                        onChange={e => setBidPrice(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Cover Letter</label>
                                    <textarea
                                        required
                                        minLength={10}
                                        rows={4}
                                        className="w-full px-4 py-2 rounded border"
                                        value={bidMessage}
                                        onChange={e => setBidMessage(e.target.value)}
                                    ></textarea>
                                </div>
                                <button type="submit" className="w-full bg-secondary text-primary font-bold py-3 rounded hover:bg-teal-400 transition">
                                    Send Proposal
                                </button>
                            </form>
                        </div>
                    )}

                    {isOwner && gig.status === 'open' && (
                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 sticky top-6">
                            <h3 className="font-bold text-blue-900 mb-2">Manage Gig</h3>
                            <p className="text-blue-800 text-sm">Review proposals below and click "Hire Freelancer" to assign this gig.</p>
                        </div>
                    )}

                    {!user && (
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center">
                            <p className="mb-4">Log in to bid on this gig.</p>
                            <Link to="/auth" className="block w-full bg-primary text-secondary py-2 rounded font-bold">Login</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
