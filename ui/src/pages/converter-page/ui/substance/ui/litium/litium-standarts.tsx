import { useSelectState } from "@/shared/hooks/use-select-state";
import { List, rem, Select, Stack, Text } from "@mantine/core";
import { type FC } from "react";
import { FiMinus } from "react-icons/fi";
import { PiStandardDefinition } from "react-icons/pi";
import InfoSection from "../info-section";

const data = new Map([
  [
    "CANMAT",
    {
      value: "CANMAT",
      label: "CANMAT",
      source:
        // eslint-disable-next-line max-len
        "CANMAT (Canadian Network for Mood and Anxiety Treatments (CANMAT) and International Society for Bipolar Disorders (ISBD) 2018 guidelines for the management of patients with bipolar disorder)",
      items: [
        "депрессия 0,8-1,2 mEq/L",
        "пожилые 0.4-0.8 mEq/L",
        "поддерживающая 0.6-1 mEq/L",
      ],
    },
  ],
  [
    "RANZCP",
    {
      value: "RANZCP",
      label: "RANZCP",
      source:
        // eslint-disable-next-line max-len
        "RANZCP (The 2020 Royal Australian and New Zealand College of Psychiatrists clinical practice guidelines for mood disorders)",
      items: ["первый триместр 500 мг", "2-3 триместр 0.6–0.8 mmol/L"],
    },
  ],
  [
    "РОП",
    {
      value: "РОП",
      label: "РОП",
      source:
        // eslint-disable-next-line max-len
        "РОП (Российское общество психиатров. Клинические рекомендации. Биполярное аффективное расстройство. Год утверждения 2021)",
      items: [
        "мания (0,8-1.2 ммоль/л)",
        "депрессия (0.6-1,0 ммоль/л)",
        "поддерживающая (0,6-0,8 ммоль/л)",
        "токсическая (1,5 ммоль/л)",
      ],
    },
  ],
  [
    "NICE",
    {
      value: "NICE",
      label: "NICE",
      source:
        // eslint-disable-next-line max-len
        "NICE (National Institute for Health and Care Excellence. Bipolar disorder: assessment and management. Clinical guideline. Published: 24 September 2014. Last updated: 21 December 2023)",
      items: [
        "0.6 and 0.8 mmol/L (впервые)",
        "0.8 to 1.0 mmol/L (при недостаточном эффекте от 0.6-0.8)",
      ],
    },
  ],
  [
    "WFSBP",
    {
      value: "WFSBP",
      label: "WFSBP",
      source:
        // eslint-disable-next-line max-len
        "WFSBP (The World Federation of Societies of Biological Psychiatry. Guidelines for the Biological Treatment of Bipolar Disorders. Update 2009 on the Treatment of Acute Mania Protocol. Update 2010 on the treatment of acute bipolar depression. Update 2012 on the long-term treatment of bipolar disorder. Acute and longterm treatment of mixed states in bipolar disorder 2017)",
      items: [
        "Мания 0.6 and 1.3 mmol/l",
        "Депрессия 0.8–1.3 mEq/l",
        "Профилактика депрессий 0.4 – 1.0 mmol/l",
        "Профилактика мания 0.6 - 1.5 mmol/l",
        "Смешанный эпизод (острый и профилактика) 0.6–1.2 mmol/l",
      ],
    },
  ],
  [
    "МОДСЛИ",
    {
      value: "МОДСЛИ",
      label: "МОДСЛИ",
      source:
        // eslint-disable-next-line max-len
        "МОДСЛИ (The Maudsley Prescribing Guidelines in Psychiatry (15th edition, 2025))",
      items: [
        "поддержка: 0.6– 0.8 mmol/L",
        "хороший ответ/плохая переносимость 0.4– 0.6 mmol/L",
        "Плохой ответ/хорошая переносимость  0.8– 1.0 mmol/L",
        "Монополярная депрессия 0.6– 1.0 mmol/L",
        "Выше 0.75 mmol/L  = увеличение только антиманиакального эффекта",
      ],
    },
  ],
  [
    "Stahl's Essential Psychopharmacology PRESCRIBER'S GUIDE",
    {
      value: "Stahl's Essential Psychopharmacology PRESCRIBER'S GUIDE",
      label: "Stahl's Essential Psychopharmacology PRESCRIBER'S GUIDE",
      source:
        // eslint-disable-next-line max-len
        "Stahl's Essential Psychopharmacology PRESCRIBER'S GUIDE (8th edition, 2024)",
      items: [
        "купирование мании: 1,0-1,5 mmol/l",
        "купирование депрессии: 0,6-1,0 mmol/l",
        "поддерживающая терапия: 0,7-1,0 mmol/l",
      ],
    },
  ],
]);

const LitiumStandarts: FC = () => {
  const state = useSelectState("CANMAT");

  return (
    <Stack gap={0}>
      <InfoSection
        title={
          <Select
            {...state}
            w="100%"
            fw={400}
            comboboxProps={{
              transitionProps: { transition: "pop", duration: 200 },
            }}
            size="xs"
            searchable
            maxDropdownHeight={200}
            clearable={false}
            placeholder="Выберите источник нормы"
            nothingFoundMessage="Ничего не найдено"
            data={Array.from(data.values())}
          />
        }
        color="indigo.5"
        variant="light"
        icon={<PiStandardDefinition size={24} />}
      >
        {state.value !== null && (
          <>
            <List
              component={Stack}
              styles={{
                itemWrapper: {
                  display: "flex",
                  alignItems: "flex-start",
                },
                root: {
                  listStyle: "none",
                  gap: rem(8),
                  marginBottom: rem(8),
                },
              }}
              icon={<FiMinus />}
              c="dark.5"
              size="sm"
            >
              {data.get(state.value)?.items.map((item, index) => (
                <List.Item key={index}>{item}</List.Item>
              ))}
            </List>
            <Text c="dark.1" size="xs">
              Источник: {data.get(state.value)!.source}
            </Text>
          </>
        )}
      </InfoSection>
    </Stack>
  );
};

export default LitiumStandarts;
