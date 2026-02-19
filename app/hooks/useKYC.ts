import { getKYCStatus } from "@/lib/user/kyc.actions";

export function useKYCGuard() {
  const checkAccess = async (requiredTier: 'APPROVED') => {
    try {
      const kyc = await getKYCStatus();
      if (kyc.kycStatus !== requiredTier) {
        // Redirect to /kyc/submit or show a "Verification Required" modal
        return false;
      }
      return true;
    } catch {
      return false;
    }
  };

  return { checkAccess };
}