# Cloud logging mapping

`orders-api` writes one JSON object per stdout line. Container platforms collect stdout, parse the JSON, and expose `ts`, `level`, `service`, `msg`, and `reqId` as searchable fields.

## Google Cloud Logging

Configure the logging agent or workload runtime to parse JSON. In Logs Explorer, use queries such as:

```text
jsonPayload.level="error"
jsonPayload.service="orders-api"
jsonPayload.reqId="<request-id>"
```

The application retains `level` rather than using a provider-specific field, so it is portable. A log router can map it to the provider severity if desired.

## Grafana Loki

Configure Promtail, Alloy, or the Docker logging pipeline with JSON parsing, then query:

```logql
{service="orders-api"} | json | level="error"
{service="orders-api"} | json | reqId="<request-id>"
```

`reqId` should remain a parsed field rather than an indexed label: it has high cardinality and is best used to filter a bounded incident investigation.

## Data safety

The logger records operational metadata and safe identifiers only. It deliberately does not log request bodies, database connection settings, authentication tokens, payment-card data, or passwords.
