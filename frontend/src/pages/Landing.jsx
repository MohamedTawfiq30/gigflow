import { Link } from 'react-router-dom';

export default function Landing() {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="bg-primary text-white py-24 px-6 text-center rounded-b-[3rem] shadow-2xl">
                <h1 className="text-5xl md:text-6xl font-extrabold mb-6 animate-fade-in-up">
                    Work <span className="text-secondary">Smart</span>, Earn <span className="text-secondary">Big</span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto">
                    The premium marketplace for top-tier freelancers and visionary clients.
                </p>
                <div className="flex justify-center gap-4">
                    <Link to="/gigs/new" className="bg-secondary text-primary px-8 py-3 rounded-full font-bold hover:bg-teal-400 transition transform hover:-translate-y-1 shadow-lg">
                        Post a Gig
                    </Link>
                    <Link to="/gigs" className="bg-transparent border-2 border-secondary text-secondary px-8 py-3 rounded-full font-bold hover:bg-secondary hover:text-primary transition transform hover:-translate-y-1">
                        Find Work
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-6 py-20">
                <h2 className="text-3xl font-bold text-center text-primary mb-12">Why GigFlow?</h2>
                <div className="grid md:grid-cols-4 gap-8">
                    {[
                        { title: "Instant Hire", desc: "Connect with talent in minutes." },
                        { title: "Secure Payments", desc: "Your money is safe with us." },
                        { title: "Verified Pros", desc: "Top 1% of freelancers." },
                        { title: "24/7 Support", desc: "We're here to help anytime." }
                    ].map((feature, i) => (
                        <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 border border-slate-100">
                            <h3 className="text-xl font-bold text-primary mb-2">{feature.title}</h3>
                            <p className="text-slate-500">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
