
const norm = {
    teacher: (t, schedule, aliases) => {
        if (!t) return "";
        let ut = t.toUpperCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (aliases[ut]) return aliases[ut];
        for(let key in aliases) {
            let normalizedKey = key.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
            if (ut.includes(normalizedKey)) return aliases[key];
        }
        if (schedule[ut]) return ut;
        return ut.split(' ')[0];
    },
    weekday: (w) => {
        if(!w) return "";
        return w.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/-/g, " ");
    }
};

const TEACHER_ALIAS = {
    "ADELIA MARIA VIANA PINHEIRO": "CARLOS AUGUSTO",
    "ADELIA MARIA": "CARLOS AUGUSTO"
};

const TEACHER_SCHEDULE = {
    "GEMILSON": ["Segunda-feira", "Quarta-feira"],
    "CARLOS AUGUSTO": ["Terça-feira", "Quinta-feira"]
};

// Test Cases
console.log("--- Teachers ---");
console.log("Adelia ->", norm.teacher("ADELIA MARIA VIANA PINHEIRO", TEACHER_SCHEDULE, TEACHER_ALIAS));
console.log("Gemilson ->", norm.teacher("GEMILSON", TEACHER_SCHEDULE, TEACHER_ALIAS));
console.log("Marcos Aurelio (Partial) ->", norm.teacher("MARCOS AURELIO MATOS", {"MARCOS AURELIO": []}, {}));

console.log("\n--- Weekdays ---");
console.log("segunda-feira ->", norm.weekday("segunda-feira"));
console.log("Segunda-feira ->", norm.weekday("Segunda-feira"));
console.log("Segunda-Feira ->", norm.weekday("Segunda-Feira"));
console.log("Comparison Check:", norm.weekday("Segunda-Feira") === norm.weekday("Segunda-feira"));
