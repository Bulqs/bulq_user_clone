// --- SUBMISSION TYPES (What we send to POST /submit) ---
export interface KYCPersonalInfoRequest {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    dateOfBirth: string; // Sending as ISO String
    nationality: string;
    occupation: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    idType: string;
    idNumber: string;
    idExpiryDate: string; // Sending as ISO String
    bankName: string;
    accountNumber: string;
    bvn: string;
    profilePhoto: string;
    idFrontPhoto: string;
    idBackPhoto: string;
    proofOfAddress: string;
}

// --- RESPONSE TYPES (What we get from GET /status) ---
export interface PersonalInfoResponseDTO {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phoneNumber: string;
    address: string;
    city: string;
    state: string;
    nationality: string;
}

export interface DocumentsResponseDTO {
    idType: string;
    idNumber: string;
    idFrontImage: string; 
    idBackImage: string;  
    selfieImage: string;   
}

export interface CreateKYCResponseDTO {
    id: string;
    kycStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNSUBMITTED';
    personalInfo: PersonalInfoResponseDTO;
    documents: DocumentsResponseDTO;
    submittedAt: string;
    reviewedAt: string;
    rejectionReason: string;
}

export interface KYCPersonalInfo {
    firstName: string;
    lastName: string;
    dateOfBirth: string; 
    phoneNumber: string;
    address: string;
    city: string;
    state: string;
    nationality: string;
}

export interface KYCDocuments {
    idType: string; // e.g., 'LICENSE', 'PASSPORT', 'NIN'
    idNumber: string;
    idFrontImage: string;
    idBackImage: string;
    selfieImage: string;
}

export interface KYCResponseDTO {
    id: string;
    kycStatus: 'APPROVED' | 'PENDING' | 'REJECTED' | 'UNVERIFIED' | string; 
    personalInfo: KYCPersonalInfo;
    documents: KYCDocuments;
    submittedAt: string;
    reviewedAt: string | null;
    rejectionReason: string | null;
}