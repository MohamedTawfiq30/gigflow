import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function GigCard({ gig }) {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const statusColors = {
        open: 'bg-green-100 text-green-800',
        assigned: 'bg-amber-100 text-amber-800',
        completed: 'bg-blue-100 text-blue-800',
    };

    const handleClick = () => {
        if (!user) {
            navigate('/auth');
        } else {
            navigate(`/gigs/${gig._id}`);
        }
    };

    return (
        <div onClick={handleClick} className="block cursor-pointer">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition border border-gray-100 h-full flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-gray-800 line-clamp-2">{gig.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[gig.status]}`}>
                            {gig.status.toUpperCase()}
                        </span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-3">{gig.description}</p>
                </div>

                <div className="flex justify-between items-center text-sm border-t pt-4 mt-2">
                    <span className="font-semibold text-primary text-lg">₹{gig.budget}</span>
                    <div className="text-right">
                        <p className="text-gray-500">Posted by {gig.owner?.fullName}</p>
                        <p className="text-gray-400 text-xs">{new Date(gig.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
