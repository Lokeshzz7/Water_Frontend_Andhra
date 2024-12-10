import React, { useRef } from 'react';
import { PDFExport } from "@progress/kendo-react-pdf";
import { Button } from '@progress/kendo-react-buttons';
import WaterConsumptionGraph from '../graph/report_graph/ReportWaterConsumptionGraph.jsx';
import ReservoirPerformanceChart from '../graph/report_graph/ReportLucGraph.jsx';
import MonthlyConsumptionChart from '../graph/report_graph/ReportMonthConsumtionGraph.jsx';
import ScenarioAnalysisChart from '../graph/report_graph/ReportScenarioGraph.jsx';

const Reports = () => {
    const pdfExportComponent = useRef(null);

    const exportPDF = () => {
        if (pdfExportComponent.current) {
            pdfExportComponent.current.save();
        }
    };

    return (
        <div className="container mx-auto py-5">
            {/* Button to Trigger PDF Download */}
            <div className="example-config mb-4">
                <Button type="button" onClick={exportPDF}>
                    Download Report
                </Button>
            </div>

            {/* PDFExport Wrapper */}
            <PDFExport
                ref={pdfExportComponent}
                paperSize="auto"
                margin={40}
                fileName={`Water_Management_Report_${new Date().toISOString().slice(0, 10)}`}
                author="Water Management Team"
            >
                {/* Report Content */}
                <header className="text-white p-6 w-[1350px] ml-6 mt-3 rounded-lg shadow-md bg-component">
                    <h1 className="text-2xl font-bold">Reports - Water Management Dashboard</h1>
                    <p className="text-sm">Graphical analysis and insights based on selected parameters</p>
                </header>

                {/* Section 1: Graphs */}
                <section className="flex flex-row w-full mt-6">
                    <div className="flex flex-row flex-1 p-3 gap-7">
                        <div className="flex flex-col w-1/2">
                            <h3 className="font-semibold mb-4 ml-6">Land Use Distribution</h3>
                            <ReservoirPerformanceChart />
                        </div>
                        <div className="flex flex-col w-1/2">
                            <h3 className="font-semibold mb-4 ml-2">Monthly Water Consumption Analysis</h3>
                            <MonthlyConsumptionChart />
                        </div>
                    </div>
                </section>

                {/* Section 2: More Graphs */}
                <section className="flex flex-row w-full mt-6">
                    <div className="flex flex-row w-full p-3 gap-7">
                        <div className="flex flex-col w-1/2">
                            <h3 className="font-semibold mb-4 ml-4">Yearly Water Consumption Trends</h3>
                            <WaterConsumptionGraph />
                        </div>
                        <div className="flex flex-col w-1/2">
                            <h3 className="font-semibold mb-4 ml-6">Scenario Analysis Outcomes</h3>
                            <ScenarioAnalysisChart />
                        </div>
                    </div>
                </section>
            </PDFExport>
        </div>
    );
};

export default Reports;
