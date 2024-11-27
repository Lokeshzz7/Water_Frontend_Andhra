import React, { useState, useEffect, useMemo } from "react";
import { Dropdown } from "primereact/dropdown";

const DistrictReservoirDropdown = () => {
    const [selectedDistrict, setSelectedDistrict] = useState(() => {
        try {
            return localStorage.getItem("selectedDistrict") || null;  // Just get the string directly
        } catch {
            return null;
        }
    });

    const [selectedReservoir, setSelectedReservoir] = useState(() => {
        try {
            return localStorage.getItem("selectedReservoir") || null;
        } catch {
            return null;
        }
    });

    const [districts, setDistricts] = useState([]);
    const [reservoirs, setReservoirs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDistricts = async () => {
            setLoading(true);
            try {
                const response = await fetch("http://127.0.0.1:8000/api/forecast/get-districts");
                const data = await response.json();
                console.log("Fetched Districts Data:", data);
                if (data && Array.isArray(data)) {
                    // Map to the format expected for the Dropdown
                    const districtOptions = data.map((district) => ({
                        label: district.name,
                        value: district.id,
                    }));
                    setDistricts(districtOptions);
                } else {
                    console.warn("No districts found in response.");
                    setDistricts([]);
                }
            } catch (error) {
                console.error("Error fetching districts:", error);
                setDistricts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDistricts();

        // Listen to `storage` event for changes in `selectedDistrict`
        const handleStorageChange = () => {
            if (selectedDistrict) {
                fetchReservoirs(selectedDistrict); // Re-fetch reservoirs if district changes
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const fetchReservoirs = async (districtId) => {
        setLoading(true);
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/reservoir/get-all-reservoirs/${districtId}`
            );
            const data = await response.json();
            console.log("Fetched Reservoirs Data:", data);

            if (data && Array.isArray(data)) {
                // Map to the format expected for the Dropdown
                const reservoirOptions = data.map((reservoir) => ({
                    label: reservoir.name,
                    value: reservoir.id,  // Store the reservoir id here
                }));
                setReservoirs(reservoirOptions);
            } else {
                console.warn("No reservoirs found for this district.");
                setReservoirs([]);
            }
        } catch (error) {
            console.error("Error fetching reservoirs:", error);
            setReservoirs([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDistrictChange = (districtId) => {
        setSelectedDistrict(districtId);
        setSelectedReservoir(null); // Reset reservoir selection
        localStorage.setItem("selectedDistrict", districtId); // Store district id
        window.dispatchEvent(new Event("storage"));
    };

    const handleReservoirChange = (reservoirId) => {
        setSelectedReservoir(reservoirId);
        localStorage.setItem("selectedReservoir", reservoirId); // Store reservoir id
        window.dispatchEvent(new Event("storage"));
    };

    const districtOptions = useMemo(
        () => districts.map((d) => ({ label: d.label, value: d.value })),
        [districts]
    );

    const reservoirOptions = useMemo(() => {
        return reservoirs.map((r) => ({ label: r.label, value: r.value }));
    }, [reservoirs]);

    return (
        <div className="container mx-auto px-4">
            <section className="flex flex-wrap gap-5 justify-start items-center w-full text-2xl tracking-tight leading-none text-black whitespace-nowrap max-w-[1382px]">
                <section className="filter-dropdown-container">
                    <section className="button-container">
                        <div className="c-button c-button--gooey">
                            <Dropdown
                                value={selectedDistrict}
                                onChange={(e) => handleDistrictChange(e.value)}
                                options={districtOptions}
                                placeholder={loading ? "Loading districts..." : "Select District"}
                                className="dropdown-style"
                                disabled={loading || !districtOptions.length}
                            />
                            <span className="c-button__blobs">
                                <div></div>
                                <div></div>
                                <div></div>
                            </span>
                        </div>

                        <div className="c-button c-button--gooey">
                            <Dropdown
                                value={selectedReservoir}
                                onChange={(e) => handleReservoirChange(e.value)}
                                options={reservoirOptions}
                                placeholder={
                                    loading
                                        ? "Loading reservoirs..."
                                        : selectedDistrict
                                            ? "Select Reservoir"
                                            : "Select a District First"
                                }
                                className="dropdown-style"
                                disabled={loading || !reservoirOptions.length}
                            />
                            <span className="c-button__blobs">
                                <div></div>
                                <div></div>
                                <div></div>
                            </span>
                        </div>
                    </section>
                </section>
            </section>
        </div>
    );
};

export default DistrictReservoirDropdown;
