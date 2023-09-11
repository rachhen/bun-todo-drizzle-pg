FROM oven/bun

WORKDIR /app

ENV NODE_ENV production
ADD package.json package.json
ADD bun.lockb bun.lockb
RUN bun install
COPY . .
RUN bun run migrate

CMD ["bun", "run", "start"]
