import AuthCheck from "@components/Auth/AuthCheck";
import PatientSidebar from "@components/Sidebar/PatientSidebar";
import { UserContext } from "@lib/context";
import { useContext, useState, useEffect } from "react";
import { FaSave, FaTimes } from "react-icons/fa";

export default function EditProfile() {
    const { currentUser, setCurrentUser } = useContext(UserContext);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        number: "",
        age: "",
        bloodGroup: "",
        weight: "",
        height: "",
        diabetesStatus: "",
        surgicalHistory: "",
        cardiacHistory: ""
    });
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setFormData({
                name: currentUser?.name || "",
                email: currentUser?.email || "",
                number: currentUser?.number || "",
                age: currentUser?.age || "",
                bloodGroup: currentUser?.bloodGroup || "",
                weight: currentUser?.weight || "",
                height: currentUser?.height || "",
                diabetesStatus: currentUser?.diabetesStatus || "",
                surgicalHistory: currentUser?.surgicalHistory || "",
                cardiacHistory: currentUser?.cardiacHistory || ""
            });
        }
    }, [currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        const errors = [];

        // Validate age
        const age = Number(formData.age);
        if (formData.age && (isNaN(age) || age < 1 || age > 120)) {
            errors.push('Age must be between 1 and 120');
        }

        // Validate weight
        const weight = Number(formData.weight);
        if (formData.weight && (isNaN(weight) || weight < 1 || weight > 300)) {
            errors.push('Weight must be between 1 and 300 kg');
        }

        // Validate height
        const height = Number(formData.height);
        if (formData.height && (isNaN(height) || height < 50 || height > 250)) {
            errors.push('Height must be between 50 and 250 cm');
        }

        // Sanitize text inputs (basic XSS prevention)
        const sanitizedData = {
            ...formData,
            name: formData.name.trim().replace(/[<>]/g, ''),
            email: formData.email.trim(),
            number: formData.number.trim()
        };

        return { isValid: errors.length === 0, errors, sanitizedData };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        // Validate form
        const { isValid, errors, sanitizedData } = validateForm();

        if (!isValid) {
            setMessage(`Validation errors: ${errors.join(', ')}`);
            setIsLoading(false);
            return;
        }

        try {
            if (typeof window !== 'undefined') {
                const currentUserData = JSON.parse(localStorage.getItem('currentUser') || '{}');
                const updatedUserData = {
                    ...currentUserData,
                    ...sanitizedData  // Use sanitized data
                };
                localStorage.setItem('currentUser', JSON.stringify(updatedUserData));
                setCurrentUser(updatedUserData);

                setMessage("Profile updated successfully!");
                setTimeout(() => setMessage(""), 3000);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage("Error updating profile. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthCheck>
            <PatientSidebar>
                <div className="p-2 w-full h-full flex flex-col">
                    <div className="h-20"></div>

                    <div className="max-w-4xl mx-auto w-full">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Edit Profile</h1>
                                <button
                                    onClick={() => window.history.back()}
                                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                    <FaTimes size={24} />
                                </button>
                            </div>

                            {message && (
                                <div className={`mb-4 p-4 rounded-lg ${message.includes("success")
                                    ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-600"
                                    : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-600"
                                    }`}>
                                    {message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Basic Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="number"
                                            value={formData.number}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Age
                                        </label>
                                        <input
                                            type="number"
                                            name="age"
                                            value={formData.age}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            min="1"
                                            max="120"
                                        />
                                    </div>
                                </div>

                                {/* Medical Information */}
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Medical Information</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Blood Group
                                            </label>
                                            <select
                                                name="bloodGroup"
                                                value={formData.bloodGroup}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="A+">A+</option>
                                                <option value="A-">A-</option>
                                                <option value="B+">B+</option>
                                                <option value="B-">B-</option>
                                                <option value="O+">O+</option>
                                                <option value="O-">O-</option>
                                                <option value="AB+">AB+</option>
                                                <option value="AB-">AB-</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Weight (KG)
                                            </label>
                                            <input
                                                type="number"
                                                name="weight"
                                                value={formData.weight}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min="1"
                                                max="300"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Height (CM)
                                            </label>
                                            <input
                                                type="number"
                                                name="height"
                                                value={formData.height}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min="50"
                                                max="250"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Diabetes Status
                                            </label>
                                            <select
                                                name="diabetesStatus"
                                                value={formData.diabetesStatus}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="No">No</option>
                                                <option value="Type 1">Type 1</option>
                                                <option value="Type 2">Type 2</option>
                                                <option value="Gestational">Gestational</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Surgical History
                                            </label>
                                            <select
                                                name="surgicalHistory"
                                                value={formData.surgicalHistory}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="No">No</option>
                                                <option value="Yes">Yes</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Cardiac History
                                            </label>
                                            <select
                                                name="cardiacHistory"
                                                value={formData.cardiacHistory}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="No">No</option>
                                                <option value="Yes">Yes</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end space-x-4 pt-6 border-t">
                                    <button
                                        type="button"
                                        onClick={() => window.history.back()}
                                        className="px-6 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
                                    >
                                        <FaSave />
                                        <span>{isLoading ? "Saving..." : "Save Changes"}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </PatientSidebar>
        </AuthCheck>
    );
}
