"use strict";

const LOCALSTORAGE_KEY = "color-scheme";
const LIGHT_CLASS = "light";
let mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

// true means "dark scheme", false means "light scheme"
function storedToBool(s) {
    if (s === "dark") {
        return true;
    } else if (s === "light") {
        return false;
    } else {
        return null;
    }
}

function ensureScheme(desiredScheme) {
    let osScheme = mediaQuery.matches;

    // Only store the preference if it's not the same as the OS one
    if (desiredScheme === osScheme) {
        localStorage.removeItem(LOCALSTORAGE_KEY);
    } else {
        localStorage.setItem(LOCALSTORAGE_KEY, desiredScheme ? "dark" : "light");
    }

    if (desiredScheme) {
        document.documentElement.classList.remove(LIGHT_CLASS);
    } else {
        document.documentElement.classList.add(LIGHT_CLASS);
    }
}

function initDarkMode() {
    let storedScheme = storedToBool(localStorage.getItem(LOCALSTORAGE_KEY));
    let osScheme = mediaQuery.matches;

    // Initialize with stored preference or OS preference
    ensureScheme(storedScheme === null ? osScheme : storedScheme);
    mediaQuery.addEventListener("change", osDarkModeChanged);
}

function osDarkModeChanged(query) {
    let osScheme = query.matches;
    let pageScheme = !document.documentElement.classList.contains(LIGHT_CLASS);

    // If the current preference is the same as that of the OS, sync with OS changes
    if (pageScheme != osScheme) {
        ensureScheme(!pageScheme);
    }
}

function toggleDarkMode() {
    // Toggle based on current color scheme
    let currentScheme = !document.documentElement.classList.contains(LIGHT_CLASS);
    ensureScheme(!currentScheme);
}

// Initialize immediately to prevent flash of wrong theme
initDarkMode();
