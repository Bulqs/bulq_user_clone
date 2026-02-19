export type ServiceName = 'KYC' | 'BOOKING' | 'FLEET' | 'USER' | 'WALLET' | 'COMPLAINT';
export type LogSeverity = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export interface AuditLogDTO {
    id: number;
    userId: string;
    userEmail: string;
    serviceName: ServiceName | string;
    activityType: string; // e.g., "USER_LOGIN", "SHIPMENT_CREATED"
    description: string;
    entityId: string;
    entityType: string;
    metadata: Record<string, any>;
    ipAddress: string;
    timestamp: string;
    severity: LogSeverity;
}

/** * Represents the count of logs categorized by a specific property 
 * e.g., { "INFO": 45, "ERROR": 2, "BOOKING": 10 }
 */
export type LogCountResponse = Record<string, number>;

export interface PageableResponse<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
    numberOfElements: number;
    first: boolean;
    empty: boolean;
}

export type entityType = 'USER' | 'BOOKING' | 'CARRIAGE' | 'WALLET' | 'KYC' | string