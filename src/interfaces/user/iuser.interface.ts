export interface IPhoneNumber {
  countryCode: string;
  phoneNumber: string;
  formatted: string;
  formattedPlus: string;
}

export interface IUserJWTPayload {
  id: number;
  code: string;
  identifier: string;
  firstName: string;
  lastName?: string;
  email?: string;
  photoUrl?: string;
  phone?: IPhoneNumber;
}

export interface IUserProfile {
  id?: number;
  code?: string;
  identifier: string;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: IPhoneNumber | undefined;
  photoUrl?: string;
  metadata?: Record<string, unknown>;
}
