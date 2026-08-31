// Setting up the beginning of the quiz.

let pokemonData = [];
let currentStep = 0;
let currentPokemon = null;
let mainType = "";
let secondTypes = [];
let firstPlaceTypes = [];

// These get locked in the moment the quiz ends.

let primaryPokemon = null;
let alternatePokemons = [];

// Larvitar doesn't need to be in the other file tbh.

const LARVITAR = {
    name: "Larvitar (RARE)",
    type: ["Rock", "Ground"],
    ability: ["Guts"],
    hidden_ability: "Sand Veil"
};

// Set link. Since Discord invite links expire, this will need to be updates.

const DISCORD_URL = "https://discord.gg/mzwkwDdkW";

// Change this if you want different music.

const bgm = new Audio('bgm.mp3');
bgm.loop = true;

// Volume settings.

const savedVolume = parseFloat(localStorage.getItem("bgm_volume"));
bgm.volume = isNaN(savedVolume) ? 0.5 : savedVolume;

// Linking this document to the Pokemon list.

fetch('masterlist.json')
    .then(response => response.json())
    .then(data => {
        pokemonData = data;
        console.log("Masterlist loaded:", pokemonData);
    })
    .catch(err => console.error("Fetch error:", err));

// Questions go here.

const typeQuestions = [
    {
        question: "What is your primary driving force?",
        options: [
            { text: "Passion (action, energy, and moving forward)", typeWeight: { Fighting: 3, Fire: 2, Electric: 1 } },
            { text: "Logic (planning, analyzing, and self-preservation)", typeWeight: { Psychic: 3, Ice: 2, Normal: 1 } },
            { text: "Harmony (connection, nature, and peace)", typeWeight: { Grass: 3, Water: 2, Bug: 1 } },
            { text: "Knowledge (the pursuit, curiosity, and mystery)", typeWeight: { Flying: 3, Bug: 2, Ghost: 1 } }
        ]
    },
    {
        question: "How do you naturally express that force?",
        options: [
            { text: "Explosively (fast, intense, and loud)", typeWeight: { Fire: 3, Electric: 2, Fighting: 1 } },
            { text: "Quietly (subtle, independent, and internal)", typeWeight: { Ghost: 3, Dark: 2, Poison: 1 } },
            { text: "Adaptably (flowing, changing, and open-minded)", typeWeight: { Water: 3, Rock: 2, Normal: 1 } },
            { text: "Sturdily (resilient, unyielding, and protective)", typeWeight: { Rock: 3, Ground: 2, Ice: 1 } }
        ]
    },
    {
        question: "If your soul had a physical texture, what would it feel like?",
        options: [
            { text: "A crackling, warm, restless flame", typeWeight: { Fire: 3, Poison: 2, Normal: 1 } },
            { text: "A cool, sharp, brilliant crystal shard", typeWeight: { Ice: 3, Rock: 2, Ground: 1 } },
            { text: "A soft, ever-shifting morning breeze", typeWeight: { Flying: 3, Ghost: 2, Bug: 1 } },
            { text: "A deep, quiet, endless starry night sky", typeWeight: { Dark: 3, Ghost: 2, Poison: 1 } }
        ]
    },
    {
        question: "What do you fear losing the most?",
        options: [
            { text: "Your purpose. To have nothing worth fighting for", typeWeight: { Normal: 3, Ground: 2, Fire: 1 } },
            { text: "Your freedom. To be trapped by duty or expectation", typeWeight: { Electric: 3, Flying: 2, Fire: 1 } },
            { text: "Your connections. To stand alone when it matters most", typeWeight: { Grass: 3, Bug: 2, Dark: 1 } },
            { text: "Your identity. To become someone you no longer recognize", typeWeight: { Poison: 3, Psychic: 2, Normal: 1 } },
            { text: "Your curiosity. To believe there is nothing left to discover", typeWeight: { Water: 3, Fighting: 2, Fire: 1 } }
        ]
    },
    {
        question: "If you could command one domain, which would you claim?",
        options: [
            { text: "The Wild Inferno", typeWeight: { Fire: 3, Dark: 2, Electric: 1 } },
            { text: "The Abyssal Depths", typeWeight: { Water: 3, Ghost: 2, Poison: 1 } },
            { text: "The Open Skies", typeWeight: { Flying: 3, Electric: 2, Psychic: 1 } },
            { text: "The Living Earth", typeWeight: { Ground: 3, Rock: 2, Grass: 1 } },
            { text: "The Primal Beasts", typeWeight: { Bug: 3, Normal: 2, Ice: 1 } }
        ]
    },
    {
        question: "When it is time to make your move, how do you strike?",
        options: [
            { text: "With Overwhelming Force: no room for doubt", typeWeight: { Fighting: 3, Rock: 2, Ground: 1 } },
            { text: "With Calculated Precision: striking true", typeWeight: { Ice: 3, Psychic: 2, Electric: 1 } },
            { text: "With Fluid Versatility: adapting to the challenge", typeWeight: { Normal: 3, Bug: 2, Water: 1 } }
        ]
    },
    {
        question: "You are about to enter the arena along with an ally. Which would you take with you?",
        options: [
            { text: "An impenetrable shield", typeWeight: { Ground: 3, Normal: 2, Rock: 1 } },
            { text: "An unstoppable spear", typeWeight: { Fighting: 3, Bug: 2, Flying: 1 } },
            { text: "An infallible bow and an endless quiver", typeWeight: { Grass: 3, Electric: 2, Water: 1 } },
            { text: "An elemental orb", typeWeight: { Psychic: 3, Poison: 2, Water: 1 } },
            { text: "A loyal battle beast", typeWeight: { Dark: 3, Fire: 2, Ghost: 1 } }
        ]
    },
    {
        question: "You are walking through an ancient, forgotten library. Which naturally draws your attention first?",
        options: [
            { text: "A heavy, iron-bound tome", typeWeight: { Normal: 3, Rock: 2, Ground: 1 } },
            { text: "A dusty leather ledger with scraps sticking out", typeWeight: { Flying: 3, Electric: 2, Fire: 1 } },
            { text: "A fragile, beautifully illustrated diary", typeWeight: { Psychic: 3, Ghost: 2, Dark: 1 } },
            { text: "A pitch-black gold-embossed hardcover", typeWeight: { Ice: 3, Fighting: 2, Ground: 1 } },
            { text: "A water-stained scroll sealed with blue wax", typeWeight: { Grass: 3, Poison: 2, Bug: 1 } }
        ]
    },
    {
        question: "If you could choose where your final battle would take place, where would it be?",
        options: [
            { text: "A crumbling stone bridge over a sea of magma", typeWeight: { Rock: 3, Ground: 2, Ghost: 1 } },
            { text: "The eye of a roaring, debris-filled hurricane", typeWeight: { Electric: 3, Water: 2, Flying: 1 } },
            { text: "A mirror-like frozen lake under a brilliant starry sky", typeWeight: { Poison: 3, Grass: 2, Ice: 1 } },
            { text: "A misty mountain peak untouched by the world", typeWeight: { Flying: 3, Ice: 2, Rock: 1 } },
            { text: "The grand, silent throne room of a ruined palace", typeWeight: { Ghost: 3, Dark: 2, Psychic: 1 } }
        ]
    },
    {
        question: "Soon, you will join the world of Pokémon. If you could bring one thing from your former life, what would it be?",
        options: [
            { text: "Entertainment, like a good book", typeWeight: { Bug: 3, Electric: 2, Normal: 1 } },
            { text: "Something practical, like a compass", typeWeight: { Ground: 3, Rock: 2, Normal: 1 } },
            { text: "Delicious food", typeWeight: { Grass: 3, Water: 2, Poison: 1 } },
            { text: "My best friend", typeWeight: { Fighting: 3, Poison: 2, Water: 1 } },
            { text: "A secret treasure", typeWeight: { Dark: 3, Ice: 2, Rock: 1 } }
        ]
    }
];

