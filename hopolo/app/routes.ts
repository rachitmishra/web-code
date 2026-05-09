import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("../src/pages/Home/index.ts"),
  route("product/:id", "../src/pages/ProductDetail.tsx"),
  route("cart", "../src/pages/Cart.tsx"),
  route("login", "../src/pages/Login.tsx"),
  route("logout", "../src/pages/Logout.tsx"),
  route("checkout", "../src/pages/Checkout.tsx"),
  route("checkout/success/:orderId", "../src/pages/Success.tsx"),
  
  // Info Pages
  route("about", "../src/pages/Static/InfoPages.tsx", { id: "about" }),
  route("shipping", "../src/pages/Static/InfoPages.tsx", { id: "shipping" }),
  route("contact", "../src/pages/Static/InfoPages.tsx", { id: "contact" }),
  
  // New Dynamic Static Pages
  route("archive", "../src/pages/StaticPage.tsx"),
  route("stockists", "../src/pages/StaticPage.tsx"),
  route("legal/privacy", "../src/pages/StaticPage.tsx"),
  route("legal/terms", "../src/pages/StaticPage.tsx"),
  
  route("profile", "../src/pages/Profile.tsx"),
  route("maintenance", "../src/pages/Static/Maintenance.tsx"),
  
  // Admin Routes
  route("admin", "../src/components/layout/AdminLayout.tsx", [
    index("../src/pages/Admin/Orders.tsx", { id: "admin-index" }),
    route("orders", "../src/pages/Admin/Orders.tsx", { id: "admin-orders-list" }),
    route("orders/:id", "../src/pages/Admin/OrderDetail.tsx"),
    route("email-logs", "../src/pages/Admin/EmailLogs.tsx"),
    route("inventory", "../src/pages/Admin/Inventory.tsx"),
    route("marketing", "../src/pages/Admin/Marketing.tsx"),
    route("seed", "../src/pages/Admin/SeedData.tsx"),
    route("analytics", "../src/pages/Admin/Analytics.tsx"),
    route("invitations", "../src/pages/Admin/Invitations.tsx"),
    route("storefront", "../src/pages/Admin/Storefront.tsx"),
    route("pdp", "../src/pages/Admin/PDPManager.tsx"),
    route("upload", "../src/pages/Admin/Upload.tsx"),
  ]),
] satisfies RouteConfig;
