// export interface FootersProps{
//
// }

import { AuthResponse } from "@/lib/actions";





// export interface IProductListProps {
//     id: number;
//     name: string;
//     price: number;
//     imageSrc?: any;
//     imageAlt?: string;
// }

export interface IMultipleForms {
  firstName: string,
  lastName: string,
  businessName: string,
  businessCity: string,
  businessWebsite: string,
  businessEmail: string,
  incomePerMonth: number,
  taxPercentage: number,
  agreeToTerms: boolean,
  showStepNumber?: any;
}

export interface Iimage {
  id: number;
  imageSrc: string;
  imageAlt: string;
  width?: number;
  height?: number;
  button?: string;
  index?: number;
  title?: string;
  subtitle?: string;
  littleText?: number | string;
}

export interface IProductCardProps {
  id: number;
  names: string;
  price: number;
  imageUrl: string;
  imageAlt: string;
  width: number;
  height: number;
}

// export interface IOtherBuyAble{
//     imageSrc: string;
//     imageAlt: string;
//     width: number;
//     height: number;
//     title: string;
// }

export interface ISvgIconProps {
  width?: string;
  height?: string;
  className?: any;
  fill?: string;
}

export interface ICartCardProps {
  id: number;
  product: string;
  desc?: string;
  img: string;
  brand?: string;
  vendor?: string;
  rating?: number;
  price?: number;
  shipping?: number;
  images?: {
    image: string
  }[];
  reviews?: {
    review: string;
  }[];
  Model?: string;
  Weight?: string;
  Material?: string;
  colors?: {
    color: string;
    price: number;
    // image: string;
  }[];
  size?: {
    title: string,
  }[],
  features?: {
    feature: string
  }[],
}

export interface IAllVendorsProps {
  id: number;
  image: string;
  link: string;
  name?: string;
}[];

export interface IAllVendorsBanner {
  image: string;
  desc?: string;
  small?: string;
}

export interface ISingleVendorBanner {
  image: string;
  desc?: string;
  small?: string;
  big?: string;
}

export interface IAllVendorsImageBottomTag {
  id: number;
  image: string;
  desc?: string;
  predesc?: string;
}

export interface IAllVendorsImageTopTag {
  id: number;
  image?: string;
}

export interface IAllRatings {
  id: number;
  image: string;
  comment?: string;
  rating: number;
}[]

export interface IOrderReceipt {
  logo: string;
  date?: string;
  receiptNumber?: string;
  name?: string;
  message?: string;
  productInfo?: {
    image: string;
    name: string;
    price: number;
    paid: string;
  }[];
  paymentMethod?: string;
  address?: string;
  itemSubtotal?: number;
  shippingFee?: number;
  totalOverall?: number;
}

// export interface TSocialMediaItem {
//     id?: number;
//     platform?: string;
//     username?: string;
//     url?: string;
//     size?: any;
//     color?: any;
// }

export const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
export const ROUTE_SECRET = process.env.ROUTE_SECRET;

const BASE_NAVIGATION = "/app";

export const COOOKIE_EXPIRY = 100000000000000;

const SESSION_EXPIRY = 10000;

export type Session = AuthResponse & { SESSION_EXPIRY: number };

export type PagedResponse<T> = {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  image: string
  username: string;
  authorities: { authority: string }[];
}

export enum NAVIGATION {
  /*************************** Admin Routes ********************************************/


    ADMIN = "/admindashboard",
    ADMIN_DASHBOARD = `${ADMIN}`,

    // User Management Sub-routes
  ADMIN_USER_MANAGEMENT = `${ADMIN}/usermanagement`,
  ADMIN_USER_MANAGEMENT_ALL_USERS = `${ADMIN}/usermanagement/all-users`,
  ADMIN_USER_MANAGEMENT_ACTIVE_USERS = `${ADMIN}/usermanagement/active-users`,
  ADMIN_USER_MANAGEMENT_INACTIVE_USERS = `${ADMIN}/usermanagement/inactive-users`,
  ADMIN_USER_MANAGEMENT_ACCESS_CONTROL = `${ADMIN}/usermanagement/access-control`,
  ADMIN_USER_MANAGEMENT_RESTRICTIONS = `${ADMIN}/usermanagement/restrictions`,

  // Warehouse Sub-routes
  ADMIN_WAREHOUSE = `${ADMIN}/warehouse`,
  ADMIN_WAREHOUSE_INVENTORY = `${ADMIN}/warehouse/inventory`,
  ADMIN_WAREHOUSE_STORAGE = `${ADMIN}/warehouse/storage`,
  ADMIN_WAREHOUSE_LOCATIONS = `${ADMIN}/warehouse/locations`,
  ADMIN_WAREHOUSE_ACTIVITIES = `${ADMIN}/warehouse/activities`,

