# Structured logging evidence

## Before

The original application emitted free-form messages, for example:

```text
starting
payment started
error happened
done
```

There was no timestamp, severity, service field, or way to associate an error with its request.

## After: reproduce and trace a failure

```bash
docker compose up -d --build
curl -i localhost:3000/simulate-error
docker logs orders-api | jq 'select(.level=="error")'
docker logs orders-api | jq 'select(.reqId=="<request-id-from-X-Request-Id-response-header>")'
```

The error query returns an entry like:

```json
{"ts":"2026-01-10T14:02:01.000Z","level":"error","service":"orders-api","msg":"simulation.failed","reqId":"a request UUID","error":"Intentional failure for logging verification"}
```

Filtering by the same `reqId` returns the coherent request journey: `request.started`, `simulation.failed`, and `request.completed` with status `500`.

For normal traffic, each JSON line has `ts`, `level`, `service`, and `msg`; all request-scoped events also have `reqId`. The API returns that ID in `X-Request-Id`, which makes the trace command copy-and-pasteable.
