import AuthCheck from "@components/Auth/AuthCheck";
import PatientSidebar from "@components/Sidebar/PatientSidebar";

export default function Notifications(params) {
    return (
        <AuthCheck>
            <PatientSidebar>
                <h1>Notifications</h1>
            </PatientSidebar>
        </AuthCheck>
    );
}