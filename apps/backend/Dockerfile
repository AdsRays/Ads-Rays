FROM node:20-alpine AS deps
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

FROM deps AS build
WORKDIR /usr/src/app
COPY . .
RUN pnpm i && pnpm build

FROM node:20-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --from=build /usr/src/app/dist ./dist
COPY package.json ./package.json
RUN npm pkg set type=module
EXPOSE 4000
CMD ["node", "dist/index.js"]



