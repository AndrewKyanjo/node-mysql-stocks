## Key Architecture Patterns Used

| Pattern | Where | Why It's Used |
|---------|-------|---------------|
| **Producer/Consumer** | producer.ts → RabbitMQ → consumer.ts | Decouples fetching from saving; provides buffering |
| **Connection Pool** | db.ts (`connectionLimit: 5`) | Reuses database connections instead of opening new ones per query |
| **Fail Fast** | env.ts | Crashes immediately on missing config instead of failing later with cryptic errors |
| **At-Least-Once Delivery** | consumer.ts (`ack()`) | Ensures no data is lost even if the consumer crashes mid-processing |
| **Separation of Concerns** | routes/ vs controllers/ | Routes define "what URL"; controllers define "what happens" |
| **Singleton Service** | db.ts (`export const prisma`) | One PrismaClient shared across the entire app |
| **Environment-Based Config** | .env → env.ts | No hardcoded credentials; different configs for dev/staging/prod |