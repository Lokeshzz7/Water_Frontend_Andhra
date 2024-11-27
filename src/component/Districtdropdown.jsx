import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";

const DistrictDropdown = ({ selectedDistrict, setSelectedDistrict }) => {
    const [districts, setDistricts] = useState([]);
    const [loadingDistricts, setLoadingDistricts] = useState(false);

    // Fetch districts on load
    useEffect(() => {
        const fetchDistricts = async () => {
            setLoadingDistricts(true);
            try {
                const response = await fetch("http://127.0.0.1:8000/api/forecast/get-districts");
                const data = await response.json();
                const districtOptions = data.map((district) => ({
                    label: district.name,
                    value: district.id,
                }));
                setDistricts(districtOptions);
            } catch (error) {
                console.error("Error fetching districts:", error);
                setDistricts([]);
            } finally {
                setLoadingDistricts(false);
            }
        };

        fetchDistricts();
    }, []);

    const handleDistrictChange = (districtId) => {
        setSelectedDistrict(districtId);
        localStorage.setItem("selectedDistrict", districtId);
    };

    return (
        <div className="container mx-auto px-4">
            <section className="filter-dropdown-container">
                <section className="button-container">
                    <div className="c-button c-button--gooey">
                        <Dropdown
                            value={selectedDistrict}
                            onChange={(e) => handleDistrictChange(e.value)}
                            options={districts}
                            placeholder={loadingDistricts ? "Loading districts..." : "Select District"}
                            className="dropdown-style"
                            disabled={loadingDistricts || !districts.length}
                        />
                        <span className="c-button__blobs">
                            <div></div>
                            <div></div>
                            <div></div>
                        </span>
                    </div>
                </section>
            </section>
        </div>
    );
};

export default DistrictDropdown;
