#################################################
# Base image
#################################################
FROM node:23-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

#################################################
# Build image
#################################################
FROM base AS build

COPY . /usr/src/app
WORKDIR /usr/src/app  

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=server --prod /prod/server
RUN pnpm deploy --filter=web --prod /prod/web

#################################################
# Final image
#################################################
FROM base AS final

COPY --from=build /prod/server /prod/server
COPY --from=build /prod/web/dist /prod/server/web

WORKDIR /prod/server

EXPOSE 3000

CMD ["pnpm", "run", "start"]
