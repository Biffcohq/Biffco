/* global console */
/* eslint-disable no-console, no-undef */
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { env } from '@biffco/config';

const tracerActive = env.NODE_ENV !== "development" && env.OTEL_EXPORTER_OTLP_ENDPOINT;

if (tracerActive) {
  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      [SEMRESATTRS_SERVICE_NAME]: 'biffco-api',
      environment: env.NODE_ENV,
    }),
    traceExporter: new OTLPTraceExporter({
      url: env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://localhost:4318/v1/traces',
    }),
    instrumentations: [getNodeAutoInstrumentations()],
  });

  sdk.start();
  console.info("[OpenTelemetry] Tracing initialized.");
} else {
  console.info("[OpenTelemetry] Mock tracing only.");
}
