# 🚀 Быстрый деплой AdsRays Backend

## Для деплоя на Render.com:

### 1. Создайте новый репозиторий на GitHub
- Загрузите этот проект на GitHub
- Сделайте репозиторий публичным

### 2. Подключите к Render
1. Зайдите на [render.com](https://render.com)
2. Создайте аккаунт (можно через GitHub)
3. Нажмите "New +" → "Web Service"
4. Подключите ваш GitHub репозиторий

### 3. Настройки деплоя:
- **Name**: `adsrays-backend`
- **Root Directory**: `apps/backend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment**: `Node`

### 4. Environment Variables:
```
NODE_ENV=production
PORT=10000
```

### 5. После деплоя:
- Получите URL вида: `https://adsrays-backend.onrender.com`
- Используйте этот URL в Tilda коде вместо `localhost:4050`

## Для тестирования локально:
```bash
cd apps/backend
npm install
npm run build
npm start
```

Backend будет доступен на `http://localhost:4050`

