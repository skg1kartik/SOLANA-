FROM rust:1.88-bookworm AS builder
WORKDIR /app
COPY Cargo.toml ./
COPY migrations ./migrations
COPY src ./src
RUN cargo build --release

FROM debian:bookworm-slim AS runtime
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates libsqlite3-0 && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=builder /app/target/release/tervex-backend /usr/local/bin/tervex-backend
RUN mkdir -p /app/data && chown -R 10001:10001 /app
USER 10001:10001
ENV HOST=0.0.0.0 PORT=3000 DATABASE_URL=sqlite://data/tervex.db
EXPOSE 3000
CMD ["tervex-backend"]