let typeScores = {
    Fighting: 0, Fire: 0, Electric: 0, Psychic: 0, Ice: 0, Normal: 0,
    Grass: 0, Water: 0, Bug: 0, Flying: 0, Ghost: 0, Dark: 0,
    Poison: 0, Rock: 0, Ground: 0
};

// Intro

const introLines = [
    "Where... are you? A gentle, warm light begins to filter through the dark...",
    "A faint voice echoes from somewhere far away.",
    "It asks you to look inward, to the rhythm of your own spirit.",
    "\"Answer each question truthfully. Be open. Be honest.\"",
    "\"Do not overthink your answers. Instinct reveals far more than careful thought ever could.\"",
    "Echoes of choices and paths begin to swirl through your thoughts...",
    "\"Close your eyes, heed the call, and uncover your true nature.\""
];
 
let introStep = 0;
 
function renderIntro() {
    const optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = "";
 
    const line = introLines[introStep];
 
    typeWriter(line, () => {
        const continueBtn = document.createElement("button");
        continueBtn.innerText = introStep < introLines.length - 1 ? "..." : "Begin";
        continueBtn.className = "intro-continue";
        continueBtn.onclick = () => {
            introStep++;
            if (introStep < introLines.length) {
                renderIntro();
            } else {
                renderQuestion();
            }
        };
        optionsContainer.appendChild(continueBtn);
    });
}

