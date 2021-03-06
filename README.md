# Описание
Сервис позволяет пользователям читать и скачивать книги, имеющиеся в каталоге. Начинающие авторы могут загружать собственные книги и получать реакцию от читателей (оценки и комментарии).

Читатели могут "взять в аренду" одновременно до 10 книг. Чтобы взять новую, нужно сдать обратно какую-нибудь взятую книгу. Почти как в настоящей библиотеке. Пользователи могут оставлять закладки в книгах и продолжать чтение с места, где они остановились, прямо на сайте.

Для того, чтобы стать автором, нужно отправить запрос модераторам и получить одобрение.

Модератор должен проверять загруженные книги (соответствие содержания возрастному рейтингу, цензура, авторство, жанр и т.д.). Одобренные книги будут отображаться в каталоге, и пользователи смогут их прочитать или скачать.

В каталоге также могут находиться книги из свободного доступа. Их могут загрузить модераторы. Ответственность за авторство, жанр, цензуру и т.д. также лежит на них.

Книги хранятся на сервере.

Тестовое приложение запущено на https://e-library-docker-frontend.herokuapp.com/

## Наименование
E-library
## Предметная область
читатели, книги, авторы
# Данные
![er diagram](https://github.com/kolbacer/E-library/blob/main/E-library.png)
### book
|name|type|constraints|
|---|---|---|
|book_id| UUID |NOT NULL PRIMARY KEY|
|title| VARCHAR(50)| NOT NULL|
|authors| TEXT|
|genre| VARCHAR(50)| NOT NULL|
|publisher| VARCHAR(50)|
|publication_date| DATE| NOT NULL|
|age_rating |INT|
|language| VARCHAR(50)| NOT NULL|
|description |TEXT|
|pages_amount| INT |
|file_format| VARCHAR(50)|
|download_link| VARCHAR(150)| 
|approved |BOOL| NOT NULL|
|img| VARCHAR(150) |
|file| VARCHAR(150) |

### user
|name|type|constraints|
|---|---|---|
|user_id| UUID| NOT NULL PRIMARY KEY|
|login| VARCHAR(50)| NOT NULL |
|password| VARCHAR(50)| NOT NULL|
|name| VARCHAR(50)| NOT NULL|
|birth_date| DATE| NOT NULL|
|about| TEXT|
|is_author| BOOL| NOT NULL|
|is_moder| BOOL| NOT NULL|
|author_request| BOOL |
|img| VARCHAR(150) |

UNIQUE(login)

- `author_request` - был ли пользователем отправлен запрос на становление автором  

### book_reader
Определяет отношение между книгами и читателями
|name|type|constraints|
|---|---|---|
|book_id| UUID| NOT NULL, FOREIGN KEY(book), ON DELETE CASCADE|
|user_id| UUID |NOT NULL, FOREIGN KEY(user), ON DELETE CASCADE|
|bookmark |INT|

UNIQUE(book_id, user_id)

### book_author
Определяет отношение между книгами и авторами
|name|type|constraints|
|---|---|---|
|book_id| UUID |NOT NULL, FOREIGN KEY(book), ON DELETE CASCADE|
|user_id |UUID| NOT NULL, FOREIGN KEY(user), ON DELETE CASCADE|

UNIQUE(book_id, user_id)

### rating
оценки к книгам
|name|type|constraints|
|---|---|---|
|book_id| UUID |NOT NULL, FOREIGN KEY(book), ON DELETE CASCADE|
|user_id |UUID| NOT NULL, FOREIGN KEY(user), ON DELETE CASCADE|
|rate|INT| NOT NULL

UNIQUE(book_id, user_id)

### comments
комментарии к книгам
|name|type|constraints|
|---|---|---|
|comment_id| UUID |NOT NULL PRIMARY KEY|
|book_id| UUID |NOT NULL, FOREIGN KEY(book), ON DELETE CASCADE|
|user_id| UUID |NOT NULL, FOREIGN KEY(user), ON DELETE CASCADE|
|comment| TEXT |NOT NULL|
|time|TIMESTAMP|

## Общие ограничения целостности
- Связь *многие-ко-многим* между таблицами `book` и `user` (`book_reader`)
- Связь *многие-ко-многим* между таблицами `book` и `user` (`book_author`)
- Связь *многие-ко-многим* между таблицами `book` и `user` (`rating`)
- Связь *многие-ко-многим* между таблицами `book` и `user` (`comments`)
# Пользовательские роли
Читатель(кол-во: не ограничено)
- каждый пользователь по умолчанию
- может "брать в аренду" до 3-х книг
- может скачивать книги
- может делать закладки в арендованных книгах
- может оценивать книги
- может оставлять комментарии
- может удалять свои оценки и комментарии

Автор(кол-во: не ограничено)
- может то же, что и читатель
- может загружать свои книги

Модератор(минимум 1 человек)
- может то же, что и автор
- может загружать другие книги, находящиеся в свободном доступе
- может одобрять книги, загруженные авторами
- может удалять книги
- может назначать и убирать авторов
- может назначать и удалять других модераторов
- может удалять чужие комментарии

# UI/API
- **UI:** react.js
- **API:** node.js
# Технологии разработки
## Языки программирования
SQL, javascript
## СУБД
postgreSQL

# Скрипты для развертывания системы
## В папке /server/
- `npm install` - установка зависимостей
- `npm run dev` - запуск
## В папке /client/
- `npm install` - установка зависимостей
- `npm start` - запуск
