export default function BidCard({ bid, isOwner, onHire }) {
    const statusColors = {
        pending: 'bg-gray-100 text-gray-800',
        hired: 'bg-secondary text-white',
        rejected: 'bg-red-100 text-red-800',
    };

    return (
        <div className={`p-4 rounded-lg border ${bid.status === 'hired' ? 'border-secondary bg-teal-50' : 'border-gray-200 bg-white'}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-gray-800">{bid.bidder.fullName}</h4>
                    <p className="text-sm text-gray-500">{bid.bidder.email}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold ${statusColors[bid.status]}`}>
                    {bid.status.toUpperCase()}
                </span>
            </div>

            <p className="mt-3 text-gray-700">{bid.message}</p>

            <div className="mt-4 flex justify-between items-center">
                <span className="font-bold text-lg">₹{bid.price}</span>
                {isOwner && bid.status === 'pending' && (
                    <button
                        onClick={() => onHire(bid._id)}
                        className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-700 transition"
                    >
                        Hire Freelancer
                    </button>
                )}
            </div>
        </div>
    );
}
