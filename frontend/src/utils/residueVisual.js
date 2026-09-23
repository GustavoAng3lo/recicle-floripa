const residueVisuals = {
  vidro: { className: 'residue-glass', label: 'Vidro' },
  plástico: { className: 'residue-plastic', label: 'Plástico' },
  papel: { className: 'residue-paper', label: 'Papel' },
  metal: { className: 'residue-metal', label: 'Metal' },
  'não reciclável': { className: 'residue-reject', label: 'Não reciclável' },
  orgânico: { className: 'residue-organic', label: 'Orgânico' },
  eletrônico: { className: 'residue-electronic', label: 'Eletrônico' },
};

const brokenTextCorrections = {
  'Res�duo n�o recicl�vel': 'Resíduo não reciclável',
  'Lata de Alum�nio': 'Lata de Alumínio',
  'Caixa de Papel�o': 'Caixa de Papelão',
  'Garrafa de Vidro': 'Garrafa de Vidro',
  'Centro - Florian�polis': 'Centro - Florianópolis',
  'Itacorubi - Florian�polis': 'Itacorubi - Florianópolis',
  'Trindade - Florian�polis': 'Trindade - Florianópolis',
  'Campeche - Florian�polis': 'Campeche - Florianópolis',
};

export const normalizeResidueText = (value = '') => brokenTextCorrections[value] || value;

export const getResidueVisual = (category = '') => {
  const normalizedCategory = category.toLowerCase();
  const key = Object.keys(residueVisuals).find((name) => normalizedCategory.includes(name) || (name === 'não reciclável' && normalizedCategory.includes('rejeito')));
  return residueVisuals[key] || { className: 'residue-default', label: category || 'Resíduo' };
};
