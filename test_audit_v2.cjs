
const schedule = [
  // MOD I A
  { d: 'Segunda-feira', s: 1, g: 'MOD I A', t: 'GEMILSON' },
  { d: 'Segunda-feira', s: 2, g: 'MOD I A', t: 'GEMILSON' },
  { d: 'Segunda-feira', s: 3, g: 'MOD I A', t: 'FRANCISCA DA SILVA SOUSA' },
  { d: 'Segunda-feira', s: 4, g: 'MOD I A', t: 'ALEXSANDRA MARIA LINARD PAES LANDIM' },
  { d: 'Terça-feira',   s: 1, g: 'MOD I A', t: 'ALEXSANDRA MARIA LINARD PAES LANDIM' },
  { d: 'Terça-feira',   s: 2, g: 'MOD I A', t: 'ALEXSANDRA MARIA LINARD PAES LANDIM' },
  { d: 'Terça-feira',   s: 3, g: 'MOD I A', t: 'JORGE LUÍS SÁ BEZERRA' },
  { d: 'Terça-feira',   s: 4, g: 'MOD I A', t: 'DANIEL MAGALHAES CHAVES' },
  // ... (simplificado para o teste, mas baseado no SQL oficial)
  { d: 'Segunda-feira', s: 1, g: 'MOD I A ALT', t: 'FRANCISCA DA SILVA SOUSA' },
  { d: 'Segunda-feira', s: 3, g: 'MOD III A', t: 'MARCOS AURELIO MATOS DOS SANTOS' },
  { d: 'Quinta-feira',  s: 2, g: 'MOD III A', t: 'MARCOS AURELIO MATOS DOS SANTOS' },
  { d: 'Quinta-feira',  s: 3, g: 'MOD III A', t: 'MARCOS AURELIO MATOS DOS SANTOS' },
  { d: 'Terça-feira',   s: 4, g: 'MOD III A', t: 'MARCOS AURELIO MATOS DOS SANTOS' }
];

const proposedV = [
  // AC
  { d: 'Segunda-feira', s: 1, g: 'MOD V AC', t: 'LUCIANO DE OLIVEIRA CHAVES' },
  { d: 'Segunda-feira', s: 2, g: 'MOD V AC', t: 'LUCIANO DE OLIVEIRA CHAVES' },
  { d: 'Segunda-feira', s: 3, g: 'MOD V AC', t: 'FRANCINEUDA DA SILVA SOUSA' },
  { d: 'Segunda-feira', s: 4, g: 'MOD V AC', t: 'MARCOS AURELIO MATOS DOS SANTOS' },
  
  { d: 'Terça-feira',   s: 1, g: 'MOD V AC', t: 'LUCIANO DE OLIVEIRA CHAVES' },
  { d: 'Terça-feira',   s: 2, g: 'MOD V AC', t: 'MARCOS AURELIO MATOS DOS SANTOS' },
  { d: 'Terça-feira',   s: 3, g: 'MOD V AC', t: 'DANIEL MAGALHAES CHAVES' },
  { d: 'Terça-feira',   s: 4, g: 'MOD V AC', t: 'JORGE LUÍS SÁ BEZERRA' },
  
  { d: 'Quinta-feira',  s: 1, g: 'MOD V AC', t: 'FRANCINEUDA DA SILVA SOUSA' },
  { d: 'Quinta-feira',  s: 2, g: 'MOD V AC', t: 'FRANCINEUDA DA SILVA SOUSA' },
  { d: 'Quinta-feira',  s: 4, g: 'MOD V AC', t: 'MARCOS AURELIO MATOS DOS SANTOS' },

  // BD
  { d: 'Segunda-feira', s: 1, g: 'MOD V BD', t: 'GERSON DOS SANTOS' },
  { d: 'Segunda-feira', s: 2, g: 'MOD V BD', t: 'DANIEL MAGALHAES CHAVES' },
  { d: 'Segunda-feira', s: 3, g: 'MOD V BD', t: 'HELANNE BEATRIZ SILVA OLIVEIRA' },
  { d: 'Segunda-feira', s: 4, g: 'MOD V BD', t: 'SALOMÃO' },

  { d: 'Terça-feira',   s: 3, g: 'MOD V BD', t: 'ALEXSANDRA MARIA LINARD PAES LANDIM' },
  { d: 'Terça-feira',   s: 4, g: 'MOD V BD', t: 'ALEXSANDRA MARIA LINARD PAES LANDIM' }
];

const all = [...schedule, ...proposedV];
const conflicts = [];

for (let i = 0; i < all.length; i++) {
  for (let j = i + 1; j < all.length; j++) {
    const a = all[i];
    const b = all[j];
    if (a.d === b.d && a.s === b.s && a.t === b.t && a.g !== b.g) {
      conflicts.push(`CONFLITO: ${a.t} em ${a.g} e ${b.g} na ${a.d} ${a.s}ª aula`);
    }
  }
}

if (conflicts.length === 0) console.log("OK: Sem conflitos!");
else conflicts.forEach(c => console.log(c));
