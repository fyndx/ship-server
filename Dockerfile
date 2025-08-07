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

FROM alpine AS curl-downloader
RUN apk add --no-cache curl

FROM gcr.io/distroless/base

WORKDIR /app

# Copy the compiled binaries
COPY --from=build /app/server server
COPY --from=curl-downloader /usr/bin/curl /usr/bin/curl

# Ensure the binary is executable
USER nonroot:nonroot

ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD ["/usr/bin/curl", "-f", "http://localhost:3000/health"]

EXPOSE 3000

CMD ["./server"]