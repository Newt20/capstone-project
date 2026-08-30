# syntax=docker/dockerfile:1

# ---- base: shared package manifest layer ----
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# ---- deps: full install (incl. devDependencies), shared by dev + build ----
FROM base AS deps
RUN npm install

# ---- development target ----
# Runs the TS source directly via tsx watch (hot reload), keeps devDependencies.
# Used by the dev environment only.
FROM deps AS development
ENV NODE_ENV=development
COPY tsconfig.json ./
COPY src ./src
EXPOSE 5000
USER node
CMD ["npx", "tsx", "watch", "src/server.ts"]

# ---- build: compile TypeScript -> dist ----
FROM deps AS build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- production target ----
# Compiled JS only, production dependencies only, non-root user.
# Used by both the stage and prod environments.
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 5000

USER node

CMD ["node", "dist/server.js"]
