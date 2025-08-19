import React from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "./navbar";

export default function Layout(props) {
    const {children} = props;
  return (
    <div className="flex flex-col h-screen relative bg-gray-100 dark:bg-gray-900">
     <Navbar />
     <main className="flex-1 bg-gray-100 dark:bg-gray-900">
      {children}
     </main>
     <Toaster />
    </div>
  );
}