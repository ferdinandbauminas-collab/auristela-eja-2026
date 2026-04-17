
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
  { d: 'Quarta-feira',  s: 1, g: 'MOD I A', t: 'LINDELVÂNIA' },
  { d: 'Quarta-feira',  s: 2, g: 'MOD I A', t: 'LINDELVÂNIA' },
  { d: 'Quarta-feira',  s: 4, g: 'MOD I A', t: 'GERSON DOS SANTOS' },
  { d: 'Quinta-feira',  s: 1, g: 'MOD I A', t: 'VAGO' },
  { d: 'Quinta-feira',  s: 2, g: 'MOD I A', t: 'CARLOS AUGUSTO' },
  { d: 'Quinta-feira',  s: 3, g: 'MOD I A', t: 'HELANNE BEATRIZ SILVA OLIVEIRA' },
  { d: 'Quinta-feira',  s: 4, g: 'MOD I A', t: 'JOSE DE ASSUNCAO SOUSA BARBOSA' },
  { d: 'Sexta-feira',   s: 1, g: 'MOD I A', t: 'DENILSON DAVID DA SILVA SANTOS' },
  { d: 'Sexta-feira',   s: 2, g: 'MOD I A', t: 'DENILSON DAVID DA SILVA SANTOS' },
  { d: 'Sexta-feira',   s: 3, g: 'MOD I A', t: 'DENILSON DAVID DA SILVA SANTOS' },
  { d: 'Sexta-feira',   s: 4, g: 'MOD I A', t: 'WILSILENE DOS SANTOS OLIVEIRA BRANDÃO' },

  // MOD I A ALT
  { d: 'Segunda-feira', s: 1, g: 'MOD I A ALT', t: 'FRANCISCA DA SILVA SOUSA' },
  { d: 'Segunda-feira', s: 2, g: 'MOD I A ALT', t: 'EDNARDO FERREIRA DE SOUSA' },
  { d: 'Segunda-feira', s: 3, g: 'MOD I A ALT', t: 'EDNARDO FERREIRA DE SOUSA' },
  { d: 'Segunda-feira', s: 4, g: 'MOD I A ALT', t: 'GEMILSON' },
  { d: 'Terça-feira',   s: 1, g: 'MOD I A ALT', t: 'MARIA EUNICE LIRA TEIRA ANDRADE' },
  { d: 'Terça-feira',   s: 2, g: 'MOD I A ALT', t: 'HELANNE BEATRIZ SILVA OLIVEIRA' },
  { d: 'Terça-feira',   s: 3, g: 'MOD I A ALT', t: 'MARIA EUNICE LIRA TEIRA ANDRADE' },
  { d: 'Terça-feira',   s: 4, g: 'MOD I A ALT', t: 'CARLOS AUGUSTO' },
  { d: 'Quarta-feira',  s: 1, g: 'MOD I A ALT', t: 'HELANNE BEATRIZ SILVA OLIVEIRA' },
  { d: 'Quarta-feira',  s: 2, g: 'MOD I A ALT', t: 'GEMILSON' },
  { d: 'Quarta-feira',  s: 3, g: 'MOD I A ALT', t: 'DANIEL MAGALHAES CHAVES' },
  { d: 'Quarta-feira',  s: 4, g: 'MOD I A ALT', t: 'GEMILSON' },
  { d: 'Quinta-feira',  s: 1, g: 'MOD I A ALT', t: 'FRANCISCA DA SILVA SOUSA' },
  { d: 'Quinta-feira',  s: 2, g: 'MOD I A ALT', t: 'FRANCISCO JR' },
  { d: 'Quinta-feira',  s: 3, g: 'MOD I A ALT', t: 'FRANCISCO JR' },
  { d: 'Quinta-feira',  s: 4, g: 'MOD I A ALT', t: 'FRANCISCO JR' },
  { d: 'Sexta-feira',   s: 1, g: 'MOD I A ALT', t: 'MARIA EUNICE LIRA TEIRA ANDRADE' },
  { d: 'Sexta-feira',   s: 2, g: 'MOD I A ALT', t: 'JOSE DE ASSUNCAO SOUSA BARBOSA' },
  { d: 'Sexta-feira',   s: 3, g: 'MOD I A ALT', t: 'JOANA DARC' },
  { d: 'Sexta-feira',   s: 4, g: 'MOD I A ALT', t: 'CARMEN SILVIA NUNES DE MOURA SANTOS' },

  // MOD III A
  { d: 'Segunda-feira', s: 1, g: 'MOD III A', t: 'FRANCINEUDA DA SILVA SOUSA' },
  { d: 'Segunda-feira', s: 2, g: 'MOD III A', t: 'FRANCINEUDA DA SILVA SOUSA' },
  { d: 'Segunda-feira', s: 3, g: 'MOD III A', t: 'MARCOS AURELIO MATOS DOS SANTOS' },
  { d: 'Segunda-feira', s: 4, g: 'MOD III A', t: 'DENILSON DAVID DA SILVA SANTOS' },
  { d: 'Terça-feira',   s: 1, g: 'MOD III A', t: 'WESLEY BEZERRA PORTELA FREITAS' },
  { d: 'Terça-feira',   s: 2, g: 'MOD III A', t: 'WESLEY BEZERRA PORTELA FREITAS' },
  { d: 'Terça-feira',   s: 4, g: 'MOD III A', t: 'MARCOS AURELIO MATOS DOS SANTOS' },
  { d: 'Quarta-feira',  s: 1, g: 'MOD III A', t: 'JORGE LUÍS SÁ BEZERRA' },
  { d: 'Quarta-feira',  s: 2, g: 'MOD III A', t: 'HELANNE BEATRIZ SILVA OLIVEIRA' },
  { d: 'Quarta-feira',  s: 4, g: 'MOD III A', t: 'JOSE DE ASSUNCAO SOUSA BARBOSA' },
  { d: 'Quinta-feira',  s: 1, g: 'MOD III A', t: 'DENILSON DAVID DA SILVA SANTOS' },
  { d: 'Quinta-feira',  s: 2, g: 'MOD III A', t: 'MARCOS AURELIO MATOS DOS SANTOS' },
  { d: 'Quinta-feira',  s: 3, g: 'MOD III A', t: 'MARCOS AURELIO MATOS DOS SANTOS' },
  { d: 'Quinta-feira',  s: 4, g: 'MOD III A', t: 'FRANCISCA DA SILVA SOUSA' },
  { d: 'Sexta-feira',   s: 1, g: 'MOD III A', t: 'JOANA DARC' },
  { d: 'Sexta-feira',   s: 2, g: 'MOD III A', t: 'WILSILENE DOS SANTOS OLIVEIRA BRANDÃO' },
  { d: 'Sexta-feira',   s: 3, g: 'MOD III A', t: 'CARMEN SILVIA NUNES DE MOURA SANTOS' },
  { d: 'Sexta-feira',   s: 4, g: 'MOD III A', t: 'DANIEL MAGALHAES CHAVES' },

  // MOD III B
  { d: 'Segunda-feira', s: 1, g: 'MOD III B', t: 'DENILSON DAVID DA SILVA SANTOS' },
  { d: 'Segunda-feira', s: 2, g: 'MOD III B', t: 'DENILSON DAVID DA SILVA SANTOS' },
  { d: 'Segunda-feira', s: 3, g: 'MOD III B', t: 'DENILSON DAVID DA SILVA SANTOS' },
  { d: 'Segunda-feira', s: 4, g: 'MOD III B', t: 'FRANCINEUDA DA SILVA SOUSA' },
  { d: 'Terça-feira',   s: 1, g: 'MOD III B', t: 'FRANCINEUDA DA SILVA SOUSA' },
  { d: 'Terça-feira',   s: 2, g: 'MOD III B', t: 'GERSON DOS SANTOS' },
  { d: 'Terça-feira',   s: 3, g: 'MOD III B', t: 'WESLEY BEZERRA PORTELA FREITAS' },
  { d: 'Terça-feira',   s: 4, g: 'MOD III B', t: 'WESLEY BEZERRA PORTELA FREITAS' },
  { d: 'Quarta-feira',  s: 1, g: 'MOD III B', t: 'JOSE DE ASSUNCAO SOUSA BARBOSA' },
  { d: 'Quarta-feira',  s: 2, g: 'MOD III B', t: 'FRANCISCA DA SILVA SOUSA' },
  { d: 'Quarta-feira',  s: 3, g: 'MOD III B', t: 'HELANNE BEATRIZ SILVA OLIVEIRA' },
  { d: 'Quarta-feira',  s: 4, g: 'MOD III B', t: 'JORGE LUÍS SÁ BEZERRA' },
  { d: 'Quinta-feira',  s: 1, g: 'MOD III B', t: 'WILSILENE DOS SANTOS OLIVEIRA BRANDÃO' },
  { d: 'Quinta-feira',  s: 2, g: 'MOD III B', t: 'DENILSON DAVID DA SILVA SANTOS' },
  { d: 'Quinta-feira',  s: 3, g: 'MOD III B', t: 'DENILSON DAVID DA SILVA SANTOS' },
  { d: 'Quinta-feira',  s: 4, g: 'MOD III B', t: 'DENILSON DAVID DA SILVA SANTOS' },
  { d: 'Sexta-feira',   s: 1, g: 'MOD III B', t: 'DANIEL MAGALHAES CHAVES' },
  { d: 'Sexta-feira',   s: 2, g: 'MOD III B', t: 'CARMEN SILVIA NUNES DE MOURA SANTOS' },
  { d: 'Sexta-feira',   s: 3, g: 'MOD III B', t: 'SALOMÃO' },
  { d: 'Sexta-feira',   s: 4, g: 'MOD III B', t: 'JOANA DARC' },
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
  
  { d: 'Quarta-feira',  s: 1, g: 'MOD V AC', t: 'FRANCISCA DA SILVA SOUSA' },
  { d: 'Quarta-feira',  s: 2, g: 'MOD V AC', t: 'WESLEY BEZERRA PORTELA FREITAS' },
  { d: 'Quarta-feira',  s: 3, g: 'MOD V AC', t: 'LINDELVÂNIA' },
  { d: 'Quarta-feira',  s: 4, g: 'MOD V AC', t: 'HELANNE BEATRIZ SILVA OLIVEIRA' },
  
  { d: 'Quinta-feira',  s: 1, g: 'MOD V AC', t: 'FRANCINEUDA DA SILVA SOUSA' },
  { d: 'Quinta-feira',  s: 2, g: 'MOD V AC', t: 'FRANCINEUDA DA SILVA SOUSA' },
  { d: 'Quinta-feira',  s: 3, g: 'MOD V AC', t: 'WILSILENE DOS SANTOS OLIVEIRA BRANDÃO' },
  { d: 'Quinta-feira',  s: 4, g: 'MOD V AC', t: 'MARCOS AURELIO MATOS DOS SANTOS' },

  { d: 'Sexta-feira',   s: 1, g: 'MOD V AC', t: 'JOSE DE ASSUNCAO SOUSA BARBOSA' },
  { d: 'Sexta-feira',   s: 2, g: 'MOD V AC', t: 'WESLEY BEZERRA PORTELA FREITAS' },
  { d: 'Sexta-feira',   s: 3, g: 'MOD V AC', t: 'DANIEL MAGALHAES CHAVES' },
  { d: 'Sexta-feira',   s: 4, g: 'MOD V AC', t: 'MARCOS AURELIO MATOS DOS SANTOS' },

  // BD
  { d: 'Segunda-feira', s: 1, g: 'MOD V BD', t: 'GERSON DOS SANTOS' },
  { d: 'Segunda-feira', s: 2, g: 'MOD V BD', t: 'DANIEL MAGALHAES CHAVES' },
  { d: 'Segunda-feira', s: 3, g: 'MOD V BD', t: 'HELANNE BEATRIZ SILVA OLIVEIRA' },
  { d: 'Segunda-feira', s: 4, g: 'MOD V BD', t: 'SALOMÃO' },

  { d: 'Terça-feira',   s: 1, g: 'MOD V BD', t: 'JORGE LUÍS SÁ BEZERRA' },
  { d: 'Terça-feira',   s: 2, g: 'MOD V BD', t: 'LINDELVÂNIA' },
  { d: 'Terça-feira',   s: 3, g: 'MOD V BD', t: 'ALEXSANDRA MARIA LINARD PAES LANDIM' },
  { d: 'Terça-feira',   s: 4, g: 'MOD V BD', t: 'ALEXSANDRA MARIA LINARD PAES LANDIM' },

  { d: 'Quarta-feira',  s: 1, g: 'MOD V BD', t: 'LUCIANO DE OLIVEIRA CHAVES' },
  { d: 'Quarta-feira',  s: 2, g: 'MOD V BD', t: 'JARBAS' },
  { d: 'Quarta-feira',  s: 3, g: 'MOD V BD', t: 'JOSE DE ASSUNCAO SOUSA BARBOSA' }, // Assunção moveu de 4 para 3
  { d: 'Quarta-feira',  s: 4, g: 'MOD V BD', t: 'WESLEY BEZERRA PORTELA FREITAS' }, // Wesley moveu de 3 para 4

  { d: 'Quinta-feira',  s: 1, g: 'MOD V BD', t: 'HELANNE BEATRIZ SILVA OLIVEIRA' }, // Helanne moveu de 3 para 1
  { d: 'Quinta-feira',  s: 2, g: 'MOD V BD', t: 'FRANCISCA DA SILVA SOUSA' },
  { d: 'Quinta-feira',  s: 3, g: 'MOD V BD', t: 'SALOMÃO' }, // Salomão moveu de 1 para 3
  { d: 'Quinta-feira',  s: 4, g: 'MOD V BD', t: 'WILSILENE DOS SANTOS OLIVEIRA BRANDÃO' },

  { d: 'Sexta-feira',   s: 1, g: 'MOD V BD', t: 'SALOMÃO' }, // Salomão moveu de 2->1
  { d: 'Sexta-feira',   s: 2, g: 'MOD V BD', t: 'SALOMÃO' }, // Salomão moveu de 3->2? No, 2 e 4.
  { d: 'Sexta-feira',   s: 3, g: 'MOD V BD', t: 'WESLEY BEZERRA PORTELA FREITAS' }, // Wesley em 3 (Vago para Salomão)
  { d: 'Sexta-feira',   s: 4, g: 'MOD V BD', t: 'SALOMÃO' }, // Salomão em 4
];

const all = [...schedule, ...proposedV];
const conflicts = [];

for (let i = 0; i < all.length; i++) {
  for (let j = i + 1; j < all.length; j++) {
    const a = all[i];
    const b = all[j];
    if (a.d === b.d && a.s === b.s && a.t === b.t && a.g !== b.g) {
      conflicts.push(`CONFLITO: ${a.t} está em ${a.g} e ${b.g} na ${a.d} Horário ${a.s}`);
    }
  }
}

if (conflicts.length === 0) {
  console.log("SUCESSO: Nenhum conflito encontrado!");
} else {
  conflicts.forEach(c => console.log(c));
}
