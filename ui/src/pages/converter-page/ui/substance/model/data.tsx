import { List, rem, Stack, Text } from "@mantine/core";
import { MdOutlineDescription } from "react-icons/md";
import type { ConverterPageTypes } from "../../../types";
import InfoSection from "../ui/info-section";
import { MdTimeline } from "react-icons/md";
import { TfiHandPointRight } from "react-icons/tfi";
import LitiumStandarts from "../ui/litium/litium-standarts";

export const Substances = new Map<string, ConverterPageTypes.Substance>([
  [
    "litium",
    {
      value: "6.94",
      label: "Литий (Li)",
      InfoSections: [
        <LitiumStandarts />,
        <InfoSection
          title="Частота сдачи крови на Литий (Li)"
          color="cyan.5"
          variant="light"
          icon={<MdTimeline size={24} />}
        >
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
            icon={<TfiHandPointRight />}
            c="dark.5"
            size="sm"
          >
            <List.Item>
              1 раз в неделю до тех пор, пока желаемая концентрация не будет
              достигнута
            </List.Item>
            <List.Item>Затем 1 раз в 3 месяца - первые полгода</List.Item>
            <List.Item>
              Затем 1 раз в год на протяжении всего времени приема лития
            </List.Item>
          </List>
          <Text c="dark.1" size="xs">
            Источник: Stahl's Essential Psychopharmacology PRESCRIBER'S GUIDE
            (8th edition, 2024)
          </Text>
        </InfoSection>,
        <InfoSection
          title="Описание вещества: Литий (Li)"
          color="green.5"
          variant="light"
          icon={<MdOutlineDescription size={24} />}
        >
          <Text c="dark.5" size="sm">
            Литий широко используют при лечении маниакально-депрессивного
            психоза. При введении в виде карбоната лития, он полностью
            всасывается в желудочно‐кишечном тракте; пиковые уровни в сыворотке
            проявляются через 2-4 часа после перорального приема дозы. Период
            полувыведения в сыворотке составляет 48-72 часа, выведение
            осуществляется через почки (выделение параллельно натрию). Снижение
            функции почек может продлить время выведения. Литий действует за
            счет увеличения поглощения нейромедиаторов, что проявляется
            седативным действием на центральную нервную систему.
          </Text>
        </InfoSection>,
      ],
    },
  ],
]);
