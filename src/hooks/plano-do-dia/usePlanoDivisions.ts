
/**
 * Utilidades para divisões por dia da semana e listas de exercícios adicionais.
 */
export const getMuscleDivisionForDay = (dateStr: string) => {
  const weekday = new Date(dateStr).getDay();
  const divisions = [
    { name: "Costas e Bíceps", muscle_groups: ["Costas", "Bíceps"], type: 'duplo' },
    { name: "Peito e Tríceps", muscle_groups: ["Peito", "Tríceps"], type: 'duplo' },
    { name: "Pernas (Quadríceps, Glúteos, Panturrilha)", muscle_groups: ["Quadríceps", "Glúteos", "Panturrilha"], type: 'trio' },
    { name: "Ombros e Abdômen", muscle_groups: ["Ombros", "Abdômen"], type: 'duplo' },
    { name: "Posterior de Pernas, Glúteos e Panturrilha", muscle_groups: ["Posterior de Pernas", "Glúteos", "Panturrilha"], type: 'trio' },
    { name: "Cardio, Abdômen & Alongamento geral", muscle_groups: ["Abdômen"], type: 'cardio' },
  ];
  if (weekday === 0) return null;
  if (weekday >= 1 && weekday <= 6) return divisions[weekday - 1];
  return null;
};

export const aeróbicos = [
  "Esteira",
  "Bicicleta",
  "Elíptico",
  "Simulador de escada",
  "Caminhada livre"
];

export const alongamentos = [
  "Alongamento geral",
  "Alongamento de membros superiores",
  "Alongamento de membros inferiores",
  "Alongamento de coluna"
];
