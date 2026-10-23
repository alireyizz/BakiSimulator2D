
(() => {
    "use strict";

    const DEFAULTS = {
        volume: 70,
        music: true,
        animations: true,
        shake: true,
        quality: "medium"
    };

    const $ = (selector) => document.querySelector(selector);
    const panel = $("#settings-panel");

    let settings = loadSettings();
    let previousFocus = null;
    let notificationTimer = null;
    let sceneRunning = false;

    function loadSettings() {
        try {
            const saved = localStorage.getItem("bakuSimulatorSettings");
            if (!saved) return { ...DEFAULTS };

            const data = JSON.parse(saved);

            return {
                volume: Number.isFinite(Number(data.volume))
                    ? Math.max(0, Math.min(100, Number(data.volume)))
                    : DEFAULTS.volume,
                music: typeof data.music === "boolean"
                    ? data.music : DEFAULTS.music,
                animations: typeof data.animations === "boolean"
                    ? data.animations : DEFAULTS.animations,
                shake: typeof data.shake === "boolean"
                    ? data.shake : DEFAULTS.shake,
                quality: ["low", "medium", "high"].includes(data.quality)
                    ? data.quality : DEFAULTS.quality
            };
        } catch {
            return { ...DEFAULTS };
        }
    }

    function applySettings() {
        const volume = $("#master-volume");
        const volumeOutput = $("#volume-output");
        const music = $("#music-toggle");
        const animations = $("#animations-toggle");
        const shake = $("#shake-toggle");
        const quality = $("#quality-select");

        document.documentElement.style.setProperty(
            "--game-volume",
            String(settings.volume / 100)
        );

        document.documentElement.dataset.quality = settings.quality;
        document.documentElement.dataset.animations =
            settings.animations ? "on" : "off";
        document.documentElement.dataset.shake =
            settings.shake ? "on" : "off";

        if (volume) volume.value = settings.volume;
        if (volumeOutput) volumeOutput.textContent = `${settings.volume}%`;
        if (music) music.checked = settings.music;
        if (animations) animations.checked = settings.animations;
        if (shake) shake.checked = settings.shake;
        if (quality) quality.value = settings.quality;
    }

    function saveSettings() {
        try {
            localStorage.setItem(
                "bakuSimulatorSettings",
                JSON.stringify(settings)
            );

            const status = $("#settings-status");
            if (status) status.textContent = "Yadda saxlanıldı ✓";
        } catch {
            const status = $("#settings-status");
            if (status) {
                status.textContent = "Yadda saxlamaq mümkün olmadı";
            }
        }

        applySettings();
    }

    function openSettings() {
        if (!panel) return;

        previousFocus = document.activeElement;
        panel.hidden = false;
        applySettings();

        panel.querySelector(".panel-back")?.focus();
    }

    function closeSettings() {
        if (!panel) return;

        panel.hidden = true;

        if (previousFocus && typeof previousFocus.focus === "function") {
            previousFocus.focus();
        }
    }

    function resetSettings() {
        settings = { ...DEFAULTS };
        saveSettings();
        showMessage("Ayarlar əvvəlki vəziyyətinə qaytarıldı. ✨");
    }

    async function toggleFullscreen() {
        try {
            if (!document.fullscreenElement) {
                if (!document.documentElement.requestFullscreen) {
                    showMessage(
                        "Bu brauzer tam ekran rejimini dəstəkləmir."
                    );
                    return;
                }

                await document.documentElement.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch {
            showMessage("Tam ekran rejimini açmaq mümkün olmadı.");
        }

        updateFullscreenButton();
    }

    function updateFullscreenButton() {
        const button = $("#fullscreen-toggle");
        if (!button) return;

        button.textContent =
            document.fullscreenElement ? "Bağla" : "Aç";
    }

    function showMessage(message) {
        const toast = $(".game-notification");
        if (!toast) return;

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(notificationTimer);

        notificationTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 2700);
    }

    function startGame() {
        if (sceneRunning) return;

        if (!window.BeggarScene ||
            typeof window.BeggarScene.start !== "function") {
            showMessage(
                "Oyun səhnəsi tapılmadı. beggar-scene.js faylını yoxla."
            );
            console.error(
                "BeggarScene tapılmadı. index.html daxilində " +
                "beggar-scene.js faylını main.js-dən əvvəl qoş."
            );
            return;
        }

        if (panel && !panel.hidden) {
            closeSettings();
        }

        try {
            sceneRunning = true;

            window.BeggarScene.start({
                onExit: () => {
                    sceneRunning = false;
                }
            });
        } catch (error) {
            sceneRunning = false;
            console.error("Oyun səhnəsi açıla bilmədi:", error);
            showMessage("Səhnə açıla bilmədi. Konsolu yoxla.");
        }
    }

    $("#master-volume")?.addEventListener("input", (event) => {
        settings.volume = Number(event.target.value);
        const output = $("#volume-output");

        if (output) {
            output.textContent = `${settings.volume}%`;
        }

        saveSettings();
    });

    $("#music-toggle")?.addEventListener("change", (event) => {
        settings.music = event.target.checked;
        saveSettings();

        showMessage(
            settings.music
                ? "Musiqi seçimi aktivdir. 🎵"
                : "Musiqi seçimi söndürüldü."
        );
    });

    $("#animations-toggle")?.addEventListener("change", (event) => {
        settings.animations = event.target.checked;
        saveSettings();
    });

    $("#shake-toggle")?.addEventListener("change", (event) => {
        settings.shake = event.target.checked;
        saveSettings();
    });

    $("#quality-select")?.addEventListener("change", (event) => {
        settings.quality = event.target.value;
        saveSettings();
    });

    document.addEventListener("click", (event) => {
        const button = event.target.closest("[data-action]");
        if (!button) return;

        switch (button.dataset.action) {
            case "settings":
                openSettings();
                break;

            case "close-settings":
                closeSettings();
                break;

            case "reset-settings":
                resetSettings();
                break;

            case "play":
                startGame();
                break;

            case "creators":
                showMessage(
                    "Bakı Simulator 2D — FI-JU Studio tərəfindən hazırlanır. ❤️"
                );
                break;
        }
    });

    $("#fullscreen-toggle")?.addEventListener(
        "click",
        toggleFullscreen
    );

    document.addEventListener(
        "fullscreenchange",
        updateFullscreenButton
    );

    panel?.addEventListener("click", (event) => {
        if (event.target === panel) closeSettings();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && panel && !panel.hidden) {
            closeSettings();
        }

        if (event.key === "Tab" && panel && !panel.hidden) {
            const items = panel.querySelectorAll(
                'button:not([disabled]), input:not([disabled]), ' +
                'select:not([disabled])'
            );

            if (!items.length) return;

            const first = items[0];
            const last = items[items.length - 1];

            if (
                event.shiftKey &&
                document.activeElement === first
            ) {
                event.preventDefault();
                last.focus();
            } else if (
                !event.shiftKey &&
                document.activeElement === last
            ) {
                event.preventDefault();
                first.focus();
            }
        }
    });

    applySettings();
    updateFullscreenButton();
})();
