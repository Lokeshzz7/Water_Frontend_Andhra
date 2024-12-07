import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

const COOKIE_NAME = "googtrans";

const LanguageSwitcher = () => {
    const [languageConfig, setLanguageConfig] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState("");
    useEffect(() =>{
        window.TranslateInit();
    },[])
    
    useEffect(() => {
        const config = window.__GOOGLE_TRANSLATION_CONFIG__;
        console.log(config);
        
        if (!config || !config.languages) {
            console.error("Google Translation config is missing or invalid.");
            return;
        }

        setLanguageConfig(config);

        const existingLanguageCookieValue = Cookies.get(COOKIE_NAME);
        let languageValue = existingLanguageCookieValue
            ? existingLanguageCookieValue.split("/")[2]
            : config.defaultLanguage;

        setSelectedLanguage(languageValue || config.defaultLanguage);
    }, []);

    const handleLanguageChange = (event) => {
        const newLanguage = event.target.value;
        setSelectedLanguage(newLanguage);

        Cookies.set(COOKIE_NAME, `/auto/${newLanguage}/`);
        // Trigger Google Translate language change
        window.location.reload();   
    };

    if (!languageConfig) {
        return null;
    }

    return (
        <div>
            <select
                id="language-selector"
                value={selectedLanguage}
                onChange={handleLanguageChange}
                className="dropdown-style rounded-xl p-3 font-bold text-4xl bg-slate-100 w-[150px] "
            >
                {languageConfig.languages.map((lang) => (
                    <option key={lang.name} value={lang.name}>
                        {lang.title}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LanguageSwitcher;
