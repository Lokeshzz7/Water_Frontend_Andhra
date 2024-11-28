import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";

const DistrictDropdown = () => {
    const [districts, setDistricts] = useState([]); // Holds districts fetched from API
    const [selectedDistrict, setSelectedDistrict] = useState(null); // Local state for selected district
    const [loadingDistricts, setLoadingDistricts] = useState(false);

    // District data for mapping from ID to name
    const districtData = [
        { id: 1, name: 'Anakapalli' },
        { id: 2, name: 'Annamayya' },
        { id: 3, name: 'Ananthapuramu' },
        { id: 4, name: 'Alluri Sitharama Raju' },
        { id: 5, name: 'Bapatla' },
        { id: 6, name: 'Chittoor' },
        { id: 7, name: 'East Godavari' },
        { id: 8, name: 'Eluru' },
        { id: 9, name: 'Guntur' },
        { id: 10, name: 'Kurnool' },
        { id: 11, name: 'Kakinada' },
        { id: 12, name: 'Konaseema' },
        { id: 13, name: 'Krishna' },
        { id: 14, name: 'Nandyal' },
        { id: 15, name: 'NTR' },
        { id: 16, name: 'Palnadu' },
        { id: 17, name: 'Parvathipuram Manyam' },
        { id: 18, name: 'Prakasam' },
        { id: 19, name: 'Sri Sathya Sai' },
        { id: 20, name: 'Sri Potti Sriramulu Nellore' },
        { id: 21, name: 'Srikakulam' },
        { id: 22, name: 'Tirupati' },
        { id: 23, name: 'Visakhapatnam' },
        { id: 24, name: 'Vizianagaram' },
        { id: 25, name: 'West Godavari' },
        { id: 26, name: 'Y.S.R Kadapa' },
    ];

    // Fetch districts on load
    useEffect(() => {
        const fetchDistricts = async () => {
            setLoadingDistricts(true);
            try {
                // Normally, you'd fetch this from an API, but using static data for now
                const response = await fetch("http://127.0.0.1:8000/api/forecast/get-districts");
                const data = await response.json();
                const districtOptions = data.map((district) => ({
                    label: district.name,
                    value: district.id,
                }));
                setDistricts(districtOptions);

                // Get district ID from localStorage and set it if available
                const storedDistrictId = localStorage.getItem("selectedDistrict");
                if (storedDistrictId) {
                    const selected = districtOptions.find(d => d.value === parseInt(storedDistrictId));
                    if (selected) {
                        setSelectedDistrict(selected.value);
                    }
                }
            } catch (error) {
                console.error("Error fetching districts:", error);
                setDistricts([]); // Reset districts in case of an error
            } finally {
                setLoadingDistricts(false);
            }
        };

        fetchDistricts();
    }, []);

    const handleDistrictChange = (districtId) => {
        setSelectedDistrict(districtId); // Update the state
        localStorage.setItem("selectedDistrict", districtId); // Save the selected district ID to localStorage
    };

    const placeholderText = selectedDistrict ?
        districtData.find(d => d.id === selectedDistrict)?.name :
        "Select District";

    return (
        <div className="container mx-auto px-4">
            <section className="filter-dropdown-container">
                <section className="button-container">
                    <Dropdown
                        value={selectedDistrict} // Controlled value for the dropdown
                        onChange={(e) => handleDistrictChange(e.value)} // Handle change
                        options={districts} // District options fetched from the API
                        placeholder={loadingDistricts ? "Loading districts..." : placeholderText}
                        className="dropdown-style rounded-xl p-3 font-bold text-4xl bg-slate-100 w-1/2 text-red-900"
                        disabled={loadingDistricts || !districts.length} // Disable if loading or no options
                    />
                </section>
            </section>
        </div>
    );
};

export default DistrictDropdown;
