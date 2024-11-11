# WB Service

**Быстрый деплой**:

1. `docker-compose build` - Билд проекта в докере
2. `docker-compose up` - Запуск проекта 
3. `npm run migrations` - Запустить миграции

**Endpoints**:
Сервер работает на порте 3000, порт можно изменить в .env файле переменная PORT <br/>
1. http://localhost:3000/api/tariff_list - Получить лист тарифов <br/>
Параметры: <br/>
`date: 'YYYY-MM-DD'` - найти тарифы по дате (Опциональный) <br/>
2. http://localhost:3000/api/upload_to_sheet - Загрузить тарифы в таблицу(-ы) <br/>
Body: <br/>
```
JSON
{
    "data": [tarrifs...] // Required
    "sheet_credentials": [
        {
            "id": "string" // Id of google sheet
            "name": "string" // List of sheet
        }
    ...] // Optional, если не указывается, берется таблица из .env файла
}`
```

**Tasks**:
1. Ежечасное обновление тарифов коробов в базу данных // ./src/cron-jobs.ts

**Test Google sheet**:
https://docs.google.com/spreadsheets/d/1aBshlCLAMJdjjEzlOasNQ21zVJHzSiJpX9MhH2o9zRs
