export function convertUnitToMmol(args: {
  // from unit
  unit: string
  value: number
  molarMass: number
}) {
  // Сначала переводим всё в ммоль/л
  switch (args.unit) {
    case 'mmol_l':
      return args.value
    case 'meq_l':
      // todo: сейчас считает только для одновалентных ионов
      return args.value
    case 'micromol_l':
      return args.value / 1000;
    case 'mg_l':
      return args.value / args.molarMass;
    case 'mcg_l':
      return (args.value / 1000) / args.molarMass;
    default: {
      throw new Error("Некорректная ед. изм.")
    }
  }
}

export function convertMmolToUnit(args: {
  // to unit
  unit: string
  // mmol only
  value: number
  molarMass: number
}) {
  // Теперь переводим из ммоль/л в нужную целевую единицу

  switch (args.unit) {
    case 'mmol_l':
      return args.value;
    case 'meq_l':
      // todo: сейчас считает только для одновалентных ионов
      return args.value;
    case 'micromol_l':
      return args.value * 1000;
    case 'mg_l':
      return args.value * args.molarMass;
    case 'mcg_l':
      return args.value * args.molarMass * 1000;
    default: {
      throw new Error("Некорректная ед. изм.")
    }
  }
}