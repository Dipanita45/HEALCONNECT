import { db } from "@lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { FaDotCircle, FaSpinner } from 'react-icons/fa';
import dynamic from "next/dynamic";

const AuthCheck = dynamic(() => import("@components/Auth/AuthCheck"), {ssr: false});
const DoctorSidebar = dynamic(() => import("@components/Sidebar/DoctorSidebar"), {ssr: false});

export default function Add(props) {
  const [aadhar, setAadhar] = useState('')
  const [pan, setPan] = useState('')
  const [first, setFirst] = useState('')
  const [middle, setMiddle] = useState('')
  const [last, setLast] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [marital, setMarital] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [pin, setPin] = useState('')
  const [number, setNumber] = useState('')
  const [landline, setLandline] = useState('')
  const [blood, setBlood] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [loading, setLoading] = useState(false)
  const [docRef, setDocRef] = useState(null)
  const router = useRouter();

  const addPatient = async (e) => {
    e.preventDefault();
    if(!aadhar || !first || !middle || !last || !city || !address ){
      toast.error('All (*) fields are required!')
    }else{
    setLoading(true)
    // Create patients document referance
    const docRef = doc(collection(db, "patients"));
    // Write data in to patients document
    await setDoc(docRef, {aadhar: aadhar, pan: pan, firstName: first, middleName: middle, lastName: last, age: age, gender: gender, maritalStatus: marital, address: address, state: state, city: city, pin: pin, number: number, landline: landline, bloodGroup: blood, height: height, weight: weight}
      ).then(() => setLoading(false))
      .catch((error) => toast.error(error.message))
      .finally(() => {
        toast.success('Patient Created!')
        router.push('patients');
      })
    }
  }

  return (
    <AuthCheck>
      <DoctorSidebar>
        <div>
          <h1 className="prose lg:prose-xl font-bold md:ml-4 py-2 dark:text-gray1">
            Add New Patient
          </h1>
          <div className="flex md:flex-row flex-col">
            <div className="md:w-3/4 md:mx-4 overflow-hidden rounded-lg shadow-xs bg-white dark:bg-gray-800">
              <div className="w-full overflow-x-auto p-2 md:p-4">
              <form className="w-full" onSubmit={addPatient}>
              <h1 className=" text-blue-400">Unique ID:</h1>
              <Divider />
              <div className="flex flex-wrap -mx-3">
                    <div className="w-full md:w-5/12 px-3 mb-6 md:mb-0">
                    <FormInput  className="input-field" label="Aadhar ID" id="grid-first-name" type="number" placeholder="0123 4567 8999" pattern="^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$" required={true} onChange={(e) => setAadhar(e.target.value)}/>
                    </div>
                    <div className=" text-center md:pt-8 w-full md:w-2/12 px-3 mb-6 md:mb-0 text-gray6 dark:text-gray1"><h2>OR</h2></div>
                    <div className="w-full md:w-5/12 px-3">
                    <FormInput  className="input-field" label="PAN ID" id="grid-last-name" type="number" placeholder="ABC000826D" pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}" required={false} onChange={(e) => setPan(e.target.value)}/>
                    </div>
                  </div>
                  <p className={`text-red-500 text-xs italic ${aadhar.length != 12 ? "block" : "hidden"}`}>Aadhar number should be 12 intiger long!</p>
                  <h1 className=" text-blue-400 mt-6">Persnol Information:</h1>
                  <Divider />
                  <div className="flex flex-wrap -mx-3 mb-6">
                    <div className=" w-full md:w-1/3 px-3 mb-6 md:mb-0">
                      <FormInput label="First Name" required={true} pattern="[A-Za-z ]{1,32}" onChange={(e) => setFirst(e.target.value)} className=" input-field" id="grid-first-name" type="text" placeholder="Kumar"/>
                    </div>
                    <div className=" w-full md:w-1/3 px-3">
                      <FormInput label="Middel Name" required={true} pattern="[A-Za-z ]{1,32}" onChange={(e) => setMiddle(e.target.value)} className=" input-field" id="grid-middel-name" type="text" placeholder="Raosaheb"/>
                    </div>
                    <div className=" w-full md:w-1/3 px-3">
                      <FormInput label="Last Name" required={true} pattern="[A-Za-z ]{1,32}" onChange={(e) => setLast(e.target.value)} className=" input-field" id="grid-last-name" type="text" placeholder="Pandule"/>
                    </div>
                  </div>
                  <div className="flex flex-wrap -mx-3 mb-6">
                    <div className=" w-full md:w-1/3 px-3 mb-6 md:mb-0">
                      <FormInput label="Age" required={true} onChange={(e) => setAge(e.target.value)} className=" input-field" id="grid-first-name" type="text" placeholder="22"/>
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                      <FormDropdown label="Gender" options={[{value: 'Select'}, {value: 'Male'}, {value: 'Female'}]} onSelect={(e) => setGender(e.target.value)} />
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                      <FormDropdown label="Marital Status" options={[{value: 'Select'}, {value: 'Single'}, {value: 'Marrid'}]} onSelect={(e) => setMarital(e.target.value)}/>
                    </div>
                    </div>
                  <h1 className=" text-blue-400">Patient{"'"}s Address:</h1>
                  <Divider />
                  <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full px-3">
                      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                        Address
                      </label>
                      <input className="input-field" id="grid-password" type="text" pattern="[A-Za-z0-9'\.\-\s\,]" placeholder="Address" onChange={(e) => setAddress(e.target.value)}/>
                      <p className="text-gray-600 text-xs italic">Make it as long and as crazy as you{"'"}d like</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <FormDropdown label="State" value="Maharashtra" options={[{value: 'Select'},{value: 'Maharashtra'}]} onSelect={(e) => setState(e.target.value)}/>
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                      <FormDropdown label="City" value="Pune" options={[{value: 'Select'},{value: 'Pune'}]} onSelect={(e) => setCity(e.target.value)} />
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                      <FormInput label="PIN Code" required={true} pattern="[0-9]{5}" onChange={(e) => setPin(e.target.value)} className=" input-field" id="grid-first-name" type="number" placeholder="411046"/>
                    </div>
                  </div>
                  <h1 className=" text-blue-400">Contact Details:</h1>
                  <Divider />
                  <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-5/12 px-3 mb-6 md:mb-0">
                      <FormInput label="Phone No" required={true} pattern="/(7|8|9)\d{9}/" onChange={(e) => setNumber(e.target.value)} className="input-field" id="grid-first-name" type="number" placeholder="0123456789" />
                    </div>
                    <div className=" text-center md:pt-8 w-full md:w-2/12 px-3 mb-6 md:mb-0 text-gray6 dark:text-gray1"><h2>OR</h2></div>
                    <div className="w-full md:w-5/12 px-3">
                      <FormInput label="Landline No" required={false} pattern="/(7|8|9)\d{9}/" onChange={(e) => setLandline(e.target.value)} className="input-field" id="grid-first-name" type="number" placeholder="0000000"/>
                    </div>
                  </div>
                  <h1 className=" text-blue-400">Body Measurements:</h1>
                  <Divider />
                  <div className="flex flex-row flex-wrap -mx-3 mb-6">
                    <div className=" w-full md:w-1/3 px-3 mb-6 md:mb-0">
                      <FormInput label="Blood Group" required={false} pattern="(A|B|AB|O)[+-]" onChange={(e) => setBlood(e.target.value)} className="input-field" id="grid-first-name" type="text" placeholder="B+"/>
                    </div>
                    <div className=" w-full md:w-1/3 px-3">
                      <FormInput label="Hiegth" required={false} pattern="[0-9]{3}" onChange={(e) => setHeight(e.target.value)} className="input-field" id="grid-first-name" type="number" placeholder="185"/>
                      </div>
                    <div className=" w-full md:w-1/3 px-3">
                      <FormInput label="Wiegth" required={false} pattern="[0-9]{3}" onChange={(e) => setWeight(e.target.value)} className="input-field" id="grid-first-name" type="number" placeholder="90"/>
                    </div>
                  </div>
                  <button type="submit" className=" px-6 w-full h-10 flex justify-center text-gray1 py-2 duration-300 relative after:absolute after:top-0 after:right-full bg-green-500 after:z-10 after:w-full after:h-full overflow-hidden hover:after:translate-x-full after:duration-300 hover:text-slate-900">
                  {loading && (
          <FaSpinner className=" animate-spin text-white" size={22} />
        )}
        {!loading && <span className="text-gray1 cursor-pointer">Add</span>}
                  </button>
                </form>
              </div>
            </div>
            <FormInstructions />
          </div>
        </div>
      </DoctorSidebar>
    </AuthCheck>
  );
}

