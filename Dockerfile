FROM oven/bun:alpine AS build

WORKDIR /app

# Cache packages installation
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source files
COPY ./src ./src
COPY ./prisma ./prisma
COPY ./tsconfig.json ./
COPY ./healthcheck.js ./

ENV NODE_ENV=production

# Generate Prisma client
RUN bun prisma generate --no-engine

RUN bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--target bun \
	--outfile server \
	./src/index.ts

FROM gcr.io/distroless/base

WORKDIR /app

# Copy the compiled binary and healthcheck
COPY --from=build /app/server server
COPY --from=build /app/healthcheck.js healthcheck.js

# Ensure the binary is executable
USER nonroot:nonroot

ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD ["/usr/local/bin/bun", "/app/healthcheck.js"]

EXPOSE 3000

CMD ["./server"]