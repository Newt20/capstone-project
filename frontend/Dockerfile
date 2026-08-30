# syntax=docker/dockerfile:1

# ---- base: shared package manifest layer ----
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json yarn.lock ./

# ---- deps: full install (incl. devDependencies), shared by dev + build ----
FROM base AS deps
RUN yarn install --frozen-lockfile

# ---- development target ----
# Runs the Vite dev server with HMR against the full source tree.
# VITE_API_URL / VITE_SOCKET_URL are read at container start from a mounted
# .env / compose env (Vite's dev server reads import.meta.env at request time
# from its own process env, unlike a production bundle).
FROM deps AS development
ENV NODE_ENV=development
COPY . .
EXPOSE 5173
CMD ["yarn", "dev", "--host"]

# ---- build: type-check + production bundle ----
# VITE_* vars are compiled into the JS bundle here (Vite inlines
# import.meta.env.* at build time) - they cannot be changed at container
# runtime afterwards, so each environment's backend URL must be supplied as a
# build arg when this stage is built.
FROM deps AS build
ARG VITE_API_URL
ARG VITE_SOCKET_URL
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_SOCKET_URL=${VITE_SOCKET_URL}
COPY . .
RUN yarn build

# ---- production target ----
# Static optimized bundle served by nginx. Used by both the stage and prod
# environments (only the build args differ between them).
FROM nginx:1.27-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
