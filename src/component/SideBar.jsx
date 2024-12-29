import { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from 'react-router-dom';

const Menu = ({ className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1224);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        setUserRole(role);
    }, []);

    const toggleSidebar = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    const onNavItemClick = (path) => {
        navigate(path);
        if (isMobile) setIsOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    const isAdmin = userRole === 'admin';

    const navItems = [
        // { path: "/", label: "Home", icon: <i className="pi pi-home" style={{ fontSize: "1.5rem", color: "white" }}></i> },
        { path: "/waterforecast", label: "Water Forecast", icon: <i className="pi pi-chart-line" style={{ fontSize: "1.5rem", color: "white" }}></i> },
        { path: "/reservoirstatus", label: "Reservoir Status", icon: <i className="pi pi-map-marker" style={{ fontSize: "1.5rem", color: "white" }}></i> },
        { path: "/scenarioplanning", label: "Scenario Planning", icon: <i className="pi pi-calendar" style={{ fontSize: "1.5rem", color: "white" }}></i> },
        { path: "/riskassessment", label: "Risk Assessment", icon: <i className="pi pi-exclamation-triangle" style={{ fontSize: "1.5rem", color: "white" }}></i> },
        { path: "/map", label: "Map", icon: <i className="pi pi-globe" style={{ fontSize: "1.5rem", color: "white" }}></i> },
        { path: "/reports", label: "Reports", icon: <i className="pi pi-file" style={{ fontSize: "1.5rem", color: "white" }}></i> },
        { path: "/imports", label: "Imports", icon: <i className="pi pi-file" style={{ fontSize: "1.5rem", color: "white" }}></i> },
    ];
    return (
        <>
            {isMobile && (<div
                className={`fixed top-4 left-4 w-10 h-10 flex items-center justify-center text-white cursor-pointer z-50 ${isMobile ? 'shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-component rounded-full' : 'right-7'} ${isMobile ? '' : 'absolute'}`}
                onClick={toggleSidebar}
            >
                {isOpen ? (
                    <svg opacity="0.5" height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" fill="currentColor"></path>
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" opacity="0.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"></path>
                    </svg>
                )}
            </div>)}

            {/* Sidebar */}
            <div
                className={`${isMobile
                        ? `fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
                        } ${isOpen ? "w-[280px]" : "w-[60px]"}`
                        : `relative flex ${isOpen ? "w-[280px]" : "w-[60px]"}`
                    } min-h-screen rounded-3xl shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-component flex flex-col items-center pt-[27.6px] pb-7 pr-[30px] pl-7 box-border text-middle transition-all duration-300 ease-in-out ${className}`}
            >
                <div
                    className={`fixed top-4 left-4 w-10 h-10 flex items-center justify-center text-white cursor-pointer z-50 ${isMobile ? 'shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-component rounded-full' : 'right-7'} ${isMobile ? '' : 'absolute'}`}
                    onClick={toggleSidebar}
                >
                    {isOpen ? (
                        <svg opacity="0.5" height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" fill="currentColor"></path>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" opacity="0.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"></path>
                        </svg>
                    )}
                </div>
                {isOpen && (
                    <>

                        {navItems.map((item, index) => (
                            <div key={index} className="self-stretch flex flex-row items-start justify-end pt-0 mt-[60px]">
                                <div
                                    className={`flex-1 flex flex-row items-start justify-between gap-[20px] p-[10px] rounded-xl cursor-pointer z-[1] ${isActive(item.path) ? 'bg-[#5932EA]' : ''}`}
                                    onClick={() => onNavItemClick(item.path)}
                                >
                                    {item.icon}
                                    <div className="flex-1 relative tracking-[-0.01em] font-medium text-white text-[20px]">
                                        {item.label}
                                    </div>
                                    <div className="text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* Overlay */}
            {isOpen && isMobile && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-30"
                    onClick={toggleSidebar}
                ></div>
            )}
        </>
    );
};

Menu.propTypes = {
    className: PropTypes.string,
};

export default Menu;
