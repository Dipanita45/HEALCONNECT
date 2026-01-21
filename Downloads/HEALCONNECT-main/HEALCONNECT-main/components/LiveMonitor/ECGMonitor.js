import { useState, useEffect} from "react";
import { getDoc, onSnapshot, doc } from "firebase/firestore";
import { db } from '@lib/firebase';
import dynamic from 'next/dynamic';
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });


export default function ECGMonitor() {
  const [data, setData] = useState([]);
  const [deviceStatus, setDeviceStatus] = useState(false);
  const [ecgData, setECGData] = useState([{ x: Date.now(), y: 0 }]);

  useEffect(() => {
    const docRef = doc(db, "devices", "0001");

    // Get initial data
    getDoc(docRef)
      .then((doc) => {
        if (doc.exists()) {
          setData({...doc.data()});
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });

    // Get real-time updates
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setData({...doc.data()});
        setDeviceStatus(doc.data().status);
      } else {
        console.log("No such document!");
      }
    });
    return () => unsubscribe();
  }, []);

  const [options, setOptions] = useState({
    chart: {
      id: 'realtime',
      height: 450,
      type: 'line',
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 1000,
        },
      },
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },

    xaxis: {
      type: 'datetime',
      range: 60 * 60,
      labels: {
        show: true,
      },
      categories: [''],
    },
    yaxis: {
      max: 1000,
      min: -1600,
      tickAmount: 25,
    },
    legend: {
      show: false
    },
    stroke: {
      curve: 'smooth'
    },
    markers: {
      size: 0,
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const newECGData = ecgData ? [...ecgData] : [];
      const pulse = data.pulse;
  
      if (pulse >= -300 && pulse <= 300) {
        // Pulse input is within range, set y value to a fixed value
        newECGData.push({
          x: Date.now(),
          y: 0,
        });
      } else if (pulse > 600) {
        // Pulse input is greater than 600, create an array of ECG data points
        const pulseArray = [
          {x: Date.now(), y: 64 },
          {x: Date.now() + 5, y: 168},
          {x: Date.now() + 10, y: 272 },
          {x: Date.now() + 15, y: 300 },
          {x: Date.now() + 20, y: 400 },
          {x: Date.now() + 25, y: 500 },
          {x: Date.now() + 30, y: 600 },
          {x: Date.now() + 35, y: 700 },
          {x: Date.now() + 40, y: 896 },
          {x: Date.now() + 45, y: 792 },
          {x: Date.now() + 50, y: 688 },
          {x: Date.now() + 55, y: 584 },
          {x: Date.now() + 60, y: 480 },
          {x: Date.now() + 65, y: 376 },
          {x: Date.now() + 70, y: 272 },
          {x: Date.now() + 75, y: 168 },
          {x: Date.now() + 80, y: 64 },
          {x: Date.now() + 85, y: -40 },
          {x: Date.now() + 90, y: -144 },
          {x: Date.now() + 95, y: -352},
          {x: Date.now() + 100, y: -664 },
          {x: Date.now() + 105, y: -768 },
          {x: Date.now() + 110, y: -872 },
          {x: Date.now() + 115, y: -976 },
          {x: Date.now() + 120, y: -1100 },
          {x: Date.now() + 130, y: -1184 },
          {x: Date.now() + 135, y: -1288 },
          {x: Date.now() + 140, y: -872 },
          {x: Date.now() + 145, y: -768 },
          {x: Date.now() + 150, y: -664 },
          {x: Date.now() + 155, y: -352},
          {x: Date.now() + 160, y: -144 },
          {x: Date.now() + 165, y: -40 }
        ];
        const ecgArray = [...pulseArray];
        newECGData.push(...ecgArray);
      } else {
        // Pulse input is outside the specified range, do not add a new ECG data point
        return;
      }
  
      if (newECGData.length > 1000) {
        newECGData.shift();
      }
      setECGData(newECGData);
    }, 100);
  
    return () => clearInterval(interval);
  }, [ecgData]);

      return (
        <>
          <div className=" px-8">
          <p>Device status: <span className=" text-green-500">{data.status ? "Online" : "Offline"}</span></p>
          </div>


          {!deviceStatus && (
            <div className="fixed flex md:p-0 p-2 flex-col insert-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
              <div className=" relative top-20 md:mx-auto flex justify-between items-center flex-col w-auto md:w-1/4 h-auto rounded-lg shadow-xl p-2 bg-gray1 dark:bg-gray6">
                {/* <Image src={Trophy} width={100} height={100} objectFit="contain" /> */}
                <h1 className="text-base mt-2 mx-4 text-gray7 font-semibold text-center">
                  Device is offline
                </h1>
                <p className="mx-4 pb-8">
                  Please make sure your device is connected to WIFi.
                </p>
                <img src="/offline.gif"/>
              </div>
            </div>
          )}
          <div className="w-full h-full py-2">
           <div className=' flex flex-col md:flex-row gap-4 mx-2 md:mx-8 text-gray6 dark:text-gray1'>
            <div className=' basis-3/4 flex flex-col w-full overflow-hidden rounded-lg shadow-xs bg-white dark:bg-gray-800'>
            <div className=' basis-1/12'>
            <h2 className=' basis-1/4 p-2'>Heart Rhythm <span>{"( - )"}</span></h2>
            </div>
            <div className=' basis-11/12'>
            {!deviceStatus ? <div className="h-400"></div> : <ApexCharts options={options} series={[{ data: ecgData }]} type="line" height={450} />}
            </div>
            </div>
            <div className=' basis-1/4 flex flex-col gap-4'>
            <div className=' basis-1/3 p-2 flex flex-col w-full overflow-hidden rounded-lg shadow-xs bg-white dark:bg-gray-800'>
            {data.finger ? 
            <>
            <h2 className=' basis-1/4'>BPM <span>{"( BPM )"}</span></h2>
            <h1 className=' basis-3/4 text-6xl text-center py-4'>{data.beatsPerMinute || "00"}</h1>
            </>
            :
            <div className="flex h-full items-center justify-cente">
            <h2 className=' mx-auto basis-3/4 text-xl items-center text-center text-red-400 py-4'>Please wear health Kit!</h2>
            </div>
            }
            </div>
            <div className=' basis-1/3 p-2 flex flex-col w-full overflow-hidden rounded-lg shadow-xs bg-white dark:bg-gray-800'>
            {data.finger ? <>
            <h2 className='basis-1/4'>SPO2 <span>{"( % )"}</span></h2>
            <h1 className=' basis-3/4 text-6xl text-center py-4'>{data.oxygen || "00"}</h1>
            </>
            :
            <div className="flex h-full items-center justify-center">
            <h2 className=' basis-3/4 text-xl items-center text-center text-red-400 py-4'>Please wear health Kit!</h2>
            </div>
            }
            </div>
            <div className=' basis-1/3 p-2 flex flex-col w-full overflow-hidden rounded-lg shadow-xs bg-white dark:bg-gray-800'>
            {data.finger ? <>
            <h2 className='basis-1/4'>Temprature <span>{"( F )"}</span></h2>
            <h1 className=' basis-3/4 text-6xl text-center py-4'>{data.temp || "00"}</h1>
            </>
            :
            <div className="flex h-full items-center justify-center">
            <h2 className=' basis-3/4 text-xl items-center text-center text-red-400 py-4'>Please wear health Kit!</h2>
            </div>
            }
            </div>
            </div>
           </div>
          </div>
        </>
      );
    };