// This code lets the questions work properly.

function renderQuestion() {
    const textElement = document.getElementById("quiz-text");
    const optionsContainer = document.getElementById("options-container");

    optionsContainer.innerHTML = "";
    textElement.innerText = "";

    const data = typeQuestions[currentStep];

    typeWriter(data.question, () => {
        data.options.forEach(opt => {
            const btn = document.createElement("button");
            btn.innerText = opt.text;
            btn.onclick = () => selectOption(opt);
            optionsContainer.appendChild(btn);
        });
    });
}

function typeWriter(text, callback) {
    let i = 0;
    const textElement = document.getElementById("quiz-text");
    let typingTimeout;
    let isTyping = true;

    if (textElement) textElement.innerHTML = "";

    const handleGlobalClick = (e) => {
        if (e.target.tagName === 'BUTTON') return;
        if (isTyping) {
            clearTimeout(typingTimeout);
            textElement.innerHTML = text;
            finishTyping();
        }
    };

    window.addEventListener("click", handleGlobalClick);

    function finishTyping() {
        isTyping = false;
        window.removeEventListener("click", handleGlobalClick);
        setTimeout(() => {
            if (callback) callback();
        }, 150);
    }

    function type() {
        if (i < text.length) {
            textElement.innerHTML += text.charAt(i);
            i++;
            typingTimeout = setTimeout(type, 25);
        } else if (isTyping) {
            finishTyping();
        }
    }

    type();
}

function selectOption(opt) {
    for (let type in opt.typeWeight) {
        typeScores[type] += opt.typeWeight[type];
    }

    currentStep++;

    if (currentStep < typeQuestions.length) {
        renderQuestion();
    } else {
        calculateFinalResult();
    }
}

// Scoring

function calculateFinalResult() {
    const sortedTypes = Object.keys(typeScores).sort((a, b) => typeScores[b] - typeScores[a]);

    const topScore = typeScores[sortedTypes[0]];
    firstPlaceTypes = sortedTypes.filter(t => typeScores[t] === topScore);

    if (firstPlaceTypes.length > 1) {
        mainType = firstPlaceTypes[Math.floor(Math.random() * firstPlaceTypes.length)];
        secondTypes = firstPlaceTypes.filter(t => t !== mainType);
    } else {
        mainType = sortedTypes[0];
        const secondScore = typeScores[sortedTypes.find(t => typeScores[t] < topScore)] || 0;
        secondTypes = sortedTypes.filter(t => typeScores[t] === secondScore);
    }
    generateResultSet();
}

