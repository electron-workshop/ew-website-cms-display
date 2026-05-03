const FALLBACK = [
  {
    title: "Mautic — Email & Journeys",
    slug: "mautic",
    logo: "/assets/images/logos/mautic.svg",
    text: "Run newsletters and segmented campaigns with an open‑source, GDPR‑friendly stack. Your group gets its own login and can manage subscribers, templates, and automations—no SaaS lock‑in."
  },
  {
    title: "Nextcloud — Files & Collaboration",
    slug: "nextcloud",
    logo: "/assets/images/logos/nextcloud.svg",
    text: "Secure cloud storage, document sharing, calendars, and team spaces. Collaborate on docs and keep track of assets in a privacy‑respecting home for your group."
  },
  {
    title: "Matomo — Privacy‑First Analytics",
    slug: "matomo",
    logo: "/assets/images/logos/matomo.svg",
    text: "Understand your website traffic without handing data to third parties. Configured for consent‑aware, responsible insights across your pages."
  },
  {
    title: "Shared Hosting & Maintenance",
    slug: "hosting",
    logo: "",
    text: "Skip the overhead. We host, patch, and monitor the stack so small groups don’t have to. You focus on your mission—we handle the boring parts."
  },
  {
    title: "Onboarding & Support",
    slug: "onboarding",
    logo: "",
    text: "We help you migrate lists, import files, and get your first campaigns and spaces set up. Friendly support when you need it."
  },
  {
    title: "Community Network Benefits",
    slug: "community-network",
    logo: "",
    text: "Be part of a federation of like‑minded groups—shared knowledge, co‑learning, and optional cross‑promotion opportunities."
  },
  {
    title: "Grant Assist",
    slug: "grant-assist",
    logo: "",
    text: "We help you and your collaborators get clarity together on a grant opportunity — using AI tools to strategise and draft, finding the right collaborators within and beyond the network, and identifying auspice or match funding options for a stronger application."
  }
];

module.exports = async function () {
  const base = process.env.STRAPI_URL;
  // DEBUG
  console.error(`[offerings:debug] STRAPI_URL is ${base ? `set to "${base}"` : "NOT set — using fallback"}`);
  if (!base) return FALLBACK;

  const token = process.env.STRAPI_API_TOKEN;
  // DEBUG
  console.error(`[offerings:debug] STRAPI_API_TOKEN is ${token ? "set" : "NOT set"}`);

  const url = `${base}/api/offerings?populate=logo`;
  // DEBUG
  console.error(`[offerings:debug] Fetching: ${url}`);

  try {
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });

    // DEBUG
    console.error(`[offerings:debug] Response status: ${res.status} ${res.statusText}`);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const { data } = await res.json();

    // DEBUG
    console.error(`[offerings:debug] Received ${data.length} item(s) from Strapi`);

    return data.map((item) => ({
      title: item.title,
      slug: item.slug,
      text: item.text,
      logo: item.logo?.url ? `${base}${item.logo.url}` : ""
    }));
  } catch (err) {
    // DEBUG
    console.warn(`[offerings:debug] Fetch error: ${err.message}`);
    console.warn(`[offerings] Strapi fetch failed, using fallback: ${err.message}`);
    return FALLBACK;
  }
};
