import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/ru'; // или другой язык

// Подключаем плагины
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

// Устанавливаем локаль
dayjs.locale('ru');

export default dayjs;