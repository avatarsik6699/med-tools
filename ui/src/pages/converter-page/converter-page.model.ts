import type { NumberInputProps } from "@mantine/core";
import { makeAutoObservable, runInAction } from "mobx";
import {
	BASE_SUBSTANCES,
	type Substance,
	type ValidationItem,
} from "./model/substances.model";
import {
	BASE_UNITS_LIST,
	convertUnit,
	type Unit,
} from "./model/units-convert.utils";

type InputStateValue = NumberInputProps["value"];
type StandardKey = string;

export class ConverterModel {
	selectedSubstanceId: string = "litium";

	fromUnit: Unit = BASE_UNITS_LIST[4].value;
	fromValue: InputStateValue = "";

	toUnit: Unit = BASE_UNITS_LIST[1].value;
	toValue: InputStateValue = "";

	// Стандарт, выбранный для текущего вещества
	selectedStandardKey: StandardKey = "CANMAT";

	constructor() {
		makeAutoObservable(this);
		// По умолчанию предполагаем, что нормы есть и ключ "CANMAT" всегда валиден
		// this.initDefaultStandard(); // Не вызываем, т.к. дефолт всегда "CANMAT"
	}

	// Инициализация дефолтного стандарта при создании store или смене вещества
	private initDefaultStandard() {
		// По умолчанию всегда "CANMAT"
		this.selectedStandardKey = "CANMAT";
	}

	// Геттеры
	get substance(): Substance | undefined {
		return BASE_SUBSTANCES.get(this.selectedSubstanceId);
	}

	get substanceMolarMass(): number {
		return this.substance?.molarMass ?? 1;
	}

	get standardsList(): { value: string; label: string }[] {
		const substance = this.substance;
		if (!substance) return [];
		return Array.from(substance.standards.values()).map((std) => ({
			value: std.value,
			label: std.label,
		}));
	}

	get selectedStandard() {
		const substance = this.substance;

		if (!substance || !this.selectedStandardKey) return null;

		return substance.standards.get(this.selectedStandardKey) ?? null;
	}

	get standardValidationItems(): ValidationItem[] {
		return this.selectedStandard?.items ?? [];
	}

	get standardSource(): string | null {
		return this.selectedStandard?.source ?? null;
	}

	// Действия
	setSelectedSubstanceId = (id: string) => {
		this.selectedSubstanceId = id;
		this.initDefaultStandard();
		this.recalculateValues();
	};

	setSelectedStandardKey = (key: StandardKey) => {
		this.selectedStandardKey = key;
	};

	setFromUnit = (unit: Unit) => {
		this.fromUnit = unit;
		this.recalculateToValue();
	};

	setFromValue = (value: InputStateValue) => {
		this.fromValue = value;
		this.recalculateToValue();
	};

	setToUnit = (unit: Unit) => {
		this.toUnit = unit;
		this.recalculateToValue();
	};

	setToValue = (value: InputStateValue) => {
		this.toValue = value;
		this.recalculateFromValue();
	};

	// Валидация значения по выбранному стандарту и конкретному диапазону (ValidationItem)
	/**
	 * Валидирует значение относительно конкретного диапазона (item).
	 * Используется для покомпонентной проверки каждого диапазона при рендере.
	 *
	 * @param value - проверяемое значение
	 * @param unit - единица измерения (по умолчанию fromUnit)
	 * @param item - диапазон/стандарт для проверки (ValidationItem)
	 * @returns статус валидации для данного диапазона
	 */
	validateValueAgainstStandardItem = (
		value: number,
		unit: Unit = this.fromUnit,
		item?: ValidationItem,
	): { status: "ok" | "error" | "neutral"; matchedItem?: ValidationItem } => {
		if (!item || !item.range) return { status: "neutral" };

		// Если значение не введено (NaN или пустое), возвращаем neutral
		if (typeof value !== "number" || isNaN(value)) {
			return { status: "neutral" };
		}

		// Приводим значение к ммоль/л для сравнения
		const mmolValue = convertUnit({
			molarMass: this.substanceMolarMass,
			fromUnit: unit,
			toUnit: "mmol_l",
			value,
		});

		if ("min" in item.range && "max" in item.range) {
			const { min, max } = item.range;
			if (mmolValue >= min && mmolValue <= max) {
				return { status: "ok", matchedItem: item };
			}
			return { status: "error", matchedItem: item };
		} else if ("value" in item.range) {
			if (mmolValue === item.range.value) {
				return { status: "ok", matchedItem: item };
			}
			return { status: "error", matchedItem: item };
		}

		return { status: "neutral" };
	};

	// Приватные методы для пересчета
	private recalculateToValue = () => {
		if (typeof this.fromValue === "number") {
			const convertedValue = convertUnit({
				molarMass: this.substanceMolarMass,
				fromUnit: this.fromUnit,
				toUnit: this.toUnit,
				value: this.fromValue,
			});
			runInAction(() => {
				this.toValue = convertedValue;
			});
		} else {
			runInAction(() => {
				this.toValue = "";
			});
		}
	};

	private recalculateFromValue = () => {
		if (typeof this.toValue === "number") {
			const convertedValue = convertUnit({
				molarMass: this.substanceMolarMass,
				fromUnit: this.toUnit,
				toUnit: this.fromUnit,
				value: this.toValue,
			});
			runInAction(() => {
				this.fromValue = convertedValue;
			});
		} else {
			runInAction(() => {
				this.fromValue = "";
			});
		}
	};

	private recalculateValues = () => {
		if (typeof this.fromValue === "number") {
			this.recalculateToValue();
		} else if (typeof this.toValue === "number") {
			this.recalculateFromValue();
		}
	};

	// Метод для сброса состояния
	reset = () => {
		this.fromValue = "";
		this.toValue = "";
		this.initDefaultStandard();
	};
}

// Создаем экземпляр store
export const converterStore = new ConverterModel();
