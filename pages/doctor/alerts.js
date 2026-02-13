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

    return (
        <AuthCheck>
            <DoctorSidebar>
                <div className="p-4">
                    {doctorId && <AlertHistory doctorId={doctorId} />}
                </div>
            </DoctorSidebar>
        </AuthCheck>
    );
}