function getRandomAbility(pokemon) {
    const pool = [...pokemon.ability];
    if (pokemon.hidden_ability) pool.push(pokemon.hidden_ability);
    return pool[Math.floor(Math.random() * pool.length)];
}

function getPokemonByType(type, excludeNames = []) {
    if (!pokemonData || !pokemonData.pokemon_entries) return [];
    return pokemonData.pokemon_entries.filter(p =>
        p.type.includes(type) && !excludeNames.includes(p.name)
    );
}

function pickRandomUnique(pool, count) {
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function isLarvitarEligible() {
    return firstPlaceTypes.includes("Ground") && firstPlaceTypes.includes("Rock");
}
 
function getMainPool(excludeNames = []) {
    let pool = getPokemonByType(mainType, excludeNames);
    if (isLarvitarEligible() && !excludeNames.includes(LARVITAR.name)) {
        pool = [...pool, LARVITAR];
    }
    return pool;
}
 
function generateResultSet() {
    const mainPool = getMainPool();
 
    if (mainPool.length === 0) {
        console.error("No Pokémon found for type " + mainType);
        return;
    }

const primaryChosen = mainPool[Math.floor(Math.random() * mainPool.length)];
    primaryPokemon = {
        name: primaryChosen.name,
        type: primaryChosen.type,
        ability: getRandomAbility(primaryChosen)
    };

    const usedNames = [primaryPokemon.name];
const isTie = firstPlaceTypes.length > 1;
    const mainAltCount = isTie ? 3 : 4;
    const secondAltCount = isTie ? 3 : 2;
    const mainAltPool = getMainPool(usedNames);
    const mainAltPicks = pickRandomUnique(mainAltPool, mainAltCount);
    usedNames.push(...mainAltPicks.map(p => p.name));

    let secondAltPicks = [];
    if (secondTypes.length > 0) {
        const slots = secondAltCount;
        const perType = Math.floor(slots / secondTypes.length);
        const remainder = slots % secondTypes.length;
        const orderedTypes = [...secondTypes].sort(() => 0.5 - Math.random());

        orderedTypes.forEach((t, idx) => {
            const count = perType + (idx < remainder ? 1 : 0);
            if (count > 0) {
                const pool = getPokemonByType(t, usedNames);
                const picks = pickRandomUnique(pool, count);
                secondAltPicks.push(...picks);
                usedNames.push(...picks.map(p => p.name));
            }
        });
    }

    alternatePokemons = [...mainAltPicks, ...secondAltPicks].map(p => ({
        name: p.name,
        type: p.type,
        ability: getRandomAbility(p)
    }));

    currentPokemon = primaryPokemon;
    saveQuizState(false);
    displayFinalReveal(currentPokemon);
}

function displayFinalReveal(pokemon) {
    const optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = "";

    const message = `Your Pokémon is ${pokemon.name}! (${pokemon.type.join(" / ")}) — Ability: ${pokemon.ability}`;

    typeWriter(message, () => {
        const yesBtn = document.createElement("button");
        yesBtn.innerText = "I'm happy with this!";
        yesBtn.onclick = () => {
            saveQuizState(true);
            showResultsPage(currentPokemon);
        };
        optionsContainer.appendChild(yesBtn);

        const noBtn = document.createElement("button");
        noBtn.innerText = "Show me other options";
        noBtn.onclick = () => showAlternatives();
        optionsContainer.appendChild(noBtn);
    });
}

// Six alternatives: Four from the main type, two from second place.

function showAlternatives() {
    const optionsContainer = document.getElementById("options-container");

    optionsContainer.innerHTML = "";
    typeWriter("Here are a few other Pokémon that might fit you better:", () => {
        alternatePokemons
            .filter(alt => alt.name !== currentPokemon.name)
            .forEach(alt => {
                const btn = document.createElement("button");
                btn.innerText = alt.name;
                btn.onclick = () => {
                    currentPokemon = alt;
                    saveQuizState(false);
                    displayFinalReveal(currentPokemon);
                };
                optionsContainer.appendChild(btn);
            });

        if (currentPokemon.name !== primaryPokemon.name) {
            const backBtn = document.createElement("button");
            backBtn.innerText = `Go back to my original pick: ${primaryPokemon.name}`;
            backBtn.className = "back-button";
            backBtn.onclick = () => {
                currentPokemon = primaryPokemon;
                saveQuizState(false);
                displayFinalReveal(currentPokemon);
            };
            optionsContainer.appendChild(backBtn);
        }
    });
}

function copyToClipboard(text, button) {
    const onSuccess = () => {
        button.innerText = "Saved to Clipboard!";
    };
    const onFailure = () => {
        fallbackCopy(text, button);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(onSuccess).catch(onFailure);
    } else {
        fallbackCopy(text, button);
    }
}

function fallbackCopy(text, button) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    let succeeded = false;
    try {
        succeeded = document.execCommand("copy");
    } catch (err) {
        succeeded = false;
    }
    document.body.removeChild(textarea);

    button.innerText = succeeded
        ? "Saved to Clipboard!"
        : "Copy failed — select & copy manually";
}

