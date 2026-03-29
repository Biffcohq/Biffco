"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_node_1 = require("@opentelemetry/sdk-node");
const auto_instrumentations_node_1 = require("@opentelemetry/auto-instrumentations-node");
const exporter_trace_otlp_http_1 = require("@opentelemetry/exporter-trace-otlp-http");
const resources_1 = require("@opentelemetry/resources");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
const config_1 = require("@biffco/config");
const tracerActive = config_1.env.NODE_ENV !== "development" && config_1.env.OTEL_EXPORTER_OTLP_ENDPOINT;
if (tracerActive) {
    const sdk = new sdk_node_1.NodeSDK({
        resource: (0, resources_1.resourceFromAttributes)({
            [semantic_conventions_1.SEMRESATTRS_SERVICE_NAME]: 'biffco-api',
            environment: config_1.env.NODE_ENV,
        }),
        traceExporter: new exporter_trace_otlp_http_1.OTLPTraceExporter({
            url: config_1.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://localhost:4318/v1/traces',
        }),
        instrumentations: [(0, auto_instrumentations_node_1.getNodeAutoInstrumentations)()],
    });
    sdk.start();
    console.info("[OpenTelemetry] Tracing initialized.");
}
else {
    console.info("[OpenTelemetry] Mock tracing only.");
}
//# sourceMappingURL=telemetry.js.map