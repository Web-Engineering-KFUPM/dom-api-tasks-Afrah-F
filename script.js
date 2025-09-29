// script.js

// =======================================
// Helpers
// =======================================
function byId(id) {
    return document.getElementById(id);
}

function setText(id, text) {
    const el = byId(id);
    if (el) el.textContent = text;
}

function safeNumber(n, fallback = "—") {
    return typeof n === "number" && !Number.isNaN(n) ? n : fallback;
}

async function fetchJSON(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP " + res.status);
    return res.json();
}

// =======================================
// Main
// =======================================
document.addEventListener("DOMContentLoaded", function () {
    /* -------------------------------------
     * TODO1: Welcome Board
     * - On load, put a greeting in #t1-msg
     * ------------------------------------- */
    setText("t1-msg", "Hello, Everyone!");

    const t2Btn = byId("t2-btn");
    if (t2Btn) {
        t2Btn.addEventListener("click", function () {
            setText("t2-status", "You clicked the button!");
            // If you want your personal quote here instead, replace the line above with:
            // setText("t2-status", "“Do it now. Sometimes later becomes never.” — Afrah");
        });
    }

    /* -------------------------------------
     * TODO3: Inspiring Quote Board
     * - Default to your quote on load
     * - On #t3-loadQuote click, fetch a
     *   random quote and author from API
     *   (fallback to your quote on error)
     * ------------------------------------- */
    const quoteBtn = byId("t3-loadQuote");
    const quoteEl = byId("t3-quote");
    const authorEl = byId("t3-author");

    // Default quote shown on page load
    setText("t3-quote", "“Do it now. Sometimes later becomes never.”");
    setText("t3-author", "— Afrah");

    async function loadQuote() {
        if (!quoteBtn || !quoteEl || !authorEl) return;

        quoteBtn.disabled = true;
        const prevQuote = quoteEl.textContent;
        const prevAuthor = authorEl.textContent;
        quoteEl.textContent = "Loading…";
        authorEl.textContent = "";

        try {
            const data = await fetchJSON("https://dummyjson.com/quotes/random");
            const quote = data?.content || "Keep going. Keep growing.";
            const author = data?.author || "Unknown";
            quoteEl.textContent = `“${quote}”`;
            authorEl.textContent = `— ${author}`;
        } catch (err) {
            // Fallback to your quote on any error
            quoteEl.textContent = "“Do it now. Sometimes later becomes never.”";
            authorEl.textContent = "— Afrah";
        } finally {
            // Safety: if something went wrong mid-way, restore previous
            if (!quoteEl.textContent || quoteEl.textContent === "Loading…") {
                quoteEl.textContent = prevQuote;
                authorEl.textContent = prevAuthor;
            }
            quoteBtn.disabled = false;
        }
    }

    if (quoteBtn) {
        quoteBtn.addEventListener("click", loadQuote);
    }

    /* -------------------------------------
     * TODO4: Dammam Weather Now
     * - On #t4-loadWx click, fetch current
     *   weather from OpenWeatherMap and show:
     *   temp (°C), humidity (%), wind (m/s)
     *   - Show friendly errors
     *   - Disable button while loading
     * ------------------------------------- */
    const wxBtn  = byId("t4-loadWx");
    const tempEl = byId("t4-temp");
    const humEl  = byId("t4-hum");
    const windEl = byId("t4-wind");
    const errEl  = byId("t4-err");

    const OPENWEATHER_KEY = "d51f2f00c3b137ccfd135bd8f9dd50aa";

    async function loadWeather() {
        if (!wxBtn || !tempEl || !humEl || !windEl) return;

        // UI: loading state
        if (errEl) errEl.textContent = "";
        wxBtn.disabled = true;
        tempEl.textContent = "Loading…";
        humEl.textContent  = "Loading…";
        windEl.textContent = "Loading…";

        const base  = "https://api.openweathermap.org/data/2.5/weather";
        const city  = "Dammam";
        const units = "metric";
        const url   = `${base}?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_KEY}&units=${units}`;

        try {
            const data = await fetchJSON(url);
            const temp = safeNumber(data?.main?.temp);
            const hum  = safeNumber(data?.main?.humidity);
            const wind = safeNumber(data?.wind?.speed);

            tempEl.textContent = temp === "—" ? "—" : `${temp.toFixed(1)} °C`;
            humEl.textContent  = hum  === "—" ? "—" : `${hum} %`;
            windEl.textContent = wind === "—" ? "—" : `${wind.toFixed(1)} m/s`;
        } catch (err) {
            const msg = String(err.message).includes("401")
                ? "Invalid API key (HTTP 401). Please check your key."
                : String(err.message).includes("404")
                    ? "City not found (HTTP 404)."
                    : "Could not load weather. Please try again.";
            tempEl.textContent = "—";
            humEl.textContent  = "—";
            windEl.textContent = "—";
            if (errEl) errEl.textContent = msg;
        } finally {
            wxBtn.disabled = false;
        }
    }

    if (wxBtn) {
        wxBtn.addEventListener("click", loadWeather);
    }
});
