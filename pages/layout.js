// Example in _app.jsx or layout.js
useEffect(() => {
  const userType = getUserType();
  if (!userType) {
    router.replace('/login');
  } else if (userType === "doctor" && router.pathname.startsWith("/patient")) {
    router.replace('/doctor/dashboard');
  } else if (userType === "patient" && router.pathname.startsWith("/doctor")) {
    router.replace('/patient/dashboard');
  }
}, [router.pathname]);
