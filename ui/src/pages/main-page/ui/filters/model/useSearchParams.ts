// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useNavigate, useSearch } from "@tanstack/react-router"
import type { FiltersTypes } from "../types"

/*

strict режим в useSearch
strict: true (по умолчанию):
Требует точного соответствия схеме валидации из validateSearch
Выбрасывает ошибку, если в URL есть параметры, не определенные в схеме
Обеспечивает типобезопасность
strict: false:
Позволяет дополнительные параметры в URL, не определенные в схеме
Игнорирует неизвестные параметры
Более гибкий, но менее безопасный
// Схема определяет только 'page' и 'filter'
const search = useSearch({
  from: "/",
  strict: false // URL может содержать /?page=1&filter=test&unknown=value
})
*/

export const useSearchParams = () => {
  const sp = useSearch({ from: "/" })
  const nav = useNavigate({ from: "/" })

  // const add = (key: string, value: string) => {
  //   const newSearch = { ...sp, [key]: value }
  //   nav({ search: prev => ({...prev}) })
  // }

  // const update = (key: string, value: string) => {
  //   const newSearch = { ...sp, [key]: value }
  //   nav({ search: newSearch })
  // }

  // const remove = (key: string) => {
  //   const { [key]: removed, ...newSearch } = sp
  //   nav({ search: newSearch })
  // }

  // const clear = () => {
  //   nav({ search: {} })
  // }




  console.log(sp)
  return {
    state: sp,
    set: (key: string, value: boolean | string) => {
      nav({
        search: currentSearchParams => {
          const searchParamsToSave = { ...currentSearchParams }
          // TODO: need to fix it

          if (typeof value === "boolean") {
            const typedKey = key as Extract<keyof FiltersTypes.State, 'withArchived' | 'withDeleted'>;

            if (typedKey in searchParamsToSave) {
              delete searchParamsToSave[typedKey];
            } else {
              searchParamsToSave[typedKey] = value;
            }
          } else {
            const typedKey = key as Exclude<keyof FiltersTypes.State, 'withArchived' | 'withDeleted'>;

            // Если уже есть массив по ключу
            if (searchParamsToSave[typedKey]) {
              // Если значение уже есть, значит удаляем
              if (searchParamsToSave[typedKey]!.includes(value)) {
                // Если это единственное значение, то чистим ключ
                if (searchParamsToSave[typedKey].length === 1) {
                  delete searchParamsToSave[typedKey];
                } else {
                  searchParamsToSave[typedKey] = searchParamsToSave[typedKey]!.filter(item => item != value)
                }
              } else {
                searchParamsToSave[typedKey] = [...searchParamsToSave[typedKey], value]
              }
            } else {
              searchParamsToSave[typedKey] = [value];
            }
          }

          return searchParamsToSave;
        }
      })

    }
  }
}