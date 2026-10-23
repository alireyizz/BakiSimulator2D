
(() => {
    "use strict";

    let root = null;
    let onExit = null;
    let step = 0;
    let state = "walking";
    let moneyTaken = false;
    let animationFrame = null;

    const STYLE_ID = "bakisimulator-cartoon-v2";

    const css = `
    #beggar-cartoon-scene {
        --ink: #443126;
        --cream: #fff4d9;
        --paper: #fffaeb;
        --green: #94c96f;
        --yellow: #ffd66e;
        --coral: #ed997e;
        position: fixed;
        inset: 0;
        z-index: 99999;
        overflow: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 14px;
        color: var(--ink);
        background:
            radial-gradient(ellipse at 15% 10%, #fff8dd 0 2%, transparent 3%),
            radial-gradient(ellipse at 88% 86%, #c7d7a1 0 3%, transparent 4%),
            #e9d4a9;
        font-family: "Trebuchet MS", "Arial Rounded MT Bold", Arial, sans-serif;
        animation: bc-appear .3s ease-out;
    }

    #beggar-cartoon-scene * { box-sizing: border-box; }

    #beggar-cartoon-scene button {
        -webkit-tap-highlight-color: transparent;
        font-family: inherit;
    }

    #beggar-cartoon-scene .bc-shell {
        width: min(1200px, 100%);
        overflow: hidden;
        background: var(--cream);
        border: 4px solid var(--ink);
        border-radius: 25px;
        box-shadow: 0 7px 0 #b39a70, 0 18px 55px #49372a30;
        animation: bc-rise .45s cubic-bezier(.2,.8,.2,1);
    }

    #beggar-cartoon-scene .bc-top {
        min-height: 76px;
        padding: 13px 19px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        border-bottom: 3px solid var(--ink);
        background:
            radial-gradient(#d6bd91 1px, transparent 1.5px) 0 0 / 13px 13px,
            var(--cream);
    }

    #beggar-cartoon-scene .bc-brand-row {
        display: flex;
        align-items: center;
        gap: 11px;
        min-width: 0;
    }

    #beggar-cartoon-scene .bc-brand-icon {
        display: grid;
        place-items: center;
        width: 43px;
        height: 43px;
        flex-shrink: 0;
        border: 3px solid var(--ink);
        border-radius: 13px;
        background: var(--yellow);
        box-shadow: 0 3px 0 var(--ink);
        font-size: 23px;
        transform: rotate(-4deg);
    }

    #beggar-cartoon-scene .bc-brand {
        font-size: clamp(15px, 2.5vw, 22px);
        font-weight: 1000;
        letter-spacing: -.7px;
        line-height: 1.15;
    }

    #beggar-cartoon-scene .bc-subtitle {
        margin-top: 4px;
        color: #90755a;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: .5px;
    }

    #beggar-cartoon-scene .bc-exit {
        padding: 10px 14px;
        flex-shrink: 0;
        border: 3px solid var(--ink);
        border-radius: 12px;
        background: #f5d8ae;
        color: var(--ink);
        font-size: 12px;
        font-weight: 1000;
        cursor: pointer;
        box-shadow: 0 3px 0 var(--ink);
        transition: transform .15s;
    }

    #beggar-cartoon-scene .bc-exit:active {
        transform: translateY(3px);
        box-shadow: none;
    }

    #beggar-cartoon-scene .bc-world {
        position: relative;
        overflow: hidden;
        background: #a9dce4;
        isolation: isolate;
    }

    #beggar-cartoon-scene .bc-art {
        display: block;
        width: 100%;
        height: auto;
        min-height: 260px;
    }

    #beggar-cartoon-scene .bc-world::after {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: linear-gradient(180deg, #fff5d908, transparent 60%, #4431260b);
    }

    #beggar-cartoon-scene .bc-location,
    #beggar-cartoon-scene .bc-progress {
        position: absolute;
        z-index: 2;
        top: 14px;
        padding: 9px 13px;
        border: 3px solid var(--ink);
        border-radius: 12px;
        color: var(--ink);
        font-size: 11px;
        font-weight: 1000;
        box-shadow: 0 3px 0 var(--ink);
    }

    #beggar-cartoon-scene .bc-location {
        left: 14px;
        background: var(--paper);
    }

    #beggar-cartoon-scene .bc-progress {
        right: 14px;
        background: var(--yellow);
    }

    #beggar-cartoon-scene .bc-progress-dots {
        display: flex;
        gap: 5px;
        margin-top: 6px;
    }

    #beggar-cartoon-scene .bc-dot {
        width: 21px;
        height: 5px;
        border-radius: 5px;
        background: #d7c7a5;
    }

    #beggar-cartoon-scene .bc-dot.active {
        background: #659650;
    }

    #beggar-cartoon-scene .bc-bottom {
        padding: 18px 20px 15px;
        border-top: 3px solid var(--ink);
        background:
            radial-gradient(#d7c29a 1px, transparent 1.5px) 0 0 / 15px 15px,
            var(--cream);
    }

    #beggar-cartoon-scene .bc-dialogue {
        display: flex;
        align-items: stretch;
        gap: 13px;
        margin-bottom: 17px;
    }

    #beggar-cartoon-scene .bc-avatar {
        width: 57px;
        min-width: 57px;
        height: 57px;
        display: grid;
        place-items: center;
        border: 3px solid var(--ink);
        border-radius: 18px;
        background: var(--yellow);
        box-shadow: 0 4px 0 var(--ink);
        font-size: 30px;
        transform: rotate(-3deg);
    }

    #beggar-cartoon-scene .bc-speech-wrap {
        flex: 1;
        min-width: 0;
    }

    #beggar-cartoon-scene .bc-speaker {
        margin: 0 0 5px 4px;
        color: #8a6b4d;
        font-size: 10px;
        font-weight: 1000;
        letter-spacing: 1.2px;
        text-transform: uppercase;
    }

    #beggar-cartoon-scene .bc-speech {
        position: relative;
        min-height: 49px;
        padding: 12px 15px;
        border: 3px solid var(--ink);
        border-radius: 14px;
        background: var(--paper);
        font-size: 14px;
        font-weight: 800;
        line-height: 1.55;
        box-shadow: 0 3px 0 #cdb58f;
    }

    #beggar-cartoon-scene .bc-speech::before {
        content: "";
        position: absolute;
        left: -9px;
        top: 16px;
        width: 13px;
        height: 13px;
        background: var(--paper);
        border-left: 3px solid var(--ink);
        border-bottom: 3px solid var(--ink);
        transform: rotate(45deg);
    }

    #beggar-cartoon-scene .bc-actions {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 11px;
    }

    #beggar-cartoon-scene .bc-btn {
        position: relative;
        min-height: 51px;
        padding: 12px 15px;
        border: 3px solid var(--ink);
        border-radius: 14px;
        background: var(--yellow);
        color: var(--ink);
        font-size: 13px;
        font-weight: 1000;
        cursor: pointer;
        box-shadow: 0 5px 0 var(--ink);
        transition: transform .12s, filter .12s, box-shadow .12s;
    }

    #beggar-cartoon-scene .bc-btn:hover {
        filter: brightness(1.04) saturate(1.08);
        transform: translateY(-2px);
    }

    #beggar-cartoon-scene .bc-btn:active {
        transform: translateY(4px);
        box-shadow: 0 1px 0 var(--ink);
    }

    #beggar-cartoon-scene .bc-btn.primary { background: var(--green); }
    #beggar-cartoon-scene .bc-btn.danger { background: var(--coral); }
    #beggar-cartoon-scene .bc-btn.wide { grid-column: 1 / -1; }

    #beggar-cartoon-scene .bc-footer {
        padding-top: 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        color: #9b8061;
        font-size: 9px;
        font-weight: 1000;
        letter-spacing: 1px;
    }

    #beggar-cartoon-scene .bc-footer-note {
        display: flex;
        align-items: center;
        gap: 5px;
    }

    #beggar-cartoon-scene .bc-money-card {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0 0 16px;
        padding: 12px 14px;
        border: 3px dashed #719456;
        border-radius: 14px;
        background: #e6f1cf;
        animation: bc-pop .45s ease-out;
    }

    #beggar-cartoon-scene .bc-money-icon {
        display: grid;
        place-items: center;
        width: 43px;
        height: 43px;
        flex-shrink: 0;
        border: 3px solid #466d42;
        border-radius: 50%;
        background: #a6d180;
        color: #355638;
        font-size: 21px;
        font-weight: 1000;
    }

    #beggar-cartoon-scene .bc-money-title {
        font-size: 12px;
        font-weight: 1000;
    }

    #beggar-cartoon-scene .bc-money-caption {
        margin-top: 3px;
        color: #68845b;
        font-size: 11px;
        font-weight: 800;
    }

    @keyframes bc-appear {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes bc-rise {
        from { opacity: 0; transform: translateY(12px) scale(.985); }
        to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @keyframes bc-pop {
        0% { opacity: 0; transform: scale(.94); }
        70% { transform: scale(1.02); }
        100% { opacity: 1; transform: scale(1); }
    }

    @keyframes bc-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
    }

    #beggar-cartoon-scene .bc-floating {
        transform-box: fill-box;
        transform-origin: center;
        animation: bc-float 3s ease-in-out infinite;
    }

    #beggar-cartoon-scene .bc-cloud {
        animation: bc-cloud 22s ease-in-out infinite alternate;
    }

    @keyframes bc-cloud {
        from { transform: translateX(-7px); }
        to { transform: translateX(10px); }
    }

    @media (max-width: 600px) {
        #beggar-cartoon-scene {
            padding: 7px;
            align-items: flex-start;
        }

        #beggar-cartoon-scene .bc-shell {
            margin: auto 0;
            border-radius: 17px;
        }

        #beggar-cartoon-scene .bc-top { padding: 11px; }
        #beggar-cartoon-scene .bc-brand-icon {
            width: 37px;
            height: 37px;
            font-size: 20px;
        }

        #beggar-cartoon-scene .bc-subtitle { font-size: 9px; }
        #beggar-cartoon-scene .bc-exit { padding: 9px 10px; }
        #beggar-cartoon-scene .bc-art { min-height: 210px; }
        #beggar-cartoon-scene .bc-bottom { padding: 13px; }
        #beggar-cartoon-scene .bc-avatar {
            width: 44px;
            min-width: 44px;
            height: 44px;
            border-radius: 14px;
            font-size: 24px;
        }

        #beggar-cartoon-scene .bc-speech {
            padding: 10px 12px;
            font-size: 12px;
        }

        #beggar-cartoon-scene .bc-actions { grid-template-columns: 1fr; }
        #beggar-cartoon-scene .bc-btn { min-height: 46px; }
        #beggar-cartoon-scene .bc-footer { font-size: 8px; }
        #beggar-cartoon-scene .bc-location,
        #beggar-cartoon-scene .bc-progress {
            top: 9px;
            padding: 7px 9px;
            font-size: 9px;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        #beggar-cartoon-scene *,
        #beggar-cartoon-scene *::before,
        #beggar-cartoon-scene *::after {
            animation-duration: .01ms !important;
            transition-duration: .01ms !important;
        }
    }`;

    function installStyles() {
        if (document.getElementById(STYLE_ID)) return;
        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = css;
        document.head.appendChild(style);
    }

    function windowShape(x, y, w = 27, h = 34, color = "#a7dce5") {
        return `
            <g stroke="#49372a" stroke-width="3.5" stroke-linejoin="round">
                <rect x="${x}" y="${y}" width="${w}" height="${h}"
                      rx="2" fill="${color}"/>
                <path d="M${x + w / 2} ${y} V${y + h}
                         M${x} ${y + h / 2} H${x + w}"
                      fill="none"/>
                <path d="M${x - 3} ${y + h + 3} H${x + w + 3}"
                      stroke-width="5"/>
            </g>`;
    }

    function buildingLeft() {
        let windows = "";
        [[24, 127], [66, 119], [108, 127],
         [24, 175], [66, 167], [108, 175],
         [24, 223], [108, 223]].forEach(([x, y]) => {
            windows += windowShape(x, y, 27, 32);
        });

        return `
        <g stroke="#49372a" stroke-width="4" stroke-linejoin="round">
            <path d="M0 111 L95 84 L163 105 L163 292 L0 292Z"
                  fill="#e7a982"/>
            <path d="M0 111 L95 84 L163 105 L67 132Z"
                  fill="#f8d0a6"/>
            <path d="M0 111 L95 84 L95 98 L0 125Z"
                  fill="#cf8869"/>
            <path d="M0 146 L163 121" fill="none" stroke-width="3"/>
            <path d="M0 194 L163 169" fill="none" stroke-width="3"/>
            <path d="M0 242 L163 217" fill="none" stroke-width="3"/>
            ${windows}
            <path d="M52 252 L103 239 L103 292 L52 292Z"
                  fill="#9e684b"/>
            <path d="M59 256 L96 247" fill="none" stroke="#d9a17b" stroke-width="3"/>
            <circle cx="92" cy="273" r="2.5" fill="#f6d36e"/>
            <path d="M0 292 H163" stroke-width="7"/>
            <path d="M0 108 L95 80 L163 102" fill="none" stroke-width="6"/>
            <path d="M9 102 L9 80 L45 70 L45 92"
                  fill="#e5b28e"/>
        </g>`;
    }

    function buildingRight() {
        let windows = "";
        [[741, 151], [786, 160], [831, 151],
         [741, 201], [786, 210], [831, 201]].forEach(([x, y]) => {
            windows += windowShape(x, y, 28, 33, "#94cbd9");
        });

        return `
        <g stroke="#49372a" stroke-width="4" stroke-linejoin="round">
            <path d="M704 126 L800 98 L900 119 L900 295 L704 295Z"
                  fill="#f1c66e"/>
            <path d="M704 126 L800 98 L900 119 L804 148Z"
                  fill="#ffe2a0"/>
            <path d="M704 126 L800 98 L800 112 L704 140Z"
                  fill="#dcae5b"/>
            <path d="M704 172 L900 165 M704 224 L900 217"
                  fill="none" stroke-width="3"/>
            ${windows}
            <path d="M804 240 L850 240 L850 295 L804 295Z"
                  fill="#a06c4c"/>
            <path d="M811 249 L843 249 M811 258 L843 258"
                  fill="none" stroke="#d9a17b" stroke-width="3"/>
            <path d="M704 295 H900" stroke-width="7"/>
            <path d="M701 123 L800 94 L900 115"
                  fill="none" stroke-width="6"/>
        </g>`;
    }

    function flameTowers() {
        return `
        <g stroke="#49372a" stroke-width="3.5" stroke-linejoin="round">
            <path d="M402 219 Q389 168 410 128 Q429 98 441 72
                     Q451 111 460 137 Q474 177 461 219Z"
                  fill="#e8b2a0"/>
            <path d="M410 202 Q403 164 420 134 Q430 114 440 90
                     Q446 132 453 153 Q464 182 455 202Z"
                  fill="#f3d4b0"/>
            <path d="M470 219 Q458 171 478 137 Q492 111 502 85
                     Q515 124 526 151 Q539 187 526 219Z"
                  fill="#e7a28c"/>
            <path d="M479 204 Q472 174 489 148 Q499 128 502 104
                     Q511 144 520 163 Q529 188 520 204Z"
                  fill="#f5d4a8"/>
            <path d="M438 220 Q428 182 441 155 Q452 130 465 112
                     Q475 155 484 179 Q491 200 485 220Z"
                  fill="#d98f7a"/>
            <path d="M448 208 Q441 183 453 160 L465 134
                     Q470 170 478 190 L478 208Z"
                  fill="#f8d5aa"/>
            <path d="M393 220 H541" stroke-width="5"/>
        </g>`;
    }

    function tree(x, y, scale = 1) {
        return `
        <g transform="translate(${x} ${y}) scale(${scale})"
           stroke="#49372a" stroke-width="3.5" stroke-linejoin="round">
            <path d="M-7 0 L-10 -53 L9 -53 L8 0Z" fill="#a66c47"/>
            <path d="M-1 -40 L-23 -61 M3 -30 L23 -50"
                  fill="none" stroke-width="5" stroke-linecap="round"/>
            <circle cx="0" cy="-75" r="26" fill="#6ea75d"/>
            <circle cx="-20" cy="-62" r="19" fill="#94c96f"/>
            <circle cx="20" cy="-61" r="18" fill="#83b96b"/>
            <circle cx="-7" cy="-88" r="17" fill="#a4cf7b"/>
            <path d="M-13 -79 Q-3 -88 5 -78" fill="none"
                  stroke="#c4df92" stroke-width="4"/>
        </g>`;
    }

    function car(x, y, color, scale = 1) {
        return `
        <g transform="translate(${x} ${y}) scale(${scale})"
           stroke="#49372a" stroke-width="3.5" stroke-linejoin="round">
            <path d="M-49 -11 L-36 -28 Q-31 -36 -20 -36 H16
                     Q27 -36 35 -24 L46 -12 L51 0 H-51Z"
                  fill="${color}"/>
            <path d="M-29 -27 Q-25 -32 -18 -32 H-3 V-14 H-38Z"
                  fill="#b5e1e5"/>
            <path d="M2 -32 H15 Q23 -32 29 -23 L36 -14 H2Z"
                  fill="#b5e1e5"/>
            <path d="M-49 -11 H50" fill="none" stroke-width="4"/>
            <circle cx="-31" cy="0" r="11" fill="#4e453e"/>
            <circle cx="-31" cy="0" r="5" fill="#f7e5bf"/>
            <circle cx="31" cy="0" r="11" fill="#4e453e"/>
            <circle cx="31" cy="0" r="5" fill="#f7e5bf"/>
            <rect x="39" y="-10" width="8" height="6" rx="2" fill="#fff0b1"/>
            <rect x="-48" y="-10" width="7" height="6" rx="2" fill="#d66d55"/>
        </g>`;
    }

    function busStop() {
        return `
        <g stroke="#49372a" stroke-width="3.5" stroke-linejoin="round">
            <path d="M205 201 V280 M274 201 V280"
                  fill="none" stroke-width="6"/>
            <path d="M196 203 H284 L276 193 H204Z" fill="#f6d36e"/>
            <rect x="210" y="211" width="59" height="49" rx="3"
                  fill="#e3f0d1"/>
            <path d="M239 212 V260 M210 236 H269"
                  fill="none" stroke-width="2.5"/>
            <path d="M205 263 H278" fill="none" stroke-width="5"/>
            <rect x="222" y="179" width="39" height="22" rx="5"
                  fill="#fff4d9"/>
            <text x="241" y="194" font-size="10" font-weight="1000"
                  text-anchor="middle" fill="#49372a" stroke="none">BAKI</text>
        </g>`;
    }

    function streetSign() {
        return `
        <g stroke="#49372a" stroke-width="3.5" stroke-linejoin="round">
            <path d="M659 210 V291" fill="none" stroke-width="6"/>
            <path d="M625 179 Q625 174 631 174 H687 Q693 174 693 180
                     V205 Q693 211 687 211 H631 Q625 211 625 205Z"
                  fill="#94c96f"/>
            <text x="659" y="191" font-size="11" font-weight="1000"
                  text-anchor="middle" fill="#355638" stroke="none">BAKI</text>
            <path d="M638 199 H680" stroke="#355638" stroke-width="2"/>
        </g>`;
    }

    function character(x, y) {
        return `
        <g transform="translate(${x} ${y})"
           stroke="#49372a" stroke-width="4" stroke-linejoin="round">
            <!-- Ayaqlar -->
            <path d="M-15 -31 L-19 -8 L-30 -3 Q-33 2 -26 4
                     H-5 L0 -5 L-2 -30Z" fill="#5d5045"/>
            <path d="M7 -31 L12 -8 L23 -4 Q28 1 22 4
                     H4 L-2 -4 L-2 -30Z" fill="#5d5045"/>
            <path d="M-30 -4 H-7 M4 -4 H25"
                  fill="none" stroke-width="5" stroke-linecap="round"/>

            <!-- Bədən və köynək -->
            <path d="M-19 -81 Q-28 -77 -28 -64 L-24 -34
                     Q-4 -27 17 -34 L21 -64
                     Q20 -77 11 -81Z" fill="#5b91bd"/>
            <path d="M-18 -76 L-5 -62 L2 -76"
                  fill="none" stroke="#d8e9e9" stroke-width="3"/>
            <path d="M-23 -68 L-34 -45 L-25 -40 L-12 -61"
                  fill="#f1c49a"/>
            <path d="M17 -68 L28 -46 L21 -40 L9 -60"
                  fill="#f1c49a"/>

            <!-- Boyun -->
            <path d="M-8 -91 L-8 -79 L7 -79 L7 -92Z"
                  fill="#e9b78e"/>

            <!-- Qulaqlar və üz -->
            <ellipse cx="-22" cy="-111" rx="6" ry="10" fill="#e9b78e"/>
            <ellipse cx="22" cy="-111" rx="6" ry="10" fill="#e9b78e"/>
            <path d="M-24 -126 Q-24 -143 0 -144
                     Q24 -143 24 -125 L20 -104
                     Q16 -88 0 -87 Q-16 -88 -20 -104Z"
                  fill="#f1c49a"/>

            <!-- Saç -->
            <path d="M-24 -119 Q-33 -138 -17 -149
                     Q-7 -159 5 -152 Q23 -151 27 -135
                     L24 -116 L15 -128 L7 -135
                     L-5 -126 L-16 -130Z"
                  fill="#51392c"/>
            <path d="M-18 -144 Q-9 -151 0 -145"
                  fill="none" stroke="#87604a" stroke-width="3"/>

            <!-- Qaşlar, gözlər, burun, təbəssüm -->
            <path d="M-16 -118 Q-10 -123 -5 -118
                     M6 -118 Q12 -123 17 -118"
                  fill="none" stroke-width="3"/>
            <ellipse cx="-10" cy="-111" rx="3.2" ry="4.4" fill="#443126"/>
            <ellipse cx="11" cy="-111" rx="3.2" ry="4.4" fill="#443126"/>
            <circle cx="-9" cy="-113" r="1.2" fill="#fff4d9" stroke="none"/>
            <circle cx="12" cy="-113" r="1.2" fill="#fff4d9" stroke="none"/>
            <path d="M0 -109 L-2 -102 L3 -101"
                  fill="none" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M-8 -96 Q0 -90 9 -97"
                  fill="none" stroke-width="3" stroke-linecap="round"/>
            <ellipse cx="-17" cy="-101" rx="4" ry="2.5"
                     fill="#e98f7c" stroke="none" opacity=".8"/>
            <ellipse cx="17" cy="-101" rx="4" ry="2.5"
                     fill="#e98f7c" stroke="none" opacity=".8"/>

            <!-- Çiyin çantası -->
            <path d="M12 -77 Q24 -71 25 -53 L18 -43
                     L5 -49 L6 -65"
                  fill="#d49b56"/>
            <path d="M13 -75 Q5 -62 8 -50"
                  fill="none" stroke="#49372a" stroke-width="3"/>
        </g>`;
    }

    function money() {
        return `
        <g class="bc-floating" transform="translate(535 326) rotate(-9)">
            <ellipse cx="0" cy="17" rx="49" ry="10"
                     fill="#49372a" opacity=".18"/>
            <rect x="-45" y="-7" width="90" height="38" rx="5"
                  fill="#77b86c" stroke="#49372a" stroke-width="4"/>
            <rect x="-37" y="-1" width="74" height="26" rx="3"
                  fill="#b9dfa0" stroke="#4d804c" stroke-width="2.5"/>
            <circle cx="0" cy="12" r="12"
                    fill="#e5f1bf" stroke="#4d804c" stroke-width="2.5"/>
            <text x="0" y="17" font-size="12" font-weight="1000"
                  text-anchor="middle" fill="#355638"
                  stroke="none">50</text>
            <text x="-27" y="16" font-size="7" font-weight="1000"
                  fill="#355638" stroke="none">AZN</text>
            <text x="27" y="16" font-size="7" font-weight="1000"
                  fill="#355638" stroke="none">AZN</text>
        </g>
        <g stroke="#fff4d9" stroke-width="4" stroke-linecap="round">
            <path d="M535 289 V275 M526 282 L535 273 L544 282"/>
            <path d="M476 313 L468 308 M594 310 L603 304"/>
        </g>`;
    }

    function worldSvg() {
        const x = step === 0 ? 250 : step === 1 ? 365 : 445;
        const found = step >= 2 && !moneyTaken;

        return `
        <svg class="bc-art" viewBox="0 0 900 455"
             xmlns="http://www.w3.org/2000/svg"
             role="img" aria-label="Əl ilə çəkilmiş üslubda Bakı küçəsi">
            <defs>
                <linearGradient id="bc-sky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#8bd0e2"/>
                    <stop offset="100%" stop-color="#d5ebd9"/>
                </linearGradient>
                <linearGradient id="bc-road" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#929b8e"/>
                    <stop offset="100%" stop-color="#747f76"/>
                </linearGradient>
                <linearGradient id="bc-water" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#72bfcf"/>
                    <stop offset="100%" stop-color="#b6e0d9"/>
                </linearGradient>
                <pattern id="bc-road-speckle" width="41" height="35"
                         patternUnits="userSpaceOnUse">
                    <circle cx="7" cy="8" r="1.5" fill="#e4dfc6" opacity=".35"/>
                    <path d="M25 24 l8 -1" stroke="#e4dfc6"
                          stroke-width="1.5" opacity=".22"/>
                </pattern>
            </defs>

            <!-- Göy -->
            <rect width="900" height="455" fill="url(#bc-sky)"/>

            <!-- Günəş -->
            <g class="bc-floating" transform="translate(760 69)">
                <g stroke="#49372a" stroke-width="4" stroke-linecap="round">
                    <path d="M0 -49 V-61 M0 49 V61 M-49 0 H-61 M49 0 H61
                             M-35 -35 L-44 -44 M35 35 L44 44
                             M35 -35 L44 -44 M-35 35 L-44 44"/>
                </g>
                <circle r="33" fill="#ffdb78" stroke="#49372a" stroke-width="4"/>
                <path d="M-12 -5 Q-7 -11 -2 -5 M9 -5 Q14 -11 19 -5"
                      fill="none" stroke="#49372a" stroke-width="3"
                      stroke-linecap="round"/>
                <path d="M-8 10 Q3 21 15 9"
                      fill="none" stroke="#49372a" stroke-width="3"
                      stroke-linecap="round"/>
            </g>

            <!-- Buludlar -->
            <g class="bc-cloud" fill="#fff7e3" stroke="#49372a"
               stroke-width="3.5" stroke-linejoin="round">
                <path d="M72 80 Q57 61 77 50 Q92 27 113 47
                         Q132 29 151 49 Q176 45 179 65
                         Q181 81 161 83 H89 Q75 83 72 80Z"/>
                <path d="M289 51 Q278 39 293 29 Q308 9 326 29
                         Q344 15 359 31 Q379 30 381 46
                         Q382 58 366 60 H305 Q292 60 289 51Z"/>
            </g>

            <!-- Dəniz və uzaq sahil -->
            <path d="M0 218 Q100 202 205 217 T420 215
                     T650 216 T900 208 L900 284 L0 284Z"
                  fill="url(#bc-water)" stroke="#49372a" stroke-width="3"/>
            <path d="M0 240 Q115 230 230 241 T465 238
                     T700 241 T900 232"
                  fill="none" stroke="#e8f5dc" stroke-width="4"
                  stroke-linecap="round"/>
            <path d="M25 260 H87 M120 251 H155 M290 258 H344
                     M610 252 H663 M755 261 H809"
                  fill="none" stroke="#e8f5dc" stroke-width="3"
                  stroke-linecap="round" opacity=".8"/>

            <!-- Uzaq şəhər -->
            <path d="M0 236 L0 189 L36 189 L36 171 L49 171 L49 191
                     L74 191 L74 155 L89 155 L89 188 L116 188
                     L116 174 L139 174 L139 198 L173 198
                     L173 161 L188 161 L188 191 L217 191
                     L217 176 L237 176 L237 206 L270 206
                     L270 184 L287 184 L287 204 L317 204
                     L317 174 L334 174 L334 198 L370 198
                     L370 182 L390 182 L390 207 L424 207
                     L424 183 L443 183 L443 203 L478 203
                     L478 178 L496 178 L496 201 L533 201
                     L533 184 L553 184 L553 207 L590 207
                     L590 183 L609 183 L609 202 L647 202
                     L647 177 L665 177 L665 203 L701 203
                     L701 185 L720 185 L720 210 L760 210
                     L760 180 L777 180 L777 203 L809 203
                     L809 184 L828 184 L828 206 L861 206
                     L861 182 L879 182 L879 204 L900 204
                     L900 239Z"
                  fill="#d5c4a0" stroke="#49372a" stroke-width="3"/>

            ${flameTowers()}

            <!-- Sol bina -->
            ${buildingLeft()}

            <!-- Sağ bina -->
            ${buildingRight()}

            <!-- Küçük dükan və tent -->
            <g stroke="#49372a" stroke-width="3.5" stroke-linejoin="round">
                <path d="M704 250 H900 V292 H704Z" fill="#f9e6bd"/>
                <path d="M698 251 L710 227 H894 L906 251Z"
                      fill="#e7a07d"/>
                <path d="M710 227 L733 227 L741 251 L718 251Z"
                      fill="#fff0d0"/>
                <path d="M755 227 L778 227 L786 251 L763 251Z"
                      fill="#fff0d0"/>
                <path d="M800 227 L823 227 L831 251 L808 251Z"
                      fill="#fff0d0"/>
                <path d="M845 227 L868 227 L876 251 L853 251Z"
                      fill="#fff0d0"/>
                <rect x="734" y="264" width="44" height="28" fill="#8cc7d2"/>
                <rect x="790" y="264" width="44" height="28" fill="#8cc7d2"/>
                <rect x="847" y="263" width="31" height="29" fill="#a97552"/>
                <path d="M734 278 H778 M756 264 V292 M790 278 H834
                         M812 264 V292" fill="none" stroke-width="2.5"/>
            </g>

            <!-- Binaların eyvanları -->
            <g stroke="#49372a" stroke-width="3.5" stroke-linejoin="round">
                <path d="M16 151 L61 140 L61 160 L16 171Z" fill="#d18e6e"/>
                <path d="M15 151 L61 140 L61 147 L15 158Z" fill="#f8d0a6"/>
                <path d="M16 158 V170 M28 155 V167 M40 152 V164
                         M52 149 V161" fill="none" stroke-width="2.5"/>
                <path d="M742 151 L785 163 L785 183 L742 171Z"
                      fill="#dba85b"/>
                <path d="M742 151 L785 163 L785 170 L742 158Z"
                      fill="#ffe3a0"/>
                <path d="M748 160 V174 M760 163 V177 M772 166 V180"
                      fill="none" stroke-width="2.5"/>
            </g>

            <!-- Səkilər -->
            <path d="M0 292 L900 292 L900 329 L0 329Z"
                  fill="#dfbd8d" stroke="#49372a" stroke-width="4"/>
            <path d="M0 306 L900 306 M0 322 L900 322"
                  fill="none" stroke="#b9926c" stroke-width="2.5"/>
            <path d="M40 292 L40 329 M118 292 L118 329
                     M196 292 L196 329 M274 292 L274 329
                     M352 292 L352 329 M430 292 L430 329
                     M508 292 L508 329 M586 292 L586 329
                     M664 292 L664 329 M742 292 L742 329
                     M820 292 L820 329"
                  fill="none" stroke="#b9926c" stroke-width="2.5"/>

            <!-- Ağaclar -->
            ${tree(157, 291, .78)}
            ${tree(675, 292, .8)}

            <!-- Avtobus dayanacağı -->
            ${busStop()}

            <!-- Yol nişanı -->
            ${streetSign()}

            <!-- Küçə lampası -->
            <g stroke="#49372a" stroke-width="4" stroke-linejoin="round">
                <path d="M620 291 V184 Q620 168 637 168 H652"
                      fill="none" stroke-width="6"/>
                <path d="M634 168 Q632 151 649 151
                         Q666 151 664 168Z" fill="#ffdf7d"/>
                <path d="M639 168 H659" fill="none" stroke-width="3"/>
            </g>

            <!-- Yol -->
            <path d="M0 329 L900 329 L900 455 L0 455Z"
                  fill="url(#bc-road)" stroke="#49372a" stroke-width="4"/>
            <path d="M0 329 L900 329 L900 455 L0 455Z"
                  fill="url(#bc-road-speckle)"/>
            <path d="M0 344 H900" fill="none"
                  stroke="#e8d8b8" stroke-width="4"/>
            <path d="M0 425 H900" fill="none"
                  stroke="#e8d8b8" stroke-width="3" opacity=".7"/>

            <!-- Yol zolaqları -->
            <g fill="#f4e7c8" stroke="#49372a" stroke-width="2.5">
                <path d="M35 390 L108 390 L96 400 L23 400Z"/>
                <path d="M162 390 L235 390 L223 400 L150 400Z"/>
                <path d="M289 390 L362 390 L350 400 L277 400Z"/>
                <path d="M416 390 L489 390 L477 400 L404 400Z"/>
                <path d="M543 390 L616 390 L604 400 L531 400Z"/>
                <path d="M670 390 L743 390 L731 400 L658 400Z"/>
                <path d="M797 390 L870 390 L858 400 L785 400Z"/>
            </g>

            <!-- Maşın -->
            ${car(118, 369, "#e5a06f", .88)}

            <!-- Küçük skuter -->
            <g transform="translate(747 354)" stroke="#49372a"
               stroke-width="3.5" stroke-linejoin="round">
                <circle cx="-12" cy="15" r="8" fill="#50463c"/>
                <circle cx="23" cy="15" r="8" fill="#50463c"/>
                <path d="M-12 15 L-1 -2 L12 15 H23"
                      fill="none" stroke-width="5"/>
                <path d="M-1 -2 H13 L20 5 H5"
                      fill="none" stroke="#e7a05b" stroke-width="5"/>
                <path d="M-3 -5 L-8 -15 M-8 -15 H1"
                      fill="none" stroke-width="4" stroke-linecap="round"/>
            </g>

            <!-- Pul -->
            ${found ? money() : ""}

            <!-- Personaj -->
            <ellipse cx="${x}" cy="354" rx="35" ry="10"
                     fill="#49372a" opacity=".2"/>
            ${character(x, 354)}

            <!-- Əl ilə çəkilmiş dekorativ parıltılar -->
            <g fill="none" stroke="#fff4d9" stroke-width="4"
               stroke-linecap="round">
                <path d="M344 270 L344 280 M339 275 H349"/>
                <path d="M575 243 L575 251 M571 247 H579"/>
                <path d="M843 315 L843 325 M838 320 H848"/>
            </g>

            <!-- Ön planda kiçik çiçəklər -->
            <g stroke="#49372a" stroke-width="2.5">
                <path d="M51 330 V316" fill="none" stroke-width="3"/>
                <circle cx="51" cy="313" r="4" fill="#f4a28a"/>
                <circle cx="46" cy="315" r="3.5" fill="#f4a28a"/>
                <circle cx="56" cy="315" r="3.5" fill="#f4a28a"/>
                <circle cx="51" cy="318" r="3.5" fill="#ffd66e"/>
                <path d="M841 330 V317" fill="none" stroke-width="3"/>
                <circle cx="841" cy="314" r="4" fill="#f4a28a"/>
                <circle cx="836" cy="316" r="3.5" fill="#f4a28a"/>
                <circle cx="846" cy="316" r="3.5" fill="#f4a28a"/>
                <circle cx="841" cy="319" r="3.5" fill="#ffd66e"/>
            </g>
        </svg>`;
    }

    function content() {
        const placeNames = [
            "Bakı küçəsi",
            "Küçə döngəsi",
            "50 AZN tapıntısı"
        ];

        let title = placeNames[Math.min(step, 2)];
        let message = "";
        let avatar = "🙂";
        let speaker = "SƏNİN HEKAYƏN";
        let actions = "";
        let moneyCard = "";

        if (state === "walking") {
            if (step === 0) {
                message = "Bakı küçələrində gəzirsən. Günəş parlayır, şəhər öz adi həyatı ilə yaşayır. İrəli gedək!";
                actions = `
                    <button class="bc-btn primary wide" data-action="next">
                        👟 İrəli get
                    </button>`;
            } else if (step === 1) {
                message = "Bir az da irəliləyirsən. Səkidə qəribə bir şey diqqətini çəkir. Görəsən, nədir?";
                actions = `
                    <button class="bc-btn primary wide" data-action="next">
                        👀 Yaxınlaş
                    </button>`;
            } else {
                title = "Yerdə pul var!";
                avatar = "😮";
                speaker = "GÖZLƏNİLMƏZ HADİSƏ";
                message = "Dayan! Yerdə 50 AZN tapmısan. Ətrafda pulun sahibini görmürsən. İndi qərar verməlisən.";
                moneyCard = `
                    <div class="bc-money-card">
                        <div class="bc-money-icon">₼</div>
                        <div>
                            <div class="bc-money-title">50 AZN TAPILDI!</div>
                            <div class="bc-money-caption">Bu seçim hekayənin gedişini dəyişəcək.</div>
                        </div>
                    </div>`;
                actions = `
                    <button class="bc-btn primary" data-action="take">
                        💵 Pulu götür
                    </button>
                    <button class="bc-btn danger" data-action="leave">
                        ✋ Pula toxunma
                    </button>`;
            }
        } else if (state === "playing") {
            title = "Yeni başlanğıc";
            avatar = "😎";
            speaker = "SƏNİN SEÇİMİN";
            message = "50 AZN-i götürdün! Bu, Bakı Simulator hekayənin başlanğıcıdır. İndi yeni həyatına doğru ilk addımı atırsan.";
            moneyCard = `
                <div class="bc-money-card">
                    <div class="bc-money-icon">₼</div>
                    <div>
                        <div class="bc-money-title">BALANS: 50 AZN</div>
                        <div class="bc-money-caption">İlk pulun hekayəndə qeydə alındı.</div>
                    </div>
                </div>`;
            actions = `
                <button class="bc-btn primary" data-action="continue">
                    🚶 Hekayəyə davam et
                </button>
                <button class="bc-btn" data-action="menu">
                    🏠 Əsas menyu
                </button>`;
        } else if (state === "continued") {
            title = "Hekayə davam edir";
            avatar = "🙂";
            speaker = "BAKI SIMULATOR";
            message = "Şəhərdə səni yeni hadisələr, insanlarla görüşlər və qərarlar gözləyir. Bu versiyada növbəti mərhələlər hələ hazırlanmayıb.";
            moneyCard = `
                <div class="bc-money-card">
                    <div class="bc-money-icon">✓</div>
                    <div>
                        <div class="bc-money-title">İLK MƏRHƏLƏ TAMAMLANDI</div>
                        <div class="bc-money-caption">Başlanğıc hekayəsini keçdin.</div>
                    </div>
                </div>`;
            actions = `
                <button class="bc-btn primary wide" data-action="menu">
                    🏠 Əsas menyuya qayıt
                </button>`;
        } else if (state === "gameover") {
            title = "Hekayə bitdi";
            avatar = "😕";
            speaker = "SON";
            message = "Pula toxunmamağı seçdin və hekayən burada bitdi. İstəsən, yenidən başlayıb başqa seçim edə bilərsən.";
            actions = `
                <button class="bc-btn primary" data-action="restart">
                    ↻ Yenidən başla
                </button>
                <button class="bc-btn" data-action="menu">
                    🏠 Əsas menyu
                </button>`;
        }

        const dots = [0, 1, 2].map(i =>
            `<span class="bc-dot ${i <= step ? "active" : ""}"></span>`
        ).join("");

        return `
            <div class="bc-shell">
                <header class="bc-top">
                    <div class="bc-brand-row">
                        <div class="bc-brand-icon">🏙️</div>
                        <div>
                            <div class="bc-brand">BAKI SIMULATOR 2D</div>
                            <div class="bc-subtitle">SƏNİN ŞƏHƏRİN. SƏNİN HEKAYƏN.</div>
                        </div>
                    </div>
                    <button class="bc-exit" data-action="menu">✕ Çıx</button>
                </header>

                <section class="bc-world">
                    ${worldSvg()}
                    <div class="bc-location">📍 ${title}</div>
                    <div class="bc-progress">
                        ADDIM ${Math.min(step + 1, 3)} / 3
                        <div class="bc-progress-dots">${dots}</div>
                    </div>
                </section>

                <section class="bc-bottom">
                    <div class="bc-dialogue">
                        <div class="bc-avatar">${avatar}</div>
                        <div class="bc-speech-wrap">
                            <div class="bc-speaker">${speaker}</div>
                            <div class="bc-speech">${message}</div>
                        </div>
                    </div>
                    ${moneyCard}
                    <div class="bc-actions">${actions}</div>
                    <footer class="bc-footer">
                        <span class="bc-footer-note">✦ BAKI, AZƏRBAYCAN</span>
                        <span class="bc-footer-note">HƏR SEÇİMİN BİR NƏTİCƏSİ VAR</span>
                    </footer>
                </section>
            </div>`;
    }

    function render() {
        if (!root) return;
        root.innerHTML = content();

        root.querySelectorAll("[data-action]").forEach(button => {
            button.addEventListener("click", () => {
                handleAction(button.dataset.action);
            });
        });
    }

    function handleAction(action) {
        switch (action) {
            case "next":
                if (state === "walking" && step < 2) {
                    step++;
                    render();
                }
                break;

            case "take":
                if (state === "walking" && step >= 2) {
                    moneyTaken = true;
                    state = "playing";
                    render();
                }
                break;

            case "leave":
                if (state === "walking" && step >= 2) {
                    state = "gameover";
                    render();
                }
                break;

            case "continue":
                state = "continued";
                render();
                break;

            case "restart":
                step = 0;
                state = "walking";
                moneyTaken = false;
                render();
                break;

            case "menu":
                exit();
                break;
        }
    }

    function exit() {
        if (animationFrame !== null) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }

        if (root) {
            root.remove();
            root = null;
        }

        document.body.style.overflow = "";

        const callback = onExit;
        onExit = null;

        if (typeof callback === "function") {
            callback();
        }
    }

    window.BeggarScene = {
        start(options = {}) {
            this.stop();

            onExit = typeof options.onExit === "function"
                ? options.onExit
                : null;

            step = 0;
            state = "walking";
            moneyTaken = false;

            installStyles();

            root = document.createElement("div");
            root.id = "beggar-cartoon-scene";
            document.body.appendChild(root);
            document.body.style.overflow = "hidden";

            render();
        },

        stop() {
            if (animationFrame !== null) {
                cancelAnimationFrame(animationFrame);
                animationFrame = null;
            }

            if (root) {
                root.remove();
                root = null;
            }

            document.body.style.overflow = "";
        }
    };
})();
