import React, { useState, useEffect, useMemo } from "react";
import { Dropdown } from "primereact/dropdown";

const DistrictReservoirDropdown = () => {
    const [selectedDistrict, setSelectedDistrict] = useState(() => {
        try {
            return localStorage.getItem("selectedDistrict") || null;
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

    const [reservoirs, setReservoirs] = useState([]);
    const [loading, setLoading] = useState(false);

    const districts = [
        { id: 1, name: "Anakapalli" },
        { id: 2, name: "Annamayya" },
        { id: 3, name: "Ananthapuramu" },
        { id: 4, name: "Alluri Sitharama Raju" },
        { id: 5, name: "Bapatla" },
        { id: 6, name: "Chittoor" },
        { id: 7, name: "East Godavari" },
        { id: 8, name: "Eluru" },
        { id: 9, name: "Guntur" },
        { id: 10, name: "Kurnool" },
        { id: 11, name: "Kakinada" },
        { id: 12, name: "Konaseema" },
        { id: 13, name: "Krishna" },
        { id: 14, name: "Nandyal" },
        { id: 15, name: "NTR" },
        { id: 16, name: "Palnadu" },
        { id: 17, name: "Parvathipuram Manyam" },
        { id: 18, name: "Prakasam" },
        { id: 19, name: "Sri Sathya Sai" },
        { id: 20, name: "Sri Potti Sriramulu Nellore" },
        { id: 21, name: "Srikakulam" },
        { id: 22, name: "Tirupati" },
        { id: 23, name: "Visakhapatnam" },
        { id: 24, name: "Vizianagaram" },
        { id: 25, name: "West Godavari" },
        { id: 26, name: "Y.S.R Kadapa" },
    ];

    const handleDistrictChange = (districtId) => {
        setSelectedDistrict(districtId);
        setSelectedReservoir(null);
        localStorage.setItem("selectedDistrict", districtId);
        window.dispatchEvent(new Event("storage")); // Trigger storage event
        fetchReservoirs(districtId); // Fetch reservoirs for the selected district
    };

    const fetchReservoirs = async (districtId) => {
        setLoading(true);
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/reservoir/get-all-reservoirs/${districtId}`
            );
            const data = await response.json();
            console.log("Fetched Reservoirs Data:", data);

            if (data && Array.isArray(data)) {
                const reservoirOptions = data.map((reservoir) => ({
                    label: reservoir.name,
                    value: reservoir.id,
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

    const handleReservoirChange = (reservoirId) => {
        setSelectedReservoir(reservoirId);
        localStorage.setItem("selectedReservoir", reservoirId);
        window.dispatchEvent(new Event("storage")); // Trigger storage event
    };

    useEffect(() => {
        const handleStorageChange = () => {
            if (selectedDistrict) {
                fetchReservoirs(selectedDistrict);
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [selectedDistrict]);

    const districtOptions = useMemo(
        () => districts.map((d) => ({ label: d.name, value: d.id })),
        [districts]
    );

    const reservoirOptions = useMemo(() => {
        return reservoirs.map((r) => ({ label: r.label, value: r.value }));
    }, [reservoirs]);

    const selectedDistrictName = useMemo(() => {
        const district = districts.find((d) => d.id === parseInt(selectedDistrict));
        return district ? district.name : "Select District";
    }, [selectedDistrict, districts]);

    return (
        <div className="container mx-auto px-4">
            <section className="flex flex-wrap gap-5 justify-start items-center w-full text-2xl tracking-tight leading-none text-black whitespace-nowrap max-w-[1382px]">
                <section className="filter-dropdown-container gap-30">
                    <section className="button-container">
                            {/* <Dropdown
                                value={selectedDistrict}
                                onChange={(e) => handleDistrictChange(e.value)}
                                options={districtOptions}
                                placeholder={selectedDistrictName}
                                className="dropdown-style rounded-xl p-3 font-bold text-4xl bg-slate-100 w-1/2 text-red-900"
                            /> */}
                            

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
                                className="dropdown-style rounded-xl p-3 font-bold text-4xl bg-slate-100 w-1/2 text-red-900 ml-5"
                                disabled={loading || !reservoirOptions.length}
                            />
                            
                    </section>
                </section>
            </section>
        </div>
    );
};

export default DistrictReservoirDropdown;
