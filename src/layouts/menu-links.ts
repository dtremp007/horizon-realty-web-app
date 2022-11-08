import { Links } from "./AltMainLayout";

const links: Links[] = [
    { href: "/", label: "Home", isActive: (router) => router.pathname === "/" },
    {
      href: {
        pathname: "/listings",
        query: { view: "map" },
      },
      label: "Mapa",
      isActive: (router) =>
        router.pathname === "/listings" && router.query.view === "map",
    },
    {
      label: "Propiedades",
      containsChildren: true,
      childLinks: [
        {
          href: {
            pathname: "/listings",
            query: { listingType: "CASA" },
          },
          label: "Casas",
          isActive: (router) =>
            "/listings" && router.query.listingType === "CASA",
        },
        {
          href: {
            pathname: "/listings",
            query: { listingType: "BODEGA" },
          },
          label: "Casa Bodegas",
          isActive: (router) =>
            "/listings" && router.query.listingType === "BODEGA",
        },
        {
          href: {
            pathname: "/listings",
            query: { listingType: "APARTMENTS" },
          },
          label: "Apartments",
          isActive: (router) =>
            "/listings" && router.query.listingType === "APARTMENTS",
        },
        {
          href: {
            pathname: "/listings",
            query: { listingType: "LOTES_RESIDENCIALES" },
          },
          label: "Lotes Residenciales",
          isActive: (router) =>
            "/listings" && router.query.listingType === "LOTES_RESIDENCIALES",
        },
        {
          href: {
            pathname: "/listings",
            query: { listingType: "LOTES_COMERCIALES" },
          },
          label: "Lotes Comerciales",
          isActive: (router) =>
            "/listings" && router.query.listingType === "LOTES_COMERCIALES",
        },
        {
          href: {
            pathname: "/listings",
            query: { listingType: "LABORES/RANCHOS" },
          },
          label: "Labores/Ranchos",
          isActive: (router) =>
            "/listings" && router.query.listingType === "LABORES/RANCHOS",
        },
      ],
      isActive: (router) => false,
    },
  ];

  export {}
