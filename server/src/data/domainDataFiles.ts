// ========================================
// DOMAIN DATA FILE TYPE
// ========================================
//
// Ye type batata hai ki knowledge base me
// register hone wali har file ke paas
// kaunse fields honge.
// ========================================
export type DomainDataFile = {
  fileName: string;
  category: string;
};

// ========================================
// PROPERTY KNOWLEDGE FILES
// ========================================
//
// Ye sari files:
// load hongi
// ↓
// chunks banenge
// ↓
// embeddings banengi
// ↓
// Pinecone me jayengi
// ========================================
export const domainDataFiles: DomainDataFile[] = [
  {
    fileName: "property-company-profile.md",
    category: "company-profile",
  },

  {
    fileName: "property-faq.md",
    category: "property-faq",
  },

  {
    fileName: "property-legal-guide-india-up.md",
    category: "property-legal-guide",
  },

  {
    fileName: "prayagraj-locations.md",
    category: "property-locations",
  },

  {
    fileName: "prayagraj-flats.md",
    category: "property-flats",
  },

  {
    fileName: "prayagraj-plots.md",
    category: "property-plots",
  },
];
