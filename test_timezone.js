// Testando a formatação do frontend
const d = new Date('2026-03-13T00:30:38.907Z'); // Isso é 21:30 no Brasil do dia 12

const brDate = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
}).format(d);

console.log("brDate string:", brDate);

const parts = brDate.split('/');
console.log("parts:", parts);

const [day, month, year] = parts;
const formattedDate = `${year}-${month}-${day}`;
console.log("formattedDate:", formattedDate);