// Results.

function showResultsPage(pokemon) {
    const textElement = document.getElementById("quiz-text");
    const optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = "";
 
    const isOriginal = primaryPokemon && pokemon.name === primaryPokemon.name;
    const soulShapeName = pokemon.name + (isOriginal ? "*" : "");
 
    const summary = `
        [Quiz Result]
        Soul Shape: ${soulShapeName}
        Ability: ${pokemon.ability}
        Anima Affinity: ${mainType}
    `;

    textElement.innerText = "Your result has been recorded! Please save a screenshot of your result.";

    const resultBox = document.createElement("div");
    resultBox.className = "result-box";
    resultBox.style.whiteSpace = "pre-line";
    resultBox.innerText = summary.trim();
    optionsContainer.appendChild(resultBox);

    const copyBtn = document.createElement("button");
    copyBtn.innerText = "Copy Result";
    copyBtn.onclick = () => copyToClipboard(summary, copyBtn);
    optionsContainer.appendChild(copyBtn);
	
	const discordBtn = document.createElement("button");
    discordBtn.innerText = "Join the Discord";
    discordBtn.className = "discord-button";
    discordBtn.onclick = () => {
        window.open(DISCORD_URL, "_blank");
    };
    optionsContainer.appendChild(discordBtn);
}

// Results lock in when someone finishes the quiz, not when they pick a Pokemon.

function saveQuizState(accepted) {
    const state = {
        mainType: mainType,
        secondTypes: secondTypes,
        firstPlaceTypes: firstPlaceTypes, // Save it
        typeScores: typeScores,
        primary: primaryPokemon,
        alternates: alternatePokemons,
        current: currentPokemon,
        accepted: accepted
    };
    localStorage.setItem("quiz_state", JSON.stringify(state));
}

function loadQuizState() {
    const raw = localStorage.getItem("quiz_state");
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch (err) {
        console.error("Couldn't read saved quiz state:", err);
        return null;
    }
}

function clearAndReload() {
    localStorage.removeItem("quiz_state");
    localStorage.removeItem("debug_panel_open");
    location.reload();
}

// Reset button. Delete if you don't want rerolling.

function addResetControl() {
    const resetLink = document.createElement("button");
    resetLink.innerText = "Reset Results";
    resetLink.id = "reset-control";
    resetLink.style.position = "fixed";
    resetLink.style.bottom = "10px";
    resetLink.style.right = "10px";
    resetLink.style.opacity = "0.6";
    resetLink.style.fontSize = "0.75em";
    resetLink.style.padding = "4px 8px";
    resetLink.style.zIndex = "1000";
    resetLink.onclick = () => {
        if (confirm("Clear your saved result and start the quiz over?")) {
            clearAndReload();
        }
    };
    document.body.appendChild(resetLink);
}

