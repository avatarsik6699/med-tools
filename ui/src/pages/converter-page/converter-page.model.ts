import type { NumberInputProps } from "@mantine/core";
import { makeAutoObservable, runInAction } from "mobx";
import { BASE_SUBSTANCES } from "./model/substances.model";
import {
	BASE_UNITS_LIST,
	convertUnit,
	type Unit,
} from "./model/units-convert.utils";

type InputStateValue = NumberInputProps["value"];

export class ConverterModel {
	selectedSubstanceId: string = "litium";

	fromUnit: Unit = BASE_UNITS_LIST[4].value;
	fromValue: InputStateValue = "";

	toUnit: Unit = BASE_UNITS_LIST[1].value;
	toValue: InputStateValue = "";

	constructor() {
		makeAutoObservable(this);
	}

	// Геттеры
	get substanceMolarMass(): number {
		return Number(BASE_SUBSTANCES.get(this.selectedSubstanceId)!.value);
	}

	// Действия
	setSelectedSubstanceId = (id: string) => {
		this.selectedSubstanceId = id;
		// Пересчитываем значения при смене вещества
		this.recalculateValues();
	};

	setFromUnit = (unit: Unit) => {
		this.fromUnit = unit;
		// При смене единицы в левом поле пересчитываем правое поле
		this.recalculateToValue();
	};

	setFromValue = (value: InputStateValue) => {
		this.fromValue = value;
		// При изменении значения в левом поле пересчитываем правое поле
		this.recalculateToValue();
	};

	setToUnit = (unit: Unit) => {
		this.toUnit = unit;
		// При смене единицы в правом поле пересчитываем правое поле
		this.recalculateToValue();
	};

	setToValue = (value: InputStateValue) => {
		this.toValue = value;
		// При изменении значения в правом поле пересчитываем левое поле
		this.recalculateFromValue();
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
		// При смене вещества пересчитываем все значения
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
	};
}

// Создаем экземпляр store
export const converterStore = new ConverterModel();
