// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/session";
import { cookies } from "next/headers";
import { NAVIGATION, ROLES, Session } from "./types/user/index";

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // 1. STRICTLY PUBLIC ROUTES ONLY
  const publicRoutes = [
    // Authentication
    NAVIGATION.LOGIN?.toString(), 
    NAVIGATION.WELCOME?.toString(),
    NAVIGATION.SIGNUP?.toString(), 
    NAVIGATION.CHANGE_PASSWORD?.toString(), 
    NAVIGATION.CALLBACK?.toString(),
    
    // Fallback static strings just in case the ENUMs fail
    "/pages/signin",
    "/pages/signup",
    "/pages/welcome",
    
    // Marketing & Info Pages
    NAVIGATION.ABOUT_US?.toString(),
    NAVIGATION.PRODUCTS?.toString(), 
    NAVIGATION.REVIEWS?.toString(), 
    NAVIGATION.SHIPPING?.toString(),
    NAVIGATION.TERMS?.toString(), 
    NAVIGATION.BRAND?.toString(), 
    
    // Driver Public Entry Pages
    NAVIGATION.DRIVERSWEB?.toString(), 
    NAVIGATION.DRIVERLOGIN?.toString(), 
    NAVIGATION.DRIVERREGISTRATION?.toString(), 
    NAVIGATION.DRIVERBUSINESS?.toString(),
  ].filter(Boolean); // Filters out any undefined values

  // 2. Redirect Root to Login (If that is your intended app behavior)
  if (path === "/") {
    return NextResponse.redirect(new URL(NAVIGATION.WELCOME || "/pages/welcome", req.nextUrl));
  }

  // 3. Allow Access to Public Routes
  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }

  // =====================================================================
  // EVERYTHING BELOW THIS LINE STRICTLY REQUIRES A VALID LOGGED-IN SESSION
  // =====================================================================

  // 4. Check for session cookie
  const cookieStore = await cookies();
  const cookie = cookieStore.get("session")?.value;

  if (!cookie) {
    return NextResponse.redirect(new URL(NAVIGATION.LOGIN || "/pages/welcome", req.nextUrl));
  }

  // 5. Decrypt session securely
  let session: Session | null = null;
  try {
    session = await decrypt(cookie);
  } catch (error) {
    // If token is invalid/expired, force re-login
    return NextResponse.redirect(new URL(NAVIGATION.LOGIN || "/pages/welcome", req.nextUrl));
  }

  // 6. Validate user authorities/roles exist
  if (!session?.authorities || session.authorities.length === 0) {
    return NextResponse.redirect(new URL(NAVIGATION.LOGIN || "/pages/welcome", req.nextUrl));
  }

  const userRole = session.authorities[0]?.authority;

  // 7. ROLE-BASED ACCESS CONTROL (RBAC)

  // Driver Dashboard Protection
  const isDriverProtectedRoute = path.startsWith(NAVIGATION.DRIVER?.toString() || '/driver');
  if (isDriverProtectedRoute && userRole !== ROLES.DRIVER) {
    return NextResponse.redirect(new URL(NAVIGATION.LOGIN || "/pages/welcome", req.nextUrl));
  }

  // Vendor Dashboard Protection
  const isVendorProtectedRoute = path.startsWith(NAVIGATION.VENDOR?.toString() || '/vendor');
  if (isVendorProtectedRoute && userRole !== ROLES.VENDOR) {
    return NextResponse.redirect(new URL(NAVIGATION.LOGIN || "/pages/welcome", req.nextUrl));
  }

  // User Dashboard Protection (Protecting /newuser, /user routes)
  const isUserProtectedRoute = path.startsWith(NAVIGATION.NEWUSERDASHBOARD?.toString() || '/newuser') || path.startsWith('/user');
  if (isUserProtectedRoute && userRole !== ROLES.USER) {
    return NextResponse.redirect(new URL(NAVIGATION.LOGIN || "/pages/welcome", req.nextUrl));
  }

  // Admin Dashboard Protection 
  // (Assuming you have a ROLES.ADMIN. If not, this at least ensures they are authenticated. 
  // Update `ROLES.ADMIN` if your enum uses a different key).
  if (path.startsWith('/pages/admindashboard') && userRole !== ROLES.ADMIN) {
     return NextResponse.redirect(new URL(NAVIGATION.LOGIN || "/pages/welcome", req.nextUrl));
  }

  // If they passed all checks, grant access to the requested protected route
  return NextResponse.next();
}

// Config to ignore static files and API routes from middleware checks
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.png$|.*\\.svg$|.*\\.gif$).*)",
  ],
};




// // middleware.ts
// import { NextRequest, NextResponse } from "next/server";
// import { decrypt } from "./lib/session";
// import { cookies } from "next/headers";
// import { NAVIGATION, ROLES, Session } from "./types/user/index";

// export default async function middleware(req: NextRequest) {
//   // Get path
//   const path = req.nextUrl.pathname;

