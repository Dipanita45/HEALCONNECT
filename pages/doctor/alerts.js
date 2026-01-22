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
            const role = localStorage.getItem("userType");
            if (!role) {
                router.push("/login");
            } else if (role !== "doctor") {
                router.push(`/${role}/dashboard`);
            } else {
                const id = localStorage.getItem("userId") || localStorage.getItem("username");
                setDoctorId(id);
            }
        }
    }, [router]);

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