  // Shipments Sub-routes
  ADMIN_SHIPMENTS = `${ADMIN}/shipments`,
  ADMIN_SHIPMENTS_ALL = `${ADMIN}/shipments/all`,
  ADMIN_SHIPMENTS_PENDING = `${ADMIN}/shipments/pending`,
  ADMIN_SHIPMENTS_IN_TRANSIT = `${ADMIN}/shipments/in-transit`,
  ADMIN_SHIPMENTS_DELIVERED = `${ADMIN}/shipments/delivered`,
  ADMIN_SHIPMENTS_TRACKING = `${ADMIN}/shipments/tracking`,
  ADMIN_SHIPMENTS_HISTORY = `${ADMIN}/shipments/history`,

  // Payments Sub-routes
  ADMIN_PAYMENTS = `${ADMIN}/payments`,
  ADMIN_PAYMENTS_INVOICES = `${ADMIN}/payments/invoices`,
  ADMIN_PAYMENTS_ALL = `${ADMIN}/payments/all`,
  ADMIN_PAYMENTS_REPORTS = `${ADMIN}/payments/reports`,

  // Notifications Sub-routes
  ADMIN_NOTIFICATIONS = `${ADMIN}/notifications`,
  ADMIN_NOTIFICATIONS_ALERTS = `${ADMIN}/notifications/alerts`,
  ADMIN_NOTIFICATIONS_ALL = `${ADMIN}/notifications/all`,
  ADMIN_NOTIFICATIONS_SETTINGS = `${ADMIN}/notifications/settings`,

  // Reports Sub-routes
  ADMIN_REPORTS = `${ADMIN}/reports`,
  ADMIN_REPORTS_SHIPMENTS = `${ADMIN}/reports/shipments`,
  ADMIN_REPORTS_WAREHOUSE = `${ADMIN}/reports/warehouse`,
  ADMIN_REPORTS_PAYMENTS = `${ADMIN}/reports/payments`,

  ADMIN_SYSTEM = `${ADMIN}/system`,



  // ADMIN = "/admindashboard",
  // ADMIN_BRANDS = `${ADMIN}/management`,
  // ADMIN_CATEGORY = `${ADMIN}/category`,
  // ADMIN_CHANGE_PASSWORD = `${ADMIN}/changepassword`,
  // ADMIN_DASHBOARD = `${ADMIN}/changepassword`,
  // ADMIN_ORDERS = `${ADMIN}/orders`,
  // ADMIN_PRODUCTS = `${ADMIN}/products`,
  // ADMIN_PROFILE = `${ADMIN}/profile`,
  // ADMIN_SELLERS = `${ADMIN}/sellers`,
  // ADMIN_TRANSACTION = `${ADMIN}/transaction`,
  // ADMIN_USERS = `${ADMIN}/users`,

  /*************************** User Dashboard Routes ********************************************/
  USER = "/user",

  USER_INBOX = `${USER}/home`,
  USER_PROFILE = `${USER}/notification`,
  USER_WALLET = `${USER}/orderlist`,
  USER_WISHLIST = `${USER}/profile`,
  USER_MYWALLET = `${USER}/settings`,
  USER_ALLORDERS = `${USER}/trackinglist`,
  USER_BRAND = `${USER}/useraddress`,
  USER_CART = `${USER}/usercustomercare`,
  USER_CHECKOUT = `${USER}/checkout`,
  USER_CONGRAT = `${USER}/userpayment`,
  USER_RECEIPT = `${USER}/usersettings`,


  /*************************** Vendor Routes ********************************************/
  VENDOR = "/vendordashboard",
  VENDOR_BRANDS = `${VENDOR}/brands`,
  VENDOR_CATEGORY = `${VENDOR}/category`,
  VENDOR_CHANGE_PASSWORD = `${VENDOR}/changepassword`,
  VENDOR_DASHBOARD = `${VENDOR}/dashboard`,
  VENDOR_ORDERS = `${VENDOR}/orders`,
  VENDOR_PRODUCTS = `${VENDOR}/products`,
  VENDOR_PROFILE = `${VENDOR}/profile`,
  VENDOR_SELLERS = `${VENDOR}/sellers`,
  VENDOR_TRANSACTION = `${VENDOR}/transaction`,
  VENDOR_USERS = `${VENDOR}/users`,