//   const publicRoutes = [
//     // Authentication & Public Pages
//     NAVIGATION.LOGIN.toString(), 
//     NAVIGATION.SIGNUP.toString(), 
//     NAVIGATION.CHANGE_PASSWORD.toString(), 
//     NAVIGATION.ABOUT_US.toString(),
//     NAVIGATION.PRODUCTS.toString(), 
//     NAVIGATION.REVIEWS.toString(), 
//     NAVIGATION.SHIPPING.toString(),
//     NAVIGATION.TERMS.toString(), 
//     NAVIGATION.BRAND.toString(), 
//     // NAVIGATION.HOME.toString(),
//     NAVIGATION.HOMELOGGEDIN.toString(),

//     // CALLBACK
//     NAVIGATION.CALLBACK.toString(),
    
//     // Driver Public Routes
//     NAVIGATION.DRIVERSWEB.toString(), 
//     NAVIGATION.DRIVERLOGIN.toString(), 
//     NAVIGATION.DRIVERREGISTRATION.toString(), 
//     NAVIGATION.DRIVERBUSINESS.toString(),
    
//     // Driver Dashboard Routes (Public)
//     NAVIGATION.DRIVERDASHBOARDHOME.toString(), 
//     NAVIGATION.DRIVERDASHBOARDORDERS.toString(), 
//     NAVIGATION.DRIVERDASHBOARDDELIVERIES.toString(),
//     NAVIGATION.DRIVERDASHBOARDEARNINGS.toString(), 
//     NAVIGATION.DRIVERDASHBOARDPERFORMANCE.toString(), 
//     NAVIGATION.DRIVERDASHBOARDMESSAGES.toString(), 
//     NAVIGATION.DRIVERDASHBOARDVEHICLE.toString(),
//     NAVIGATION.DRIVERDASHBOARDHELP.toString(), 
//     NAVIGATION.DRIVERDASHBOARDSETTINGS.toString(),
    
//     // User Routes (Public)
//     NAVIGATION.USER.toString(),
//     NAVIGATION.USER_INBOX.toString(),
//     NAVIGATION.USER_PROFILE.toString(),
//     NAVIGATION.USER_WALLET.toString(),
//     NAVIGATION.USER_WISHLIST.toString(),
//     NAVIGATION.USER_MYWALLET.toString(),
//     NAVIGATION.USER_ALLORDERS.toString(),
//     NAVIGATION.USER_BRAND.toString(),
//     NAVIGATION.USER_CART.toString(),
//     NAVIGATION.USER_CHECKOUT.toString(),
//     NAVIGATION.USER_CONGRAT.toString(),
//     NAVIGATION.USER_RECEIPT.toString(),
    
//     // NEW USER ROUTES (PUBLIC)
//     NAVIGATION.NEWUSERDASHBOARD.toString(),
//     NAVIGATION.NEWUSERPACKAGES.toString(),
//     NAVIGATION.NEWUSERSHIPPING.toString(),
//     NAVIGATION.NEWUSERSUBSCRIPTION.toString(),
//     NAVIGATION.NEWUSERADDRESS.toString(),
//     NAVIGATION.NEWUSERTRACKING.toString(),
//     NAVIGATION.NEWUSERHISTORY.toString(),
//     NAVIGATION.NEWUSERSETTINGS.toString(),
    
//     // ALL ADMIN ROUTES ARE NOW PUBLIC
//     NAVIGATION.ADMIN_DASHBOARD_PUBLIC.toString(),
//     NAVIGATION.ADMIN_USER_MANAGEMENT_PUBLIC.toString(),
//     NAVIGATION.ADMIN_WAREHOUSE_PUBLIC.toString(),
//     NAVIGATION.ADMIN_SHIPMENTS_PUBLIC.toString(),
//     NAVIGATION.ADMIN_PAYMENTS_PUBLIC.toString(),
//     NAVIGATION.ADMIN_NOTIFICATIONS_PUBLIC.toString(),
//     NAVIGATION.ADMIN_SYSTEM_PUBLIC.toString(),
//     NAVIGATION.ADMIN_REPORTS.toString(),
    
//     // ADMIN SUB-ROUTES (PUBLIC)
//     // User Management Sub-routes
//     NAVIGATION.ADMIN_USER_MANAGEMENT_ALL_USERS.toString(),
//     NAVIGATION.ADMIN_USER_MANAGEMENT_ACTIVE_USERS.toString(),
//     NAVIGATION.ADMIN_USER_MANAGEMENT_INACTIVE_USERS.toString(),
//     NAVIGATION.ADMIN_USER_MANAGEMENT_ACCESS_CONTROL.toString(),
//     NAVIGATION.ADMIN_USER_MANAGEMENT_RESTRICTIONS.toString(),

//     // Warehouse Sub-routes
//     NAVIGATION.ADMIN_WAREHOUSE_INVENTORY.toString(),
//     NAVIGATION.ADMIN_WAREHOUSE_STORAGE.toString(),
//     NAVIGATION.ADMIN_WAREHOUSE_LOCATIONS.toString(),
//     NAVIGATION.ADMIN_WAREHOUSE_ACTIVITIES.toString(),

//     // Shipments Sub-routes
//     NAVIGATION.ADMIN_SHIPMENTS_ALL.toString(),
//     NAVIGATION.ADMIN_SHIPMENTS_PENDING.toString(),
//     NAVIGATION.ADMIN_SHIPMENTS_IN_TRANSIT.toString(),
//     NAVIGATION.ADMIN_SHIPMENTS_DELIVERED.toString(),
//     NAVIGATION.ADMIN_SHIPMENTS_TRACKING.toString(),
//     NAVIGATION.ADMIN_SHIPMENTS_HISTORY.toString(),

//     // Payments Sub-routes
//     NAVIGATION.ADMIN_PAYMENTS_INVOICES.toString(),
//     NAVIGATION.ADMIN_PAYMENTS_ALL.toString(),
//     NAVIGATION.ADMIN_PAYMENTS_REPORTS.toString(),

//     // Notifications Sub-routes
//     NAVIGATION.ADMIN_NOTIFICATIONS_ALERTS.toString(),
//     NAVIGATION.ADMIN_NOTIFICATIONS_ALL.toString(),
//     NAVIGATION.ADMIN_NOTIFICATIONS_SETTINGS.toString(),

//     // Reports Sub-routes
//     NAVIGATION.ADMIN_REPORTS_SHIPMENTS.toString(),
//     NAVIGATION.ADMIN_REPORTS_WAREHOUSE.toString(),
//     NAVIGATION.ADMIN_REPORTS_PAYMENTS.toString(),
//   ];

//   /* Define Protected Routes By User Roles */
//   const isVendorProtectedRoute = path.startsWith(NAVIGATION.VENDOR);
//   const isDriverProtectedRoute = path.startsWith(NAVIGATION.DRIVER);
//   const isUserProtectedRoute = path.startsWith(NAVIGATION.NEWUSERDASHBOARD);

//   // If on empty path - Go to Login page
//   if (path == "/") {
//     return NextResponse.redirect(new URL(NAVIGATION.LOGIN, req.nextUrl));
//   }

//   // If it's a public route OR any admin route, allow access
//   if (publicRoutes.includes(path) || path.startsWith('/pages/admindashboard')) {
//     return NextResponse.next();
//   }

//   // 3. Decrypt the session gotten from the cookie
//   const cookie = (await cookies()).get("session")?.value!;

//   // 4. If no cookie found, redirect to /login page
//   if (!cookie) {
//     return NextResponse.redirect(new URL("/pages/signin", req.nextUrl));
//   }

//   // Retrieve session
//   let session: Session | null = null;

//   try {
//     session = await decrypt(cookie);
//   } catch (error) {
//     // Redirect to login to create new session
//     return NextResponse.redirect(new URL("/pages/signin", req.nextUrl));
//   }

//   // Check if user has any authorities
//   if (!session?.authorities || session.authorities.length === 0) {
//     return NextResponse.redirect(new URL("/pages/signin", req.nextUrl));
//   }

//   const userRole = session.authorities[0]?.authority;

//   // Redirect to /login if the user is not authenticated or user is not a driver for driver routes
//   if (
//     isDriverProtectedRoute &&
//     (!session || userRole != ROLES.DRIVER)
//   ) {
//     return NextResponse.redirect(new URL("/pages/signin", req.nextUrl));
//   }

//   // Redirect to /login if the user is not authenticated or user is not a vendor for vendor routes
//   if (
//     isVendorProtectedRoute &&
//     (!session || userRole != ROLES.VENDOR)
//   ) {
//     return NextResponse.redirect(new URL("/pages/signin", req.nextUrl));
//   }

//   // Redirect to /login if the user is not authenticated or user is not a vendor for vendor routes
//   if (
//     isUserProtectedRoute &&
//     (!session || userRole != ROLES.USER)
//   ) {
//     return NextResponse.redirect(new URL("/pages/signin", req.nextUrl));
//   }

//   // Redirect to /login if the user is not authenticated or user is not a user for user routes
//   // (This covers any remaining user-specific routes not in publicRoutes)
//   if (
//     path.startsWith('/user') && 
//     (!session || userRole != ROLES.USER)
//   ) {
//     return NextResponse.redirect(new URL("/pages/signin", req.nextUrl));
//   }

//   if (
//     path.startsWith('/newuser') && 
//     (!session || userRole != ROLES.USER)
//   ) {
//     return NextResponse.redirect(new URL("/pages/signin", req.nextUrl));
//   }

//   // Successful authentication, continue on path
//   return NextResponse.next();
// }

// // Allow images and SVGs
// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|.*\\.png$|.*\\.svg$|.*\\.gif$).*)",
//   ],
//   // runtime: 'nodejs',
// };