// Volume.

function addVolumeControl() {
    const wrapper = document.createElement("div");
    wrapper.id = "volume-control";
    wrapper.style.position = "fixed";
    wrapper.style.top = "10px";
    wrapper.style.right = "10px";
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.gap = "6px";
    wrapper.style.zIndex = "1000";
 
    const icon = document.createElement("button");
    icon.id = "volume-icon";
    icon.style.opacity = "1";
    icon.style.fontSize = "0.75em";
    icon.style.padding = "4px 8px";
    icon.style.cursor = "pointer";
 
    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = "0";
    slider.max = "1";
    slider.step = "0.01";
    slider.value = bgm.volume;
    slider.id = "volume-slider";
    slider.style.width = "80px";
    slider.style.cursor = "pointer";
    slider.style.display = "none";
    slider.style.opacity = "0.8";
 
    const setIcon = () => {
        icon.innerText = bgm.volume == 0 ? "🔇" : "🔊";
    };
    setIcon();
 
    const showSlider = () => { slider.style.display = "inline-block"; };
    const hideSlider = () => { slider.style.display = "none"; };
    wrapper.addEventListener("mouseenter", showSlider);
    wrapper.addEventListener("mouseleave", hideSlider);
    icon.onclick = () => {
        slider.style.display = slider.style.display === "none" ? "inline-block" : "none";
    };
 
    slider.oninput = () => {
        const value = parseFloat(slider.value);
        bgm.volume = value;
        localStorage.setItem("bgm_volume", value);
        setIcon();
    };
 
    wrapper.appendChild(icon);
    wrapper.appendChild(slider);
    document.body.appendChild(wrapper);
}

// Debug

function addDebugControl() {
    const debugBtn = document.createElement("button");
    debugBtn.innerText = "Debug";
    debugBtn.id = "debug-control";
    debugBtn.style.position = "fixed";
    debugBtn.style.bottom = "10px";
    debugBtn.style.left = "10px";
    debugBtn.style.opacity = "0.6";
    debugBtn.style.fontSize = "0.75em";
    debugBtn.style.padding = "4px 8px";
    debugBtn.style.zIndex = "1000";
 
    const debugPanel = document.createElement("pre");
    debugPanel.id = "debug-panel";
    debugPanel.style.position = "fixed";
    debugPanel.style.bottom = "40px";
    debugPanel.style.left = "10px";
    debugPanel.style.background = "rgba(0, 0, 0, 0.85)";
    debugPanel.style.color = "#0f0";
    debugPanel.style.padding = "8px 12px";
    debugPanel.style.fontSize = "0.75em";
    debugPanel.style.borderRadius = "4px";
    debugPanel.style.zIndex = "1000";
    debugPanel.style.display = "none";
    debugPanel.style.whiteSpace = "pre";
 
    debugBtn.onclick = () => {
        const isOpen = debugPanel.style.display !== "none";
        debugPanel.style.display = isOpen ? "none" : "block";
        localStorage.setItem("debug_panel_open", debugPanel.style.display === "block" ? "true" : "false");
        updateDebugPanel();
    };

    document.body.appendChild(debugPanel);
    document.body.appendChild(debugBtn);

    if (localStorage.getItem("debug_panel_open") === "true") {
        debugPanel.style.display = "block";
        updateDebugPanel();
    }
}
 
function updateDebugPanel() {
    const debugPanel = document.getElementById("debug-panel");
    if (!debugPanel || debugPanel.style.display === "none") return;
 
    const sorted = Object.keys(typeScores).sort((a, b) => typeScores[b] - typeScores[a]);
    const lines = sorted.map(t => `${t}: ${typeScores[t]}`);
 
    let output = "Type Scores\n" + lines.join("\n");
    if (mainType) {
        output += `\n\nMain type: ${mainType}`;
        output += `\nSecond type(s): ${secondTypes.join(", ") || "(none)"}`;
    }
 
    debugPanel.innerText = output;
}

