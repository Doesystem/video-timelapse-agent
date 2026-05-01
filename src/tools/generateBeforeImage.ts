import type { Context } from "@lifetimesoft/agent-sdk"

export type Category = "home" | "furniture"

export interface GenerateBeforeImageInput {
    image_url: string   // after image (reference) — พื้นหลังต้องเหมือนนี้
    product: string
    description: string
    category: Category
}

export interface GeneratedImage {
    prompt: string
    image_url: string
}

// ─── Image Prompt Templates by Category ──────────────────────────────────────
// Build prompt directly — no need to call chat() as an intermediate step.
// Templates are fixed per category; dynamic parts come from input fields.

function buildBeforePrompt(input: GenerateBeforeImageInput): string {
    switch (input.category) {
        case "furniture":
            // Remove all furniture/decor, keep room background identical to reference
            return [
                `Empty room interior, no furniture, no decorations, no objects,`,
                `bare floor and walls only,`,
                `same room layout and architectural features as reference image,`,
                `same wall color, same floor material, same lighting direction, same camera angle,`,
                `same windows and doors,`,
                `clean empty space ready for staging,`,
                `realistic interior photo, 9:16 vertical portrait`,
            ].join(" ")

        case "home":
            // Remove entire building, keep land/environment identical to reference
            return [
                `Empty plot of land, no building, no house, no structure,`,
                `bare ground only,`,
                `same surrounding environment as reference image,`,
                `same sky, same trees and landscape, same ground level, same lighting, same camera angle,`,
                `empty construction site or undeveloped land,`,
                `realistic outdoor photo, 9:16 vertical portrait`,
            ].join(" ")
    }
}

// ─── Tool ─────────────────────────────────────────────────────────────────────

export async function generateBeforeImage(
    input: GenerateBeforeImageInput,
    ctx: Context
): Promise<GeneratedImage> {
    ctx.log.info(`[generateBeforeImage] category: ${input.category}, product: ${input.product}`)

    // Build prompt directly from template — no chat() call needed
    const beforePrompt = buildBeforePrompt(input)
    ctx.log.info(`[generateBeforeImage] prompt: ${beforePrompt}`)

    // Generate the before image — pass the after image as reference for background matching
    const generatedImageUrl = await ctx.ai.image({
        prompt: beforePrompt,
        size: "1024x1792",   // 9:16 portrait
        image_url: input.image_url,
    })

    ctx.log.info(`[generateBeforeImage] done — image_url: ${generatedImageUrl}`)

    return {
        prompt: beforePrompt,
        image_url: generatedImageUrl,
    }
}
