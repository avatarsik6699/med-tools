// Типы для единиц измерения
export type Unit = "mmol_l" | "meq_l" | "micromol_l" | "mg_l" | "mcg_l";
// Интерфейс для конвертации
interface ConversionConfig {
	unit: Unit;
	value: number;
	molarMass: number;
	valence?: number; // для многовалентных ионов
}

// Константы
const CONVERSION_FACTORS = {
	MICROMOL_TO_MMOL: 1e3,
	MCG_TO_MG: 1e3,
} as const;

export const BASE_UNITS_LIST: { value: Unit; label: string }[] = [
	{ value: "mmol_l", label: "ммоль/л" },
	{ value: "meq_l", label: "мЭкв/л" },
	{ value: "micromol_l", label: "мкмоль/л" },
	{ value: "mg_l", label: "мг/л" },
	{ value: "mcg_l", label: "мкг/л" },
] as const;

// Lookup таблица для конвертации в ммоль/л
const toMmolFactors: Record<
	Unit,
	(value: number, molarMass: number, valence?: number) => number
> = {
	mmol_l: (value) => value,
	meq_l: (value, _, valence = 1) => value / valence,
	micromol_l: (value) => value / CONVERSION_FACTORS.MICROMOL_TO_MMOL,
	mg_l: (value, molarMass) => value / molarMass,
	mcg_l: (value, molarMass) => value / CONVERSION_FACTORS.MCG_TO_MG / molarMass,
};

// Lookup таблица для конвертации из ммоль/л
const fromMmolFactors: Record<
	Unit,
	(value: number, molarMass: number, valence?: number) => number
> = {
	mmol_l: (value) => value,
	meq_l: (value, _, valence = 1) => value * valence,
	micromol_l: (value) => value * CONVERSION_FACTORS.MICROMOL_TO_MMOL,
	mg_l: (value, molarMass) => value * molarMass,
	mcg_l: (value, molarMass) => value * molarMass * CONVERSION_FACTORS.MCG_TO_MG,
};

export function convertUnitToMmol({
	unit,
	value,
	molarMass,
	valence = 1,
}: ConversionConfig): number {
	if (!toMmolFactors[unit]) {
		throw new Error(`Неподдерживаемая единица измерения: ${unit}`);
	}

	return toMmolFactors[unit](value, molarMass, valence);
}

export function convertMmolToUnit({
	unit,
	value,
	molarMass,
	valence = 1,
}: ConversionConfig): number {
	if (!fromMmolFactors[unit]) {
		throw new Error(`Неподдерживаемая единица измерения: ${unit}`);
	}

	return fromMmolFactors[unit](value, molarMass, valence);
}

// Универсальная функция конвертации между любыми единицами
export function convertUnit(args: {
	fromUnit: Unit;
	toUnit: Unit;
	value: number;
	molarMass: number;
	valence?: number;
}): number {
	const mmolValue = convertUnitToMmol({
		unit: args.fromUnit,
		value: args.value,
		molarMass: args.molarMass,
		valence: args.valence,
	});

	return convertMmolToUnit({
		unit: args.toUnit,
		value: mmolValue,
		molarMass: args.molarMass,
		valence: args.valence,
	});
}