const Divider = () => <hr className=" mb-6 my-2 bg-gray-200 dark:bg-gray-800 border border-blue-400 dark:border-blue-400 rounded-full " />;

export const FormInput = (props) => {
  const { label, ref, type, onChange, id, className, placeholder, pattern, required} = props;
  return (
    <div>
        <label
          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >{label}<span className="text-red-500">*</span>
        </label>
        <input required={required} pattern={pattern} onChange={onChange} className={className} id={id} type={type} placeholder={placeholder}/>
      </div>
  );
}

export const FormDropdown = (props) =>{
  const { label, options, onSelect} = props;
  return (
      <div>
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >{label}<span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <select onChange={onSelect} className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
          {options.map(opt => {
            return (<option key={opt.value} id={opt.value} value={opt.value}>{opt.value}</option>);
          })}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
        </div>
      </div>
      </div>
  );
}

export const FormInstructions = (props) => {
  return (
    <div className=" w-full md:w-1/4 md:my-0 my-4 overflow-hidden rounded-lg shadow-xs bg-blue-200">
    <div className="w-full flex flex-col overflow-x-auto p-2 md:p-4">
      <div className=" flex flex-row justify-center mt-12">
      <Image alt="Form" className=" w-2/3" src="/form.svg" width="211" height="211"/>
      </div>
      <h2 className="text-center pt-8">INSTRUCTIONS FOR FILLING FORM</h2>
      <article className="mt-14">
      <div className=" w-full flex flex-row pt-4">
      <FaDotCircle size={16} className=" pt-1 mt-1 mr-2" />
      <p>Form to be filled in English only.</p>
      </div>
      <div className=" w-full flex flex-row pt-4">
      <FaDotCircle size={16} className=" pt-1 mt-1 mr-2" />
      <p>Fields marked by asterisk (*) are mandatory.</p>
      </div>
      <div className=" w-full flex flex-row pt-4">
      <FaDotCircle size={16} className=" w-14 pt-1 mt-1 mr-2" />
      <p>Each box, wherever provided, should contain only one character (alphabet /number / punctuation sign) leaving a blank box after each word.</p>
      </div>
      <div className=" w-full flex flex-row pt-4">
      <FaDotCircle size={16} className=" w-24 pt-1 mt-1 mr-2" />
      <p>Those already allotted a ten-digit alphanumeric PAN shall not apply again as having or using more than one PAN is illegal. However, request for a new PAN card with the same PAN or/and changes or correction in PAN data can be made by filling up the form for {"'"}Request for New PAN Card or/and Changes or Correction in PAN Data{"'"}.</p>
      </div>
      </article>
    </div>
  </div>
  );
}