  /*************************** Public Routes ********************************************/
  LOGIN = `/pages/signin`,
  WELCOME = `/pages/welcome`,
  USERDASHBOARD = '/pages/',
  SIGNUP = `/pages/signup`,
  CHANGE_PASSWORD = `/pages/changepassword`,
  LOCATION = `/pages/location`,
  ABOUT_US = `/pages/aboutus`,
  PRODUCTS = `/pages/products`,
  REVIEWS = `/pages/reviews`,
  SHIPPING = `/pages/shipping`,
  TERMS = `/pages/terms`,
  BRAND = `/pages/brand`,
  DRIVERSWEB = `/pages/driver`,
  DRIVERBUSINESS = `/pages/driver/driverbusiness`,

  DRIVERREGISTRATION = `/pages/driver/driverregistration`,
  DRIVERLOGIN = `/pages/driver/driverlogin`,
  DRIVERDASHBOARDHOME = `/pages/driver/driverdashboard/dashboard`,
  DRIVERDASHBOARDORDERS = `/pages/driver/driverdashboard/orders`,
  DRIVERDASHBOARDDELIVERIES = `/pages/driver/driverdashboard/deliveries`,
  DRIVERDASHBOARDEARNINGS = `/pages/driver/driverdashboard/earnings`,
  DRIVERDASHBOARDPERFORMANCE = `/pages/driver/driverdashboard/performance`,
  DRIVERDASHBOARDVEHICLE = `/pages/driver/driverdashboard/vehicles`,
  DRIVERDASHBOARDHELP = `/pages/driver/driverdashboard/help`,
  DRIVERDASHBOARDSETTINGS = `/pages/driver/driverdashboard/settings`,
  DRIVERDASHBOARDMESSAGES = `/pages/driver/driverdashboard/messages`,

  //CALLBACK ROUTE
  CALLBACK = '/auth/callback',


  /// NEW USER (THIS IS PUBLIC FOR NOW )
  NEWUSERDASHBOARDLOGGEDIN = '/pages/newuser',
  NEWUSERDASHBOARD = '/newuser',
  NEWUSERPACKAGES = `${NEWUSERDASHBOARD}/packages`,
  NEWUSERSHIPPING = `${NEWUSERDASHBOARD}/shipping`,
  NEWUSERSUBSCRIPTION = `${NEWUSERDASHBOARD}/subscription`,
  NEWUSERADDRESS = `${NEWUSERDASHBOARD}/address`,
  NEWUSERTRACKING = `${NEWUSERDASHBOARD}/tracking`,
  NEWUSERHISTORY = `${NEWUSERDASHBOARD}history`,
  NEWUSERSETTINGS = `${NEWUSERDASHBOARD}settings`,


  // Protect Home routes
  HOME = `/home`,
  HOMELOGGEDIN = `/pages/home`,


   /// ADMIN ROUTES (PUBLIC LIKE NEWUSER)
      ADMIN_DASHBOARD_PUBLIC = '/pages/admindashboard',
  ADMIN_USER_MANAGEMENT_PUBLIC = '/pages/admindashboard/usermanagement',
  ADMIN_WAREHOUSE_PUBLIC = '/pages/admindashboard/warehouse',
  ADMIN_SHIPMENTS_PUBLIC = '/pages/admindashboard/shipments',
  ADMIN_PAYMENTS_PUBLIC = '/pages/admindashboard/payments',
  ADMIN_NOTIFICATIONS_PUBLIC = '/pages/admindashboard/notifications',
  ADMIN_SYSTEM_PUBLIC = '/pages/admindashboard/system',

  /*************************** Driver Routes ********************************************/
  DRIVER = "/driverdashboard",

}

export const viewport = "width=device-width, initial-scale=1, user-scalabe=no";

export enum ROLES {
  USER = "USER",
  ADMIN = "ADMIN",
  VENDOR = "VENDOR",
  DRIVER = "DRIVER",
}

export type BaseEntity = {
  createdAt: Date | null;
  createdBy: number | null;
  updatedAt: Date | null;
  updatedBy: number | null;
};

export type RegisterUser = {
  email: string,
  password: string,
  phoneNumber: string,
  firstName: string,
  lastName: string,
  username: string,
  country: string,
  state: string,
  city: string,
  address: string,
  termsAndConditions: string
}

export interface UserType {
  user: UserAside
}


export enum USER_AUTHORITES {
  USER = "USER",
  ADMIN = "ADMIN",
  VENDOR = "VENDOR",
}

export enum ACCOUNT_STATUS {
  APPROVED = "APPROVED",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
  ACCEPTED = "ACCEPTED",
}

export type UserAside = {

  firstName: string;
  lastName: string;
  email: string;
  image: string
};

