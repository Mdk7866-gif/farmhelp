'use client';

import {
    Sprout,
    MapPin,
    Cpu,
    Satellite,
    PhoneCall,
    LayoutDashboard,
    BrainCircuit,
    Users
} from 'lucide-react';

export default function AboutPage() {
    const steps = [
        {
            title: "1. Service Request",
            description: "Farmers fill out a simple application form online, or visit our nearest physical service center if they need assistance.",
            icon: <Users className="w-6 h-6 text-white" />,
            color: "bg-blue-500"
        },
        {
            title: "2. Farm Assessment",
            description: "Our expert team visits your farm locations to understand the geography and soil conditions to plan the sensor network.",
            icon: <MapPin className="w-6 h-6 text-white" />,
            color: "bg-amber-500"
        },
        {
            title: "3. IoT Installation",
            description: "We install advanced sensors for real-time Soil Moisture and Water Tank Level monitoring across all your fields.",
            icon: <Cpu className="w-6 h-6 text-white" />,
            color: "bg-purple-500"
        },
        {
            title: "4. Smart Monitoring",
            description: "Sensors continuously send data to the cloud (ThingSpeak). If critical levels are reached, you receive an instant automated call alert.",
            icon: <Satellite className="w-6 h-6 text-white" />,
            color: "bg-red-500"
        },
        {
            title: "5. Digital Dashboard",
            description: "Visit our website, enter your mobile number, and access a live dashboard showing data from all your farms in one place.",
            icon: <LayoutDashboard className="w-6 h-6 text-white" />,
            color: "bg-green-600"
        },
        {
            title: "6. AI Crop Prediction",
            description: "Click a button to let our Machine Learning model analyze your soil & season to recommend the top 3 most profitable crops.",
            icon: <BrainCircuit className="w-6 h-6 text-white" />,
            color: "bg-indigo-600"
        }
    ];

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">

            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-green-700 dark:text-green-500 tracking-tight">
                        Revolutionizing Agriculture
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300">
                        FarmHelp connects traditional farming with cutting-edge technology.
                        We provide a complete ecosystem—from physical sensors to AI-driven insights—helping you grow smarter and yield better.
                    </p>
                </div>
            </section>

            {/* Mission Statement */}
            <section className="py-16 px-4 max-w-5xl mx-auto text-center">
                <div className="inline-flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
                    <Sprout className="w-8 h-8 text-green-700 dark:text-green-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    To empower every farmer, regardless of technical expertise or education, with advanced tools to monitor their land, save water, and maximize crop production through data-driven decisions.
                </p>
            </section>

            {/* How It Works (Winding Timeline for Desktop / Vertical for Mobile) */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900/50">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-16">
                        How FarmHelp Works
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className="relative group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className={`absolute top-0 right-0 -mt-4 -mr-4 w-12 h-12 rounded-xl ${step.color} shadow-lg flex items-center justify-center transform rotate-12 group-hover:rotate-0 transition-transform duration-300`}>
                                    {step.icon}
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-2 mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Detail Section */}
            <section className="py-20 px-4 max-w-7xl mx-auto">
                <div className="bg-green-700 dark:bg-green-800 rounded-3xl p-8 md:p-16 text-white shadow-2xl overflow-hidden relative">

                    {/* Decorative Background Circles */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-green-500 rounded-full opacity-20 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-green-900 rounded-full opacity-20 blur-3xl"></div>

                    <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                Why Choose FarmHelp?
                            </h2>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="p-1 bg-white/20 rounded-full mt-1">
                                        <PhoneCall className="w-4 h-4 text-white" />
                                    </div>
                                    <span><strong className="text-green-200">Instant Call Alerts:</strong> Never miss a critical update about your water levels or soil health.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="p-1 bg-white/20 rounded-full mt-1">
                                        <LayoutDashboard className="w-4 h-4 text-white" />
                                    </div>
                                    <span><strong className="text-green-200">Unified Dashboard:</strong> Multiple farms? No problem. See data for all your locations in one view.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="p-1 bg-white/20 rounded-full mt-1">
                                        <BrainCircuit className="w-4 h-4 text-white" />
                                    </div>
                                    <span><strong className="text-green-200">Smart Predictions:</strong> Stop guessing. Let AI tell you what to grow for maximum profit.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                            <div className="text-center mb-4">
                                <h4 className="text-green-100 font-medium tracking-wide text-sm uppercase">Simulated Dashboard</h4>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center bg-white/20 p-3 rounded-lg">
                                    <span className="flex items-center gap-2 text-sm"><MapPin size={16} /> Farm A (North)</span>
                                    <span className="text-xs bg-green-500 px-2 py-1 rounded text-white">Normal</span>
                                </div>
                                <div className="flex justify-between items-center bg-white/20 p-3 rounded-lg">
                                    <span className="flex items-center gap-2 text-sm"><MapPin size={16} /> Farm B (South)</span>
                                    <span className="text-xs bg-red-500 px-2 py-1 rounded text-white animate-pulse">Low Moisture</span>
                                </div>
                                <div className="flex justify-between items-center bg-white/20 p-3 rounded-lg">
                                    <span className="flex items-center gap-2 text-sm"><MapPin size={16} /> Farm C (East)</span>
                                    <span className="text-xs bg-blue-500 px-2 py-1 rounded text-white">Tank Full</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
}
