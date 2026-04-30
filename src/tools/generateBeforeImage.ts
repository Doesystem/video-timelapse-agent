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
    image_url: string   // URL ของภาพ before ที่ generate แล้ว (จาก image gen API)
}

// ─── System Prompts by Category (from skill.md) ───────────────────────────────

const SYSTEM_PROMPT: Record<Category, string> = {
    furniture: `You are an interior design AI that creates image generation prompts.
Your task: create a "before" prompt that shows an EMPTY room with NO furniture.
Rules:
- Remove ALL furniture (sofa, table, chairs, cabinets, shelves, bed, wardrobe)
- Remove ALL decorations (pillows, rugs, plants, artwork, lamps)
- Keep the EXACT same: wall color/material, floor type/color, lighting direction, camera angle, windows/doors/architectural elements
- Always end with: "realistic interior photo, 9:16 vertical"
- Output the prompt only, no explanation`,

    home: `You are an architectural visualization AI that creates image generation prompts.
Your task: create a "before" prompt that shows the EMPTY LAND or SITE with NO building.
Rules:
- Remove the entire building/house/structure completely
- Keep the EXACT same: sky, surrounding environment, trees/landscape, ground level, lighting, camera angle
- Show only the empty plot of land or construction site as it would look before building
- Always end with: "realistic photo, 9:16 vertical"
- Output the prompt only, no explanation`,
}

// ─── Tool ─────────────────────────────────────────────────────────────────────

export async function generateBeforeImage(
    input: GenerateBeforeImageInput,
    ctx: Context
): Promise<GeneratedImage> {
    ctx.log.info(`[generateBeforeImage] category: ${input.category}, product: ${input.product}`)

    // Step 1: Ask AI to build the before prompt based on the after image
    const beforePrompt = await ctx.ai.chat({
        messages: [
            { role: "system", content: SYSTEM_PROMPT[input.category] },
            {
                role: "user",
                content: `Product: ${input.product}
Description: ${input.description}
After image (reference): ${input.image_url}

Generate the "before" image prompt. The background, lighting, and camera angle must match the reference image exactly.`,
            },
        ],
        temperature: 0.3,  // low temp — consistency over creativity
    })

    ctx.log.info(`[generateBeforeImage] prompt: ${beforePrompt}`)

    // Step 2: Call image generation API (TODO: replace with actual API call)
    // const imageUrl = await callImageGenAPI(beforePrompt)
    const imageUrl = ""  // placeholder

    ctx.log.info(`[generateBeforeImage] done — image_url: ${imageUrl || "(placeholder)"}`)

    return {
        prompt: beforePrompt,
        image_url: imageUrl,
    }
}
