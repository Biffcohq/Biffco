import { z } from 'zod';
/**
 * Event Definition genérico proyectado del Core.
 */
export interface EventDefinition<T = any> {
    type: string;
    schemaVersion: number;
    payloadSchema: z.ZodSchema<T>;
    uiSchema?: Record<string, any>;
    allowedRoles: string[];
}
export declare const ANIMAL_REGISTERED: EventDefinition;
export declare const ANIMAL_ONBOARDED: EventDefinition;
export declare const BRANDING_RECORDED: EventDefinition;
export declare const WEIGHT_RECORDED: EventDefinition;
export declare const FEEDING_RECORDED: EventDefinition;
export declare const VACCINE_ADMINISTERED: EventDefinition;
export declare const TREATMENT_ADMINISTERED: EventDefinition;
export declare const HEALTH_INCIDENT_REPORTED: EventDefinition;
export declare const INCIDENT_RESOLVED: EventDefinition;
export declare const OFFICIAL_INSPECTION: EventDefinition;
export declare const HEALTH_CERT_ISSUED: EventDefinition;
export declare const QUARANTINE_IMPOSED: EventDefinition;
export declare const QUARANTINE_LIFTED: EventDefinition;
export declare const CHECKPOINT_RECORDED: EventDefinition;
export declare const SLAUGHTER_SCHEDULED: EventDefinition;
export declare const SLAUGHTER_COMPLETED: EventDefinition;
export declare const QUALITY_GRADE_ASSIGNED: EventDefinition;
export declare const EUDR_DDS_GENERATED: EventDefinition;
export declare const CUSTOMS_CLEARED: EventDefinition;
export declare const LOT_ASSEMBLED: EventDefinition;
export declare const LOCATION_CHANGED_LIVESTOCK: EventDefinition;
export declare const TRANSFER_INITIATED_LIVESTOCK: EventDefinition;
export declare const TRANSFER_IN_TRANSIT_LIVESTOCK: EventDefinition;
export declare const EXTERNAL_CERTIFICATION_LINKED: EventDefinition;
export declare const HOLD_IMPOSED_BY_STATE: EventDefinition;
export declare const FEEDLOT_ENTRY: EventDefinition;
export declare const FEEDLOT_EXIT: EventDefinition;
export declare const livestockEventCatalog: EventDefinition[];
//# sourceMappingURL=events.d.ts.map