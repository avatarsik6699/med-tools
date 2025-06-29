import type React from "react";

export namespace ConverterPageTypes {
  export type Substance = {
    value: string;
    label: string;
    InfoSections: React.ReactNode[];
  };
}
