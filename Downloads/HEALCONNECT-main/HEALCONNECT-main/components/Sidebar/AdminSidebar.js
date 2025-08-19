import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaPlus, FaUser, FaUsers, FaBell, FaNotesMedical, FaHome, FaCog, FaList, FaArrowLeft } from 'react-icons/fa';

export default function AdminSidebar({ children }) {
  const router = useRouter();
  const path = router.query;
  const [isOpen, setIsOpen] = useState(false);
  
  function SetOpen(){
    if(isOpen){
      setIsOpen(false)
    }else{
      setIsOpen(true)
    }
    console.log(isOpen)
  }

  const menuItems = [
    {
      href: '/admin/add',
      title: 'Add Patient',
      icon: <FaPlus size={28}/>,
    },
    {
      href: '/admin/patients',
      addHref: '/admin/patients/' + path.slug,
      title: 'Patients',
      icon: <FaUsers size={28}/>,
    },
    {
      href: '/admin/notifications',
      title: 'Notifications',
      icon: <FaBell size={28}/>,
    },
    {
      href: '/admin/reports',
      addHref: '/admin/reports/' + path.slug,
      title: 'Reports',
      icon: <FaNotesMedical size={28}/>,
    },
  ];

  return (
    <div className=" flex h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex h-full">
          
          <span onClick={SetOpen} className=' absolute text-white md:hidden px-4 py-2 bg-green-600'>
            <FaList size={18}/>
          </span>

          <nav className={` md:flex md:w-60 w-16 h-full transition ease-in-out duration-300 bg-gray2 dark:bg-gray6 ${isOpen ? " absolute": "hidden"}`}>
            <ul className="w-full flex flex-col mx-auto px-2 py-2">
              {/* Static Sidebar Icons */}
               <li onClick={SetOpen} className='px-2 md:hidden'>
               <FaArrowLeft className='text-red-400' size={20}/>  
               </li>

              <li key={'Dashboard'}>
              <div className=" mt-4 md:mt-8"></div>
              <Link href="/admin">
                <div
                  className={`sidebar-icon group ${router.asPath === "/admin" && "dark:bg-blue-500 bg-blue-500 text-white"}`}
                >
                  <FaHome size={28} />
                  <span className="sidebar-tooltip group-hover:scale-100">
                    Dashboard
                  </span>
                </div>
              </Link>
              </li>
              <li key={'Divider'}>
              <Divider />
              </li>

              {/* Dynamic Sidebar Icons */}
              {menuItems.map(({ href, addHref, title, icon }) => (
                <li key={title}>
                <Link href={href}>
                  <div
                    className={`sidebar-icon group ${
                      router.asPath === href && "dark:bg-blue-500 bg-blue-500 text-white"
                    }`}
                  >
                    {icon}
                    <span className="sidebar-tooltip group-hover:scale-100">
                      {title}
                    </span>
                  </div>
                </Link>
                </li>
              ))}

              {/* Static Sidebar Icons */}
              <li key={'Divider2'}>
              <Divider />
              </li>
              <li key={'Setting'}>
              <Link href="/admin/setting">
                <div
                  className={`sidebar-icon group ${
                    router.asPath === "/admin/setting" && "bg-blue-500 dark:bg-blue-500 text-white"
                  }`}
                >
                  <FaCog size={28} />
                  <span className="sidebar-tooltip group-hover:scale-100">
                    Setting
                  </span>
                </div>
              </Link>
              </li>
              <li key={'Doctors'}>
              <Link href="/admin/doctors">
                <div
                  className={`sidebar-icon group ${
                    router.asPath === "/admin/doctors" && "bg-blue-500 dark:bg-blue-500 text-white"
                  }`}
                >
                  <FaUsers size={28} />
                  <span className="sidebar-tooltip group-hover:scale-100">
                    Doctors
                  </span>
                </div>
              </Link>
              </li>
            </ul>
          </nav>

          <main className="flex flex-col w-full bg-gray-100 dark:bg-gray-900 overflow-x-hidden overflow-y-auto mb-14">
            <div className="flex flex-col w-full mx-auto px-6 py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

const Divider = () => <hr className="sidebar-hr my-2" />;