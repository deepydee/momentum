# momentum

#### Это задание stage#0. Задание stage#1 доступно по [ссылке](momentum-stage1.md)

**Momentum** - аналог [одноимённого приложения](https://chrome.google.com/webstore/detail/momentum/laookkfknpbbblfpciffpaejjkokdgca?hl=ru) интернет-магазина Chrome. Приложение показывает время и имя пользователя. Фоновое изображение и приветствие меняются в зависимости от времени суток.  
В приложении есть часы, слайдер изображений, виджеты погоды, аудиоплеер, цитата дня. Для хранения имени пользователя и населённого пункта используется локальное хранилище - local storage.

#### Ключевые навыки:
- методы поиска элементов;
- вывод данных на страницу;
- работа с датой и временем;
- работа с аудио;
- сохранение данных в local storage;
- использование рекурсивного setTimeout;
- деление js-кода на модули;
- генерирование html через js;
- работа с асинхронными запросами. 
![deepydee github io_momentum_](https://user-images.githubusercontent.com/35696895/235333585-6bcfd5ae-b969-4cd0-b229-c6962a80f964.png)

Momentum - большой и интересный таск. В ходе его выполнения вы познакомитесь с многими разделами и темами JavaScript, усвоите важные навыки, получите полезный практический опыт. При этом задание отлично делится на небольшие блоки, так что можно выполнить только часть требований или разделить приложение на несколько независимых проектов.

#### Структура приложения
Приложение состоит из шести функциональных блоков:
1. Часы и календарь
2. Приветствие
3. Слайдер изображений 
4. Виджет погоды
5. Аудиоплеер
6. Виджет цитата дня

#### Нефункциональные требования
(не оцениваются)
- язык приложения русский, английский или белорусский 
  - во всём приложении используется только один язык, нежелательны варианты, когда один виджет на английском, другой на русском.  
  - если язык приложения английский, формат даты можно отображать в британском английском (число, потом месяц) или американском английском (месяц, потом число)
- js-код приложения разбит на модули
- создано [расширение для Google Chrome](https://vc.ru/dev/159897-kak-sdelat-rasshirenie-dlya-google-chrome-i-nemnogo-uluchshit-ux-na-glavnoy-stranice-pochty) (без публикации в интернет-магазине)

#### Функциональные требования
**1. Часы и календарь**
  - время выводится в 24-часовом формате, например: `21:01:00`
  - время обновляется каждую секунду (часы идут)
  - выводится день недели, дата, месяц, например: "Воскресенье, 16 мая" / "Sunday, May 16" / "Нядзеля, 16 траўня"
  - при изменении дня недели, даты, месяца эти данные меняются в приложении (в ходе кросс-чека этот пункт не проверяется)

**2. Приветствие**
  - текст приветствия меняется в зависимости от времени суток (утро, день, вечер, ночь)
    - с 6:00 до 11:59 - Good morning / Доброе утро / Добрай раніцы
    - с 12:00 до 17:59 - Good day / Добрый день / Добры дзень
    - с 18:00 до 23:59 - Good evening / Добрый вечер / Добры вечар
    - с 00:00 до 5:59 - Good night / Доброй/Спокойной ночи / Дабранач
  - при изменении времени суток, если в это время приложение открыто, меняется текст приветствия (в ходе кросс-чека этот пункт не проверяется)
  - пользователь может ввести своё имя
  - при перезагрузке страницы приложения имя пользователя сохраняется, данные о  нём хранятся в local storage

**3. Слайдер изображений**
  - при загрузке или перезагрузке приложения фоновое изображение выбирается из расположенной на GitHub [коллекции изображений](https://github.com/rolling-scopes-school/stage1-tasks/tree/assets/images).  
  - ссылка на фоновое изображение формируется с учётом времени суток и случайного номера изображения (от `01` до `20`), например: `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/evening/18.jpg`  
  Здесь:
    - `evening` - время суток, другие значения `day`, `morning`, `night`
    - `18` - рандомный (случайный) номер изображения, от `01` до `20`.
  - изображения можно перелистывать кликами по стрелкам, расположенным по бокам экрана. 
  - изображения перелистываются последовательно - после 18 изображения идёт 19 (клик по правой стрелке), перед 18 изображением идёт 17 (клик по левой стрелке)
  - изображения перелистываются по кругу: после двадцатого изображения идёт первое (клик по правой стрелке), перед 1 изображением идёт 20 (клик по левой стрелке)
  - при смене слайдов важно обеспечить плавную смену фоновых изображений. Плавную смену фоновых изображений не проверяем: 1) при загрузке и перезагрузке страницы 2) при открытой консоли браузера 3) при слишком частых кликах по стрелкам для смены изображения

**4. Виджет погоды**
  - город по умолчанию - Минск, пока пользователь не ввёл другой город
  - при перезагрузке страницы приложения указанный пользователем город сохраняется, данные о  нём хранятся в local storage
  - для указанного пользователем населённого пункта выводятся данные о погоде, если их возвращает API
  - данные о погоде включают в себя: иконку погоды, описание погоды, температуру в `°C`, скорость ветра в `м/с`, относительную влажность воздуха в `%`
  - числовые параметры погоды округляются до целых чисел
  - выводится уведомление об ошибке при вводе некорректных значений, для которых API не возвращает погоду (пустая строка или бессмысленный набор символов)

**5. Виджет цитата дня**
  - при загрузке страницы приложения отображается рандомная цитата и её автор
  - в качестве источника цитаты можно использовать как API, так и созданный вами или найденный в интернете JSON-файл с цитатами и их авторами. API с цитатами не отличаются надёжностью и долговечностью, используемый в качестве источника цитат собственный JSON-файл лучше гарантирует работоспособность вашего приложения. Запросы к JSON также осуществляются асинхронно, таким образом необходимые знания о работе с асинхронными запросами вы получите
  - при перезагрузке страницы цитата обновляется (заменяется на другую)
  - язык цитаты русский, английский или белорусский определяется языком приложения
  - есть кнопка, при клике по которой цитата обновляется (заменяется на другую)

**6. Аудиоплеер**
  - при клике по кнопке `Play` проигрывается первый трек из блока `play-list`
  - при клике по кнопке `Play` она превращается в кнопку `Pause`: изменяется её стиль на кнопке отображается иконка остановки проигрывания
  - при клике по кнопке `Pause` останавливается проигрывание трека, кнопка `Pause` превращается в кнопку `Play`, на ней отображается иконка проигрывания
  - треки можно пролистывать кнопками `play-next` и `play-prev`
  - треки пролистываются по кругу - после последнего идёт первый (клик по кнопке `play-next`), перед первым - последний (клик по кнопке `play-prev`)
  - трек, который в данный момент проигрывается, выделяется стилем
  - после окончания проигрывания первого трека, автоматически запускается проигрывание следующего. Треки проигрываются по кругу: после последнего снова проигрывается первый. Для удобства проверки треки возьмите небольшой продолжительности. Обрезать треки можно здесь: `https://mp3cut.net/ru/`
  - плейлист создаётся средствами JavaScript (в ходе кросс-чека этот пункт не проверяется)

**Hacker scope**  
Дополнительная функциональность (не оценивается)

**7. Продвинутый аудиоплеер (реализуется без использования библиотек)**
- примерные внешний вид и функциональность плеера https://howlerplayer.github.io/
- добавлен прогресс-бар
- над прогресс-баром отображается название трека
- отображается текущее и общее время воспроизведения трека
- добавлен регулятор громкости
- можно запустить и остановить проигрывания трека кликом по его названию в плейлисте

**8. Перевод приложения на два языка (en/ru или en/be)**
- переводится приветствие
- переводится прогноз погоды в т.ч описание погоды (OpenWeatherMap API предоставляет такую возможность)
- переводится цитата дня (используйте API, возвращающий цитаты на нужном языке или создайте с этой целью JSON-файл с цитатами на двух языках)
- переводятся названия треков в аудиоплеере, если у них есть соответствующий перевод, иначе названия треков оставляем на языке оригинала

#### Технические требования
- работа приложения проверяется в браузере Google Chrome последней версии
- можно использовать [bootstrap](https://getbootstrap.com/), [material design](https://material.io/), css-фреймворки, html и css препроцессоры
- не разрешается использовать jQuery, другие js-библиотеки и фреймворки
- js-код приложения должен быть читаемым, без минимизации или обфускации

#### Критерии оценки
**Максимальный балл за задание +50**
- За каждое из шести функциональных требований можно получить от 0 до 10 баллов. Дополнительная функциональность не оценивается
- Максимальная оценка за функциональное требование - 10 баллов - выставляется в том случае, если выполнены все пункты, относящиеся к данному требованию
- Минимальная оценка за функциональное требование - 0 баллов - выставляется в том случае, если не выполнен ни один пункт, относящийся к данному требованию
- Если пункты к данному требованию выполнены частично, количество баллов определяет проверяющий в зависимости от количества выполненных пунктов и их вкладе в общую оценку за данное требование
- Все невыполненные или частично выполненные пункты требования указываются проверяющим в комментарии к оценке
- Разница между максимальной оценкой за приложение (50 баллов) и максимально возможным количеством баллов за выполнение всех пунктов требований (60 баллов) позволит сгладить возможные ошибки проверяющих в ходе кросс-чека, неточности в описании задания, разное понимание требований задания проверяющим и проверяемым.
