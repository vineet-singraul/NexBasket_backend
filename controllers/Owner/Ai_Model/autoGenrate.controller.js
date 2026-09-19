const { text } = require("express");

const LENGTH_OPTIONS = {
  short: { words: 50, maxOutputTokens: 150 },
  long: { words: 80, maxOutputTokens: 220 },
  extralong: { words: 120, maxOutputTokens: 300 },
};

const generateShortDescription = async (req, res) => {
  try {
    const { productName, length } = req.params;

    // Validation
    if (!productName || productName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    const normalizedLength = (length || "")
      .toLowerCase()
      .replace(/[^a-z]/g, "");
    const lengthConfig = LENGTH_OPTIONS[normalizedLength];

    if (!lengthConfig) {
      return res.status(400).json({
        success: false,
        message: "Length must be one of: Short, Long, Extra Long",
      });
    }

    const prompt = `You are a professional e-commerce copywriter. Write a compelling product description for the following product in exactly ${lengthConfig.words} words. Focus on key features, benefits, and what makes it appealing to a buyer. Keep the tone persuasive but factual — no exaggeration, no fake claims. Do not repeat the product name unnecessarily.\n\nProduct: ${productName}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.9,
            topP: 0.9,
            maxOutputTokens: lengthConfig.maxOutputTokens,
          },
        }),
      },
    );

    const data = await response.json();

    // Agar Gemini se error aaya
    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: data?.error?.message || "Failed to generate description",
      });
    }

    const description = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!description) {
      return res.status(500).json({
        success: false,
        message: "No description generated",
      });
    }

    return res.status(200).json({
      success: true,
      description: description.trim(),
    });
  } catch (error) {
    console.error("Error generating description:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while generating description",
    });
  }
};

const generateSpecificationOfProduct = async (req, res) => {
  try {
    const { productName } = req.params;

    if (!productName || productName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    const prompt = `
        Generate exactly 30 important specifications for this product:

        Product: ${productName}

        Rules:
        - Return exactly 30 specification objects.
        - Every object must contain exactly these 3 fields:
          name, value, unit
        - "name" must be the specification name.
        - "value" must contain the specification value.
        - "unit" must contain the unit if applicable.
        - If a specification has no unit, use an empty string.
        - Do not return product description.
        - Do not return explanations.
        - Do not use markdown.
        - Do not invent random specifications unrelated to the product.
        - Prefer important technical/product specifications.
        `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],

          generationConfig: {
            response_mime_type: "application/json",

            response_schema: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                  },
                  value: {
                    type: "string",
                  },
                  unit: {
                    type: "string",
                  },
                },
                required: ["name", "value", "unit"],
              },
            },

            maxOutputTokens: 2000,
          },
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", data);

      return res.status(response.status).json({
        success: false,
        message:
          data?.error?.message || "Failed to generate product specifications",
      });
    }

    const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return res.status(500).json({
        success: false,
        message: "No specifications generated",
      });
    }

    let specifications;

    try {
      specifications = JSON.parse(generatedText);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Gemini Response:", generatedText);

      return res.status(500).json({
        success: false,
        message: "Gemini returned invalid JSON",
      });
    }

    if (!Array.isArray(specifications)) {
      return res.status(500).json({
        success: false,
        message: "Invalid specification format",
      });
    }

    // Keep only required fields
    specifications = specifications.map((spec) => ({
      name: String(spec?.name ?? ""),
      value: String(spec?.value ?? ""),
      unit: String(spec?.unit ?? ""),
    }));

    if (specifications.length !== 30) {
      return res.status(500).json({
        success: false,
        message: `Expected 30 specifications but received ${specifications.length}`,
        specifications,
      });
    }

    return res.status(200).json({
      success: true,
      productName,
      count: specifications.length,
      specifications,
    });
  } catch (error) {
    console.error("Error generating specifications:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while generating specifications",
    });
  }
};

const autoGenrateSeoOrProductMnageMnet = async (req, res) => {
  try {
    const { productName } = req.params;
    if (!productName || productName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    const prompt = `You are a professional SEO expert and copywriter for an e-commerce platform.
          Given the product name: "${productName}"
          Generate the following 4 SEO elements professionally:

          1. META TITLE: Write a compelling, keyword-rich meta title. Max 60 characters. Include product name + key feature + brand if possible.

          2. META DESCRIPTION: Write a professional meta description that drives clicks. Max 155 characters. Include main features, benefits, and a call to action.

          3. SEARCH KEYWORDS: Generate 10 highly relevant SEO search keywords/phrases that customers would search for this product. Comma separated.

          4. TAGS: Generate 10 short product tags for e-commerce filtering and categorization.

          Return ONLY a valid JSON object with exactly these 4 keys: metaTitle, metaDescription, searchKeywords, tags.
          - searchKeywords must be an array of 10 strings
          - tags must be an array of 10 strings
          - metaTitle must be a string (max 60 chars)
          - metaDescription must be a string (max 155 chars)`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],

          generationConfig: {
            response_mime_type: "application/json",

            response_schema: {
              type: "object",
              properties: {
                metaTitle: {
                  type: "string",
                  description: "SEO meta title max 60 characters",
                },
                metaDescription: {
                  type: "string",
                  description: "SEO meta description max 155 characters",
                },
                searchKeywords: {
                  type: "array",
                  description: "10 SEO search keywords",
                  items: {
                    type: "string",
                  },
                },
                tags: {
                  type: "array",
                  description: "10 short product tags",
                  items: {
                    type: "string",
                  },
                },
              },
              required: [
                "metaTitle",
                "metaDescription",
                "searchKeywords",
                "tags",
              ],
            },

            maxOutputTokens: 2000,
          },
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", data);

      return res.status(response.status).json({
        success: false,
        message: data?.error?.message || "Failed to generate SEO details",
      });
    }

    const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return res.status(500).json({
        success: false,
        message: "No SEO details generated",
      });
    }

    let result;

    try {
      result = JSON.parse(generatedText);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Gemini Response:", generatedText);

      return res.status(500).json({
        success: false,
        message: "Gemini returned invalid JSON",
      });
    }

    return res.status(200).json({
      success: true,
      productName,
      metaTitle: String(result?.metaTitle ?? ""),
      metaDescription: String(result?.metaDescription ?? ""),
      searchKeywords: Array.isArray(result?.searchKeywords)
        ? result.searchKeywords.map(String)
        : [],
      tags: Array.isArray(result?.tags) ? result.tags.map(String) : [],
    });
  } catch (error) {
    console.error("Error generating SEO details:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while generating SEO details",
    });
  }
};

module.exports = { generateShortDescription, generateSpecificationOfProduct, autoGenrateSeoOrProductMnageMnet };
