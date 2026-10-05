const checkCategortExiste = async (
  userWrittenCategory,
  existCategory,
) => {
  const prompt = `
        You are an advanced e-commerce category validation engine.

        Your task is to determine whether a NEW CATEGORY entered by an administrator
        can be created as a TOP-LEVEL CATEGORY when a list of EXISTING TOP-LEVEL
        CATEGORIES already exists in the database.

        You must work dynamically for ANY category type.

        Do NOT assume specific categories such as Electronics, Grocery, Furniture,
        Office, Fashion, etc.

        The category names can represent any product domain.

        ==================================================
        NEW CATEGORY
        ==================================================

        "${userWrittenCategory}"

        ==================================================
        EXISTING TOP-LEVEL CATEGORIES
        ==================================================

        ${JSON.stringify(existCategory)}

        ==================================================
        CORE RULE
        ==================================================

        A new category must NOT be created if it is:

        1. The same as an existing category.
        2. A spelling variation of an existing category.
        3. A singular/plural variation.
        4. A synonym of an existing category.
        5. A broader version of an existing category.
        6. A narrower version of an existing category.
        7. A child/subcategory of an existing category.
        8. A product type that naturally belongs inside an existing category.
        9. A subtype or specialization of an existing category.
        10. A strongly semantically related category that would logically belong
            under an existing top-level category.

        The purpose is to prevent administrators from creating a second TOP-LEVEL
        category when the new category should logically belong inside an existing
        top-level category.

        ==================================================
        IMPORTANT SEMANTIC RULE
        ==================================================

        Do NOT only compare the words.

        Understand the real-world meaning of the categories.

        For example, if an existing category represents a broad product domain and
        the new category represents a product type normally sold or classified under
        that domain, the new category should be rejected as a top-level category.

        This rule must work dynamically for ANY domain.

        Do NOT hard-code category-specific relationships.

        ==================================================
        PARENT → CHILD RELATIONSHIP
        ==================================================

        Determine whether:

        Existing Category
                ↓
        New Category

        would naturally form a parent → child relationship.

        If YES, reject the new category as a top-level category.

        ==================================================
        CATEGORY OVERLAP
        ==================================================

        Also reject the new category if customers would reasonably expect it to be
        classified under an existing category.

        The new category should be rejected when it would create:

        - duplicate classification
        - overlapping classification
        - redundant category structure
        - confusing category navigation
        - parent/child category conflict
        - product-type/category conflict

        ==================================================
        DO NOT OVER-REJECT
        ==================================================

        Do NOT reject a category merely because:

        - it is used with an existing category
        - it is purchased by the same type of customer
        - it belongs to the same broad marketplace
        - it has a weak conceptual relationship
        - one word happens to be similar

        There must be a meaningful semantic relationship.

        ==================================================
        IMPORTANT CATEGORY-LEVEL RULE
        ==================================================

        The EXISTING CATEGORIES represent TOP-LEVEL categories.

        Therefore, if the NEW CATEGORY is naturally a subcategory, product type,
        subtype, specialization, or child of an existing top-level category,
        return:

        allowed: false

        Even if the names are completely different.

        For example, semantic reasoning must be able to identify relationships such as:

        Existing broad category
                ↓
        New specific product category

        without relying on keyword matching.

        ==================================================
        CHECK ALL EXISTING CATEGORIES
        ==================================================

        Compare the new category against EVERY category in the provided list.

        Do not stop after checking only the first category.

        Find the strongest semantic match.

        Never invent a category that does not exist in the provided database list.

        ==================================================
        DECISION
        ==================================================

        Return:

        allowed: true

        ONLY if the new category is sufficiently independent and does not naturally
        belong under any existing top-level category.

        Return:

        allowed: false

        if the new category is:

        - duplicate
        - synonym
        - spelling variation
        - singular/plural variation
        - parent
        - child
        - subcategory
        - subtype
        - product type
        - specialization
        - strongly overlapping category
        - naturally belonging under an existing top-level category

        ==================================================
        OUTPUT FORMAT
        ==================================================

        Return ONLY valid JSON.

        Do not return markdown.
        Do not return explanations outside JSON.
        Do not return code fences.

        If allowed:

        {
        "allowed": true,
        "matchedCategory": null,
        "relationship": "none",
        "reason": "The new category is independent from the existing top-level categories.",
        "confidence": 0.94
        }

        If rejected:

        {
        "allowed": false,
        "matchedCategory": "EXACT CATEGORY FROM DATABASE",
        "relationship": "child_category",
        "reason": "The new category naturally belongs under an existing top-level category.",
        "confidence": 0.96
        }

        ==================================================
        ALLOWED RELATIONSHIP VALUES
        ==================================================

        Use exactly one:

        "exact_match"
        "same_category"
        "singular_plural"
        "spelling_variation"
        "synonym"
        "parent_category"
        "child_category"
        "subcategory"
        "product_type"
        "subtype"
        "specialization"
        "semantic_overlap"
        "none"

        ==================================================
        CONFIDENCE
        ==================================================

        Return a number from 0 to 1.

        0.90 - 1.00 = very high confidence
        0.75 - 0.89 = high confidence
        0.50 - 0.74 = moderate confidence
        below 0.50 = low confidence

        ==================================================
        FINAL TASK
        ==================================================

        Analyze the NEW CATEGORY against ALL EXISTING TOP-LEVEL CATEGORIES.

        Determine whether the new category can safely exist as another TOP-LEVEL
        CATEGORY.

        If it naturally belongs inside an existing category, reject it.

        Return ONLY the JSON object.
    `;

  const response = await fetch("https://api.cohere.com/v2/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
    },
    body: JSON.stringify({
      model: "command-a-03-2025",
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: userWrittenCategory,
        },
      ],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Cohere API Error:", data);
    throw new Error(data?.message || "Category validation request failed.");
  }

  const generatedText = (data?.message?.content?.[0]?.text || "")
    .replace(/```json|```/g, "")
    .trim();

  try {
    return JSON.parse(generatedText);
  } catch (parseError) {
    console.error("JSON Parse Error:", parseError);
    console.error("Cohere Response:", generatedText);
    throw new Error("Category validation returned invalid JSON.");
  }
};

module.exports = { checkCategortExiste };
