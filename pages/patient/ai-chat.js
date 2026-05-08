import AuthCheck from "../../components/Auth/AuthCheck";
import PatientSidebar from "../../components/Sidebar/PatientSidebar";
import ChatBox from "../../components/Chat/ChatBox";
import Head from "next/head";

export default function AIChatPage() {
  return (
    <AuthCheck>
      <Head>
        <title>AI Medical Assistant | HEALCONNECT</title>
      </Head>
      <PatientSidebar>
        <div className="p-2 md:p-4 w-full h-full flex flex-col">
          <div className="h-16 md:h-12"></div> {/* Top spacing for mobile menu */}
          <ChatBox />
        </div>
      </PatientSidebar>
    </AuthCheck>
  );
}
