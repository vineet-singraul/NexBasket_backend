const { text } = require("express");
const { model } = require("mongoose");

const LENGTH_OPTIONS = {
  short: { words: 50, maxOutputTokens: 150 },
  long: { words: 80, maxOutputTokens: 220 },
  extralong: { words: 120, maxOutputTokens: 300 },
};

// This model genrate the Discription
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

// This model genrate the specification
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

// This mode genrate the SEO or Heiglights :
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

// This model check the filled listing details :
const aiAutomaticallyValidateProduct = async (req, res) => {
  try {
    const payload = req.body;

    if (!payload || Object.keys(payload).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Product payload is required",
      });
    }

    const response = await fetch("https://api.cohere.com/v2/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "command-a-03-2025",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are an e-commerce product validator.
          Reply ONLY in JSON format:
          {"isValid": bool, "score": 0-100, "errors": [], "warnings": [], "suggestions": []}`,
          },
          {
            role: "user",
            content: `Validate this product payload: ${JSON.stringify(payload)}`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Cohere API Error:", data);

      return res.status(response.status).json({
        success: false,
        message: data?.message || "Failed to validate product",
      });
    }

    const generatedText = data?.message?.content?.[0]?.text;

    if (!generatedText) {
      return res.status(500).json({
        success: false,
        message: "No validation result generated",
      });
    }

    let result;

    try {   
      result = JSON.parse(generatedText);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Cohere Response:", generatedText);

      return res.status(500).json({
        success: false,
        message: "Cohere returned invalid JSON",
      });
    }

    return res.status(200).json({
      success: true,
      isValid: Boolean(result?.isValid),
      score: Number(result?.score ?? 0),
      errors: Array.isArray(result?.errors) ? result.errors.map(String) : [],
      warnings: Array.isArray(result?.warnings)
        ? result.warnings.map(String)
        : [],
      suggestions: Array.isArray(result?.suggestions)
        ? result.suggestions.map(String)
        : [],
    });
  } catch (error) {
    console.error("Error validating product:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while validating the product",
    });
  }
};

module.exports = {
  generateShortDescription,
  generateSpecificationOfProduct,
  autoGenrateSeoOrProductMnageMnet,
  aiAutomaticallyValidateProduct,
};
