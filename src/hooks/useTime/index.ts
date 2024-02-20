import dayjs from 'dayjs'
import zh from 'dayjs/locale/zh-cn'
import en from 'dayjs/locale/en'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useAppStore } from '..'

const languageMap = {
  zh,
  en,
}

dayjs.extend(relativeTime)

export function useTime() {
  const [language] = useAppStore(state => [state.language])
  dayjs.locale(languageMap[language])

  return dayjs
}
