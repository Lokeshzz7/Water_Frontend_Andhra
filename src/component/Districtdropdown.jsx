import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";

const DistrictDropdown = () => {
    const [selectedDistrict, setSelectedDistrict] = useState(null); // Local state for selected district
    const districtData = [
        { id: 3, name: 'Anantapur' },
        { id: 6, name: 'Chittoor' },
        { id: 7, name: 'East Godavari' },
        { id: 9, name: 'Guntur' },
        { id: 26, name: 'Y.S.R Kadapa' },
        { id: 13, name: 'Krishna' },
        { id: 10, name: 'Kurnool' },
        { id: 20, name: 'Sri Potti Sriramulu Nellore' },
        { id: 18, name: 'Prakasam' },
        { id: 21, name: 'Srikakulam' },
        { id: 23, name: 'Visakhapatnam' },
        { id: 24, name: 'Vizianagaram' },
        { id: 25, name: 'West Godavari' },
    ];

    // Map static data to dropdown options
    const districtOptions = districtData.map((district) => ({
        label: district.name,
        value: district.id,
    }));

    // Load selected district from localStorage on mount
    useEffect(() => {
        const storedDistrictId = localStorage.getItem("selectedDistrict");
        if (storedDistrictId) {
            setSelectedDistrict(parseInt(storedDistrictId, 10));
        }
    }, []);

    const handleDistrictChange = (districtId) => {
        setSelectedDistrict(districtId); // Update the state
        localStorage.setItem("selectedDistrict", districtId); // Save to localStorage
    };

    const placeholderText = selectedDistrict
        ? districtData.find(d => d.id === selectedDistrict)?.name
        : "Select District";

    return (
        <div className="container mx-auto px-4">
            <section className="filter-dropdown-container">
                <section className="button-container">
                    <Dropdown
                        value={selectedDistrict} // Controlled value for the dropdown
                        onChange={(e) => handleDistrictChange(e.value)} // Handle change
                        options={districtOptions} // Use static district options
                        placeholder={placeholderText}
                        className="dropdown-style rounded-xl p-3 font-bold text-4xl bg-slate-100 w-1/2 text-red-900"
                    />
                </section>
            </section>
        </div>
    );
};

export default DistrictDropdown;