export type ActionTypes = {
  addUserInfo: (user: UserAside) => void;
  destroyUserInfo: (user: UserAside) => void;
}


// types.ts
// export type PackageStatus = 
//   | 'Received'
//   | 'In Transit'
//   | 'Awaiting Shipment'
//   | 'Unclaimed Item'
//   | 'Consolidated Packages';

// export type TimeFilter = 
//   | '12 Months'
//   | '30 Days'
//   | '7 Days'
//   | 'Today';

// export interface Package {
//   id: string;
//   description: string;
//   vendor: string;
//   destination: string;
//   status: PackageStatus;
//   receivedDate: Date;
//   weight: number;
//   trackingNumber: string;
// }

// export const statusFilters: PackageStatus[] = [
//   'Received',
//   'In Transit',
//   'Awaiting Shipment',
//   'Unclaimed Item',
//   'Consolidated Packages'
// ];

// export const timeFilters: TimeFilter[] = [
//   '12 Months',
//   '30 Days',
//   '7 Days',
//   'Today'
// ];

export interface AddressResponseDTO {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  streetAddress: string;
  postalCode: string;
  defaultShippingAddress: string; // The API returns this as a string "true"/"false"
  city: string;
}

export interface AddressRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  addressType: 'HOME' | 'OFFICE' | 'OTHER';
  streetAddress: string;
  city: string;
  postalCode: string;
  defaultShippingAddress: boolean;
}

export interface AddressCountResponseDTO {
  homeAddresses: number;
  officeAddresses: number;
  otherAddresses: number;
  defaultAddresses: number;
  totalAddresses: number;
  remainingSlots: number;
  maxAllowed: number;
}

export interface UserAddressListResponseDTO {
  addresses: FullAddressDTO[];
  maxAllowed: number;
  total: number;
}

export interface FullAddressDTO {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  addressType: 'HOME' | 'OFFICE' | 'OTHER';
  streetAddress: string;
  postalCode: string;
  createdAt: string;
  updatedAt: string;
  defaultShippingAddress: string; // "true" or "false"
  city: string;
}

export interface AddressUpdateResponseDTO {
  address: FullAddressDTO;
  message: string;
}

export interface AddressDeleteResponseDTO {
  deletedAddress: {
    wasDefault: boolean;
    streetAddress: string;
    id: number;
    city: string;
  };
  remainingAddresses: number;
  maxAllowed: number;
  message: string;
}

export type PackageStatus =
  | 'Received'
  | 'In Transit'
  | 'Awaiting Shipment'
  | 'Unclaimed Item'
  | 'Consolidated Packages';

export type TimeFilter =
  | '12 Months'
  | '30 Days'
  | '7 Days'
  | 'Today';

export interface Package {
  id: string;
  description: string;
  vendor: string;
  destination: string;
  status: PackageStatus;
  receivedDate: Date;
  weight: string;
  trackingNumber: string;
  image?: string; // Add this
  name?: string; // Add this
}

// Define the expected shape of a City object (adjust based on your actual API response)
export interface CityDTO {
    id: number;
    cityName: string;
    stateOrProvince: string;
    countryName: string;
    countryCode: string;
}


export interface CountryDTO {
    id: number;
    countryName: string;
    countryCode: string; // e.g., "NG", "US", "GB"
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    password: string; // The new password chosen by the user
}

export interface UpdateProfileRequest {
    email: string;
    password?: string; // Optional if only updating contact info
    phoneNumber: string;
    firstName: string;
    lastName: string;
    username: string;
    country: string;
    state: string;
    city: string;
    defaultAddress: string;
}

export interface UpdateProfileResponse {
    email: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    username: string;
    country: string;
    state: string;
    city: string;
    defaultAaddress: string;
}

export interface UpdatePasswordRequest {
    password: string; // The new password
}

// types/user.ts

export interface RecentTrackingDTO {
  id: number;
  trackingNumber: string;
  deliveryId: string; // e.g., "PKG-BQ-F4QKen..."
  deliveryStatus: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED'; // Add other known statuses
  numberOfItems: number;
  weight: number;
  amount: number;
  lastUpdated: string; // ISO Date string
  senderName: string;
  receiverName: string;
  originCity: string;
  destinationCity: string;
  addressType: 'HOME' | 'OFFICE' | 'OTHER'
}

// @/types/user.ts (or wherever your types live)

export interface AccountVerifiedViewDTO {
    id: number;
    email: string;
    authorities: string;
    createdAt: string; // LocalDateTime serializes to an ISO string in JSON
    phoneNumber: string;
    verfified: string; // Kept exact spelling from your backend DTO
}