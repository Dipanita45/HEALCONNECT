import AuthCheck from "@components/Auth/AuthCheck";
import DoctorSidebar from "@components/Sidebar/DoctorSidebar";
import AlertHistory from "@components/DoctorComponents/AlertHistory";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function AlertsPage() {
    const router = useRouter();
    const [doctorId, setDoctorId] = useState(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            // SECURITY: Role is already verified by layout.js using Firebase Auth
            // This only fetches doctor ID for the alert system  
            const id = localStorage.getItem("userId") || localStorage.getItem("username");
            setDoctorId(id);
        }
    }, []);

    const [viewMode, setViewMode] = useState('my'); // 'my' or 'unassigned'

    return (
        <AuthCheck>
            <DoctorSidebar>
                <div className="p-4">
                    <div className="flex justify-end mb-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-1 flex">
                            <button
                                onClick={() => setViewMode('my')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'my'
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                My Alerts
                            </button>
                            <button
                                onClick={() => setViewMode('unassigned')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'unassigned'
                                    ? 'bg-red-500 text-white'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                Unassigned Alerts
                            </button>
                        </div>
                    </div>

                    {doctorId && (
                        <AlertHistory
                            doctorId={viewMode === 'my' ? doctorId : 'unassigned'}
                        />
                    )}
                </div>
            </DoctorSidebar>
        </AuthCheck>
    );
}
