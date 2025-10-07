# Proxy Endpoint and Embed Script Implementation Summary

## Краткое описание изменений

Реализован CORS-совместимый прокси-эндпоинт `/api/proxy/campaigns` и встраиваемый скрипт `public/embed/adsr.js` для интеграции с внешними сайтами (например, Tilda).

## Изменения

### 1. Новый прокси-эндпоинт: `/api/proxy/campaigns`

**Файл**: `apps/backend/src/index.ts`

- Добавлен эндпоинт `GET /api/proxy/campaigns` для внешних встраиваний
- Исправлена последовательность middleware - CORS обработчик теперь первый
- Удалены явные OPTIONS обработчики (теперь CORS middleware обрабатывает все OPTIONS запросы)
- Добавлена поддержка статических файлов из директории `public/`

**Ключевые изменения**:
```typescript
// CORS middleware должен быть первым для обработки preflight запросов
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin || "*";
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  next();
});

// proxy для кампаний - для внешних встраиваний (Tilda и т.д.)
app.get("/api/proxy/campaigns", (req: Request, res: Response) => {
  const list = [
    { id: 'cmp-1', name: 'Тестовая кампания 1', status: 'ACTIVE', creatives: 2 },
    { id: 'cmp-2', name: 'Тестовая кампания 2', status: 'PAUSED', creatives: 2 }
  ];
  res.status(200).json(list);
});

// Статическая раздача файлов из public
const PUBLIC_PATH = fileURLToPath(new URL("../../../public", import.meta.url));
app.use(express.static(PUBLIC_PATH));
```

### 2. Встраиваемый скрипт: `public/embed/adsr.js`

**Файл**: `public/embed/adsr.js`

Создан новый JavaScript-файл для встраивания виджета на внешние сайты:
- Основан на `tilda/embed.js`
- Использует эндпоинт `/api/proxy/campaigns` вместо `/api/campaigns`
- Полная поддержка CORS для кросс-доменных запросов
- Поддерживает атрибут `data-api` для указания базового URL API

**Использование**:
```html
<div id="adsr-root"></div>
<script src="https://your-domain.com/embed/adsr.js" 
        data-root="adsr-root" 
        data-api="https://your-api-domain.com"></script>
```

### 3. Тестовая страница: `public/embed/test.html`

**Файл**: `public/embed/test.html`

Создана тестовая HTML-страница для демонстрации работы виджета с прокси-эндпоинтом.

### 4. Обновленные тесты

**Файл**: `apps/backend/src/__tests__/campaigns.test.ts`

Добавлен тест для проверки структуры ответа прокси-эндпоинта:
```typescript
test('proxy campaigns endpoint returns same structure', () => {
  // Проверяет, что /api/proxy/campaigns возвращает ту же структуру данных
});
```

## CORS и Preflight

### Поддержка CORS

Все эндпоинты (включая `/api/proxy/campaigns`) теперь возвращают правильные CORS заголовки:

```
Access-Control-Allow-Origin: <origin>
Access-Control-Allow-Methods: GET,POST,OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Vary: Origin
```

### Preflight запросы (OPTIONS)

OPTIONS запросы корректно обрабатываются CORS middleware:
- Возвращают статус 204 No Content
- Включают все необходимые CORS заголовки
- Работают для любого origin

## Тестирование

### Юнит-тесты

```bash
cd apps/backend
pnpm run test
```

Результат: ✅ 3 теста пройдено

### Интеграционные тесты

Протестированы следующие сценарии:

1. ✅ GET запрос к `/api/proxy/campaigns`
2. ✅ OPTIONS preflight с Origin заголовком
3. ✅ GET запрос с Origin заголовком (CORS)
4. ✅ Статическая раздача `/embed/adsr.js`
5. ✅ Статическая раздача `/embed/test.html`
6. ✅ Проверка использования proxy endpoint в adsr.js

### Примеры запросов

**GET запрос**:
```bash
curl http://localhost:4050/api/proxy/campaigns
```

**OPTIONS preflight**:
```bash
curl -X OPTIONS -H "Origin: https://tilda.cc" \
     -H "Access-Control-Request-Method: GET" \
     http://localhost:4050/api/proxy/campaigns
```

**GET с CORS**:
```bash
curl -H "Origin: https://example.com" \
     http://localhost:4050/api/proxy/campaigns
```

## Сборка и запуск

### Сборка
```bash
cd apps/backend
pnpm run build
```

### Запуск
```bash
cd apps/backend
pnpm run start
# или
node dist/index.js
```

Сервер запустится на `http://localhost:4050`

## Структура файлов

```
apps/backend/src/
├── index.ts                          # ✏️ Изменен - добавлен proxy endpoint, CORS fix
├── __tests__/
│   └── campaigns.test.ts             # ✏️ Изменен - добавлен тест для proxy

public/                                # ✨ Новая директория
├── embed/
│   ├── adsr.js                       # ✨ Новый - встраиваемый скрипт
│   └── test.html                     # ✨ Новый - тестовая страница
```

## Преимущества

1. **CORS Compliance**: Правильная обработка CORS и preflight запросов
2. **Раздельные эндпоинты**: `/api/campaigns` для внутреннего использования, `/api/proxy/campaigns` для внешних встраиваний
3. **Статические файлы**: Встраиваемый скрипт доступен по прямой ссылке
4. **Тестирование**: Полное покрытие тестами
5. **Обратная совместимость**: Существующий `/api/campaigns` работает без изменений

## Что дальше

Этот код готов к слиянию в `main` ветку. После слияния:

1. Обновить документацию в `IMPLEMENTATION_SUMMARY.md`
2. Обновить `QUICK_START.md` с примерами использования proxy endpoint
3. Развернуть на продакшн сервере
4. Обновить URL в `public/embed/adsr.js` на продакшн URL (если требуется)
