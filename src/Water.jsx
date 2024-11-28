import React from 'react'
import WaterForecast from "./WaterForecast.jsx";
import SideBar from "../src/component/SideBar.jsx"
import Header from './component/Header.jsx';


const Water = () => {
    return (
        <div className="w-fullshadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-component overflow-hidden flex flex-col items-end justify-start pt-[22px] pb-8 pr-[46px] pl-0 box-border gap-[6px] leading-[normal] tracking-[normal] mq725:pr-[23px] mq725:box-border">
            {/* <div className="w-[596.7px] h-[322.4px] relative [filter:blur(157.2px)] rounded-[66px] bg-gainsboro-200 box-border hidden max-w-full border-[10px] border-solid border-black" />
            <footer className="w-[1121.3px] h-[389.1px] relative shadow-[0px_16px_24px_rgba(0,_0,_0,_0.06),_0px_2px_6px_rgba(0,_0,_0,_0.04),_0px_0px_1px_rgba(0,_0,_0,_0.04)] rounded-[19px] shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-component hidden max-w-full" />
            <div className="w-[455px] h-[439px] relative [filter:blur(151.16px)] bg-gainsboro-300 box-border hidden max-w-full border-[10px] border-solid border-black" />
            <div className="w-[357.6px] h-[1081.6px] relative [filter:blur(151.16px)] rounded-[42px] bg-gainsboro-300 box-border [transform:_rotate(-90deg)] hidden max-w-full border-[10px] border-solid border-black" /> */}
            <Header />
            <main className="w-full flex flex-row items-start justify-start gap-[32px]  mq1000:pl-5 mq1000:pr-5 mq1000:box-border mq725:gap-[16px]">
                
                <WaterForecast />
            </main>
        </div>
    )
}

export default Water
