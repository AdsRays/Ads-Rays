FROM node:20-alpine AS deps
WORKDIR /usr/src/app
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
COPY package.json pnpm-lock.yaml* ./
RUN pnpm i

FROM deps AS build
WORKDIR /usr/src/app
COPY . .
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /usr/src/app
RUN npm i -g serve
COPY --from=build /usr/src/app/dist ./dist
EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]



