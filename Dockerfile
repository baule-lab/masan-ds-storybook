FROM node:20-bookworm AS build
WORKDIR /app

RUN npm install -g pnpm@10.18.3 turbo

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./

COPY apps/storybook/package.json ./apps/storybook/
COPY apps/web/package.json        ./apps/web/

COPY packages/queries/package.json           ./packages/queries/
COPY packages/shared-ui/package.json         ./packages/shared-ui/
COPY packages/types/package.json             ./packages/types/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/utils/package.json             ./packages/utils/

RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile

COPY . .
ARG APP_NAME=storybook
RUN pnpm --filter=./apps/${APP_NAME} build

FROM nginxinc/nginx-unprivileged:stable-alpine-perl AS runner

ARG APP_NAME=storybook

COPY nginx.conf /etc/nginx/nginx.conf
COPY --chown=nginx:nginx --from=build /app/apps/${APP_NAME}/dist /usr/share/nginx/html

USER nginx
CMD ["nginx", "-g", "daemon off;"]
