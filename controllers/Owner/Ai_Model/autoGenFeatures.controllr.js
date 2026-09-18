const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// llama-3.1-8b-instant was removed from Groq (404 model_not_found).
// Check https://console.groq.com/docs/models if this one is ever retired too.
const GROQ_MODEL = "openai/gpt-oss-120b";

// ✅ Shared Groq call — returns { text } on success or { status, error } on failure
const askGroq = async (prompt, maxTokens) => {
  // .env stores the Groq key as GROK_API_KEY; GROQ_API_KEY is the standard name
  const apiKey = process.env.GROQ_API_KEY || process.env.GROK_API_KEY;

  if (!apiKey) {
    return { status: 500, error: "GROQ_API_KEY (or GROK_API_KEY) is not configured" };
  }

  const groqResponse = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      // gpt-oss is a reasoning model: reasoning tokens count against the limit, so
      // keep effort low and leave headroom, otherwise the reply comes back empty
      reasoning_effort: "low",
      max_completion_tokens: maxTokens + 1000,
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  // ✅ Check Groq responded correctly
  if (!groqResponse.ok) {
    const errorData = await groqResponse.json().catch(() => null);
    const errorMessage = errorData?.error?.message || `Groq responded with ${groqResponse.status}`;
    console.error("Groq API error:", groqResponse.status, errorMessage);
    return { status: 500, error: errorMessage };
  }

  // ✅ Parse Groq response
  const data = await groqResponse.json();
  const text = data?.choices?.[0]?.message?.content?.trim();

  if (!text) {
    return { status: 500, error: "No content generated" };
  }

  return { text };
};

// ✅ Detailed feature list for the product page (saved into product.features[])
const autoGenrateProductFeatures = async (req, res) => {
  try {
    const { productName } = req.body;

    // ✅ Validation
    if (!productName || productName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    // ✅ Prompt
    const prompt = `You are a product expert writing the features section of an e-commerce product page.

Write the key features of: "${productName}"

Format rules:
- Write exactly 6 to 8 feature points
- Each feature must be around 12 words long
- Each feature should be on a new line
- Each feature should describe one specific capability or benefit
- Keep the tone clear, helpful and factual — do not invent exact specifications
- No bullet points, no numbering, no symbols
- Plain text only`;

    const result = await askGroq(prompt, 400);

    if (result.error) {
      return res.status(result.status).json({
        success: false,
        message: "Groq API error",
        error: result.error,
      });
    }

    // ✅ Return to frontend
    return res.status(200).json({
      success: true,
      productName: productName,
      features: result.text,
    });

  } catch (error) {
    console.error("Auto generate features error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ✅ Short punchy highlights for the product listing page (saved into product.highlights[])
const autoGenrateProductHighlights = async (req, res) => {
  try {
    const { productName } = req.body;

    // ✅ Validation
    if (!productName || productName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    // ✅ Prompt
    const prompt = `You are a product expert. A user is browsing a product listing page
and wants to quickly know the highlights of a product.

Write the key highlights of: "${productName}"

Format rules:
- Write exactly 5 to 7 highlight points
- Each highlight must be exactly 10 words long
- Separate each highlight with a comma (,)
- Each highlight should be on a new line
- Use simple, natural human language like a real person describing it
- Sound excited and helpful, like a salesman showing the product
- No bullet points, no numbering, no symbols
- Plain text only
- Total words should be around 80 to 90 words`;

    const result = await askGroq(prompt, 300);

    if (result.error) {
      return res.status(result.status).json({
        success: false,
        message: "Groq API error",
        error: result.error,
      });
    }

    // ✅ Return to frontend
    return res.status(200).json({
      success: true,
      productName: productName,
      highlights: result.text,
    });

  } catch (error) {
    console.error("Auto generate highlights error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { autoGenrateProductFeatures, autoGenrateProductHighlights };
