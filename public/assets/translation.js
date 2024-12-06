function TranslateInit() {
    // Check if google.translate is already defined
    if (window.google && window.google.translate) {
        initializeTranslation(); // If it's already loaded, initialize the translation
    } else {
        // Dynamically load the Google Translate script
        const script = document.createElement("script");
        script.src = "//translate.google.com/translate_a/element.js?cb=TranslateInit";
        script.async = true;
        document.head.appendChild(script);

        // Once the script is loaded, initialize the translation
        window.TranslateInit = function () {
            initializeTranslation();
        };
    }
}

function initializeTranslation() {
    if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
            {
                pageLanguage: window.__GOOGLE_TRANSLATION_CONFIG__.defaultLanguage,
                includedLanguages: window.__GOOGLE_TRANSLATION_CONFIG__.languages
                    .map((lang) => lang.name)
                    .join(","),
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
            },
            "google_translate_element"
        );
    }
}