# Описание
Сервис позволяет пользователям читать и скачивать книги, имеющиеся в каталоге. Начинающие авторы могут загружать собственные книги и получать реакцию от читателей (оценки и комментарии).

Читатели могут "взять в аренду" одновременно до 3-х книг. Чтобы взять новую, нужно сдать обратно какую-нибудь взятую книгу. Почти как в настоящей библиотеке. Пользователи могут оставлять закладки в книгах и продолжать чтение с места, где они остановились, прямо на сайте.

Для того, чтобы стать автором, нужно отправить запрос модератору и получить одобрение.

Модератор должен проверять загруженные книги (соответствие содержания возрастному рейтингу, цензура, авторство, жанр и т.д.). Одобренные книги будут отображаться в каталоге, и пользователи смогут их прочитать или скачать.

В каталоге также могут находиться книги из свободного доступа. Их могут загрузить модераторы. Ответственность за авторство, жанр, цензуру и т.д. также лежит на них.

Книги хранятся на сервере.

## Наименование
E-library
## Предметная область
читатели, книги, авторы
# Данные
### book
|name|type|constraints|
|---|---|---|
|book_id| UUID |NOT NULL PRIMARY KEY|
|title| VARCHAR(50)| NOT NULL|
|authors| TEXT| NOT NULL|
|genre| VARCHAR(50)| NOT NULL|
|publisher| VARCHAR(50)|
|publication_date| DATE| NOT NULL|
|number_of_ratings| INT|
|sum_of_ratings| INT|
|age_rating |INT|
|language| VARCHAR(50)| NOT NULL|
|description |TEXT|
|pages_amount| INT |
|file_format| VARCHAR(50)| NOT NULL|
|download_link| VARCHAR(150)| 
|approved |BOOL| NOT NULL|

- `number_of_ratings` - кол-во оценок
- `sum_of_ratings` - сумма оценок

рейтинг книги считается, как sum_of_ratings / number_of_ratings
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

UNIQUE(login)

### book_reader
Определяет отношение между книгами и читателями
|name|type|constraints|
|---|---|---|
|rent_id| UUID| NOT NULL PRIMARY KEY|
|book_id| UUID| NOT NULL|
|user_id| UUID |NOT NULL|
|bookmark |INT|
### book_author
Определяет отношение между книгами и авторами
|name|type|constraints|
|---|---|---|
|authorship_id| UUID| NOT NULL PRIMARY KEY|
|book_id| UUID |NOT NULL|
|user_id |UUID| NOT NULL|
### comments
комментарии к книгам
|name|type|constraints|
|---|---|---|
|comment_id| UUID |NOT NULL PRIMARY KEY|
|book_id| UUID |NOT NULL|
|user_id| UUID |NOT NULL|
|comment| TEXT |NOT NULL|
### directories
Директории пользователей-авторов, в которых хранятся их книги
|name|type|constraints|
|---|---|---|
|user_id| UUID| NOT NULL PRIMARY KEY|
|directory| VARCHAR(150)| NOT NULL|
## Общие ограничения целостности
- Связь *многие-ко-многим* между таблицами `book` и `user` (`book_reader`)
- Связь *многие-ко-многим* между таблицами `book` и `user` (`book_author`)
- Связь *многие-ко-многим* между таблицами `book` и `user` (`comments`)
# Пользовательские роли
Читатель(кол-во: неограничено)
- каждый пользователь по умолчанию
- может "брать в аренду" до 3-х книг
- может скачивать книги
- может делать закладки в арендованных книгах
- может оценивать книги
- может оставлять комментарии
- может удалять свои оценки и комментарии

Автор(кол-во: неограничено)
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
