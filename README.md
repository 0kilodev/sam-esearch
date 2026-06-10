# sam-gov-api-client

An industry-standard, fully-typed **SAM.gov System for Award Management (GSA) REST Client & TypeScript SDK**.

This package provides high-performance, plug-and-play wrappers around the official federal SAM.gov v3 APIs, automatically normalizers raw federal structures into clean, type-safe business models (mapping physical locations, NAICS codes, active procurement exclusions, and FAR agency representation clauses).

---

## Key Features

- **🚀 Type-Safe REST Client**: Zero-dependency wrapper for query parametrization and fetch orchestration.
- **🔄 Structural Normalization**: Transforms nested, complex raw GSA structures into highly-cohesive, flat data models.
- **🔒 Security Focused**: Built with flexible local state, preventing standard browser API key exposure when proxying.
- **📚 Dual ESM/CommonJS Bundles**: Compiled with `tsup` for standard modern ES Module imports and legacy CommonJS environments.
- **🛠️ Built-in Type Definitions**: Packed with full `.d.ts` declaration sheets.

---

## Installation

```bash
npm install sam-gov-api-client
```

---

## Quick Start (TypeScript / ES Module)

```typescript
import { SamGovClient } from "sam-gov-api-client";

// Initialize client with your GSA Developer Token key
const client = new SamGovClient({
  apiKey: "YOUR_GSA_SAMGOV_DEVELOPER_KEY"
});

async function runQuery() {
  try {
    const result = await client.getEntities({
      name: "Acme Corporation",
      state: "VA",
      limit: 5
    });

    console.log(`Total Records: ${result.totalRecords}`);
    
    for (const entity of result.entities) {
      console.log(`- ${entity.legalBusinessName} [UEI: ${entity.ueiSAM}]`);
      console.log(`  State: ${entity.coreData?.physicalAddress.stateOrProvinceCode}`);
      console.log(`  Registration Status: ${entity.status}`);
      console.log(`  Has Exclusions: ${entity.exclusionDetails?.hasExclusion ? "⚠️ YES" : "✅ NO"}`);
    }
  } catch (error) {
    console.error("Query failed:", error);
  }
}

runQuery();
```

---

## Options Interface

### `SamGovClientOptions`
Configure target key credentials and API base servers:

| Attribute | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `apiKey` | `string` | `process.env.SAM_GOV_API_KEY` | Your GSA Developer API Key Token (free retrieval from SAM.gov). |
| `baseUrl` | `string` | `https://api.sam.gov/entity-information/v3` | SAM.gov API Gateway server path. |

### `SamGovSearchOptions`
Filter business registration lists on demand:

| Parameter | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `uei` | `string` | Unique Entity Identifier | `SZB9L7X82F43` |
| `name` | `string` | Legal Business Name / Keyword | `Raytheon Technologies` |
| `state` | `string` | State code filters | `CA`, `TX`, `NY` |
| `zip` | `string` | ZIP Postal code filter | `22102` |
| `page` | `number \| string` | Page offset index | `0` |
| `limit` | `number \| string` | Size per query slice | `10` |

---

## Local Building & Development

Compile the standalone SDK library into both CommonJS and modern ES Module target packages with `.d.ts` definitions using `tsup`:

```bash
# Clean and bundle the package into `/dist-package/`
npm run build:package
```

---

## License

MIT