// This is stuff on load in.

let goomyClickCount = 0;
let goomyClickTimer = null;

const GOOMY_HITBOX = {
    left: 0.2756,
    right: 0.3088,
    top: 0.7198,
    bottom: 0.8100,
    imageNaturalWidth: 8000,
    imageNaturalHeight: 4494
};
 
function positionGoomyTrigger() {
    const trigger = document.getElementById("secret-trigger");
    if (!trigger) return;
 
    const viewW = window.innerWidth;
    const viewH = window.innerHeight;
    const imgW = GOOMY_HITBOX.imageNaturalWidth;
    const imgH = GOOMY_HITBOX.imageNaturalHeight;
	
	
    const scale = Math.max(viewW / imgW, viewH / imgH);
    const renderedW = imgW * scale;
    const renderedH = imgH * scale;
    const offsetX = (viewW - renderedW) / 2;
    const offsetY = (viewH - renderedH) / 2;
 
    const left = offsetX + GOOMY_HITBOX.left * renderedW;
    const right = offsetX + GOOMY_HITBOX.right * renderedW;
    const top = offsetY + GOOMY_HITBOX.top * renderedH;
    const bottom = offsetY + GOOMY_HITBOX.bottom * renderedH;
 
    trigger.style.left = left + "px";
    trigger.style.top = top + "px";
    trigger.style.width = (right - left) + "px";
    trigger.style.height = (bottom - top) + "px";
}
 
function addSecretUnlock() {
    const trigger = document.createElement("div");
    trigger.id = "secret-trigger";
    trigger.style.position = "fixed";
    trigger.style.cursor = "default";
    trigger.style.background = "transparent";
    trigger.style.zIndex = "998";
 
    trigger.onclick = () => {
        goomyClickCount++;
        clearTimeout(goomyClickTimer);
        goomyClickTimer = setTimeout(() => { goomyClickCount = 0; }, 1500);
 
        if (goomyClickCount >= 3) {
            goomyClickCount = 0;
            const isUnlocked = localStorage.getItem("tester_controls_unlocked") === "true";
            setTesterControlsVisible(!isUnlocked);
        }
    };
 
    document.body.appendChild(trigger);
    positionGoomyTrigger();
    window.addEventListener("resize", positionGoomyTrigger);
}
 
function setTesterControlsVisible(visible) {
    localStorage.setItem("tester_controls_unlocked", visible ? "true" : "false");
 
    const reset = document.getElementById("reset-control");
    const debug = document.getElementById("debug-control");
    if (reset) reset.style.display = visible ? "inline-block" : "none";
    if (debug) debug.style.display = visible ? "inline-block" : "none";
 
    if (!visible) {
        const panel = document.getElementById("debug-panel");
        if (panel) panel.style.display = "none";
    }
}

window.onload = () => {
    bgm.play().catch(() => console.log("Autoplay blocked. Music will start on next click."));
    document.body.addEventListener('click', () => {
        if (bgm.paused) bgm.play();
    }, { once: true });
 
    addResetControl();
	addVolumeControl();
    addDebugControl();
	addSecretUnlock();
    setTesterControlsVisible(localStorage.getItem("tester_controls_unlocked") === "true");
 
    const saved = loadQuizState();
 
    if (saved) {
        mainType = saved.mainType;
        secondTypes = saved.secondTypes;
		firstPlaceTypes = saved.firstPlaceTypes || [];
        if (saved.typeScores) typeScores = saved.typeScores;
        primaryPokemon = saved.primary;
        alternatePokemons = saved.alternates;
        currentPokemon = saved.current;
 
        updateDebugPanel();
 
        if (saved.accepted) {
            showResultsPage(currentPokemon);
        } else {
            displayFinalReveal(currentPokemon);
        }
    } else {
        renderIntro();
    }
};
 
