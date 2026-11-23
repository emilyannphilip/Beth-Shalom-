export const publicRoutes = {
  "P-01": "/",
  "P-02": "/about-us",
  "P-03": "/rooms",
  "P-04": "/rooms/harmony",
  "P-05": "/rooms/visualizer",
  "P-06": "/facilities",
  "P-07": "/admission-enquiry",
  "P-08": "/contact",
} as const;

export type PublicView = keyof typeof publicRoutes;

export const legacyPublicRoutes: Readonly<Record<string, string>> = {
  home: publicRoutes["P-01"],
  "about-us": publicRoutes["P-02"],
  "about-heritage": publicRoutes["P-02"],
  rooms: publicRoutes["P-03"],
  "living-spaces": publicRoutes["P-03"],
  facilities: publicRoutes["P-06"],
  "admission-inquiry": publicRoutes["P-07"],
  contact: publicRoutes["P-08"],
  "contact-directions": publicRoutes["P-08"],
  "staff-admin-portal": "/portal/login",
  ...Object.fromEntries(
    Object.entries(publicRoutes).map(([id, path]) => [
      `page-${id.toLowerCase()}`,
      path,
    ]),
  ),
};
