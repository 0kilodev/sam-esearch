import { Router, Request, Response } from "express";
import { SamGovClient } from "../../src/sdk/SamGovClient";

const router = Router();

// Help validation of placeholders/blank strings
function isValidApiKey(val: any): boolean {
  if (!val || typeof val !== "string") return false;
  const stripped = val.trim();
  return (
    stripped !== "" &&
    stripped !== "MY_GEMINI_API_KEY" &&
    stripped !== "YOUR_API_KEY" &&
    stripped !== "PLACEHOLDER"
  );
}

// API endpoint to check if SAM_GOV_API_KEY is configured in the server environment
router.get("/config", (req: Request, res: Response) => {
  const hasServerKey = isValidApiKey(process.env.SAM_GOV_API_KEY);
  res.json({ hasServerKey });
});

// API endpoint for SAM.gov entities search proxy
router.get("/entities", async (req: Request, res: Response) => {
  try {
    const {
      uei,
      name,
      state,
      zip,
      page = "0",
      limit = "10"
    } = req.query;

    // Get the client-supplied key from headers if any
    const clientApiKey = req.headers["x-sam-gov-api-key"] || req.headers["x-api-key"];

    // 1. First choice: Server-side environment key (as the default)
    // 2. Second choice: Client manual key from headers (as the fallback)
    let apiKey = "";

    if (isValidApiKey(process.env.SAM_GOV_API_KEY)) {
      apiKey = process.env.SAM_GOV_API_KEY!.trim();
    } else if (isValidApiKey(clientApiKey)) {
      apiKey = (clientApiKey as string).trim();
    }

    if (!apiKey) {
      return res.status(401).json({
        error: "GSA API Key Missing",
        details: "Please click the Settings (gear icon) in the header and paste your GSA SAM.gov Developer Token/API Key. Registration is free and instant."
      });
    }

    // Initialize our official SDK client
    const client = new SamGovClient({ apiKey });

    // Execute robust search via SDK
    console.log(`Executing real SAM.gov query via our official SDK. page=${page}, limit=${limit}`);
    const searchResult = await client.getEntities({
      uei: uei ? String(uei) : undefined,
      name: name ? String(name) : undefined,
      state: state ? String(state) : undefined,
      zip: zip ? String(zip) : undefined,
      page: String(page),
      limit: String(limit)
    });

    res.json(searchResult);
  } catch (e: any) {
    console.error("Internal API server error or SAM.gov SDK error:", e);
    res.status(500).json({ 
      error: "SAM.gov API Exception on Explorer route proxy", 
      details: e?.message || "Internal server exception"
    });
  }
});

export default router;
