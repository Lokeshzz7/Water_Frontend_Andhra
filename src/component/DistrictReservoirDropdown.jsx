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
        const fetchData = async () => {
            const selectedState = localStorage.getItem("selectedState");
            const selectedYear = localStorage.getItem("selectedYear");

            if (!selectedState || !selectedYear) return;

            setLoading(true);
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/api/reservoir/get-all-reservoirs/${selectedState}/${selectedYear}`
                );
                const data = await response.json();

                if (data.reservoirs) {
                    // Extract unique districts
                    const uniqueDistricts = [
                        ...new Set(data.reservoirs.map((res) => res.district)),
                    ].map((district) => ({ label: district, value: district }));

                    setDistricts(uniqueDistricts);
                    setReservoirs(data.reservoirs);
                } else {
                    console.warn("No reservoirs found in response.");
                    setDistricts([]);
                    setReservoirs([]);
                }
            } catch (error) {
                console.error("Error fetching districts and reservoirs:", error);
                setDistricts([]);
                setReservoirs([]);
            } finally {
                setLoading(false);
            }
        };

        // Initial fetch
        fetchData();

        // Listen to `storage` event for changes in `selectedState` or `selectedYear`
        const handleStorageChange = () => {
            fetchData(); // Re-fetch data if localStorage changes
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const handleDistrictChange = (district) => {
        setSelectedDistrict(district);
        setSelectedReservoir(null); // Reset reservoir selection
        localStorage.setItem("selectedDistrict", district); // Store directly as a string
        window.dispatchEvent(new Event("storage"));
    };

    const handleReservoirChange = (reservoir) => {
        setSelectedReservoir(reservoir);
        const reservoirName = reservoir.name;  // Get the name of the reservoir
        localStorage.setItem("selectedReservoir", reservoirName);  // Store only the name of the reservoir
        window.dispatchEvent(new Event("storage"));
    };

    const districtOptions = useMemo(
        () => districts.map((d) => ({ label: d.label, value: d.value })),
        [districts]
    );

    const reservoirOptions = useMemo(() => {
        const filteredReservoirs = selectedDistrict
            ? reservoirs.filter((r) => r.district === selectedDistrict) // Filter by district
            : reservoirs;

        // Remove duplicate reservoirs by name
        const uniqueReservoirs = [
            ...new Map(filteredReservoirs.map((r) => [r.name, r])).values(),
        ];

        return uniqueReservoirs.map((r) => ({ label: r.name, value: r }));
    }, [reservoirs, selectedDistrict]);

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
