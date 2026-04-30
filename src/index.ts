import { defineAgent, getEnvString } from "@lifetimesoft/agent-sdk"

export interface VideoTimelapseInput {
    image_url: string
    product: string
    description: string
    category: "home" | "furniture"
}

interface VideoTimelapseOutput {
    video_url: string
    status: "completed" | "failed"
    product: string
    category: string
}

export default defineAgent<VideoTimelapseInput, VideoTimelapseOutput>({
    async run(ctx) {
        const { image_url, product, description, category } = ctx.input

        ctx.log.info(`[video-timelapse-agent] Starting for product: ${product} (${category})`)
        ctx.log.info(`[video-timelapse-agent] Source image: ${image_url}`)

        const aiModel = getEnvString(ctx.env, "ai_model", "gemini-2.0-flash-exp")

        // Step 1: Generate "before" image prompt
        ctx.log.info("[Step 1] Generating before image...")
        const beforePrompt = await ctx.ai.chat({
            messages: [
                {
                    role: "system",
                    content: `You are an interior design AI. Generate a concise image generation prompt for a "before" scene — the original state before any product or decoration is applied. Keep it under 100 words.`,
                },
                {
                    role: "user",
                    content: `Product: ${product}\nDescription: ${description}\nCategory: ${category}\nOriginal image URL: ${image_url}`,
                },
            ],
            model: aiModel,
        })
        ctx.log.info("[Step 1] Before prompt:", beforePrompt)

        // Step 2: Generate "after" image prompt
        ctx.log.info("[Step 2] Generating after image...")
        const afterPrompt = await ctx.ai.chat({
            messages: [
                {
                    role: "system",
                    content: `You are an interior design AI. Generate a concise image generation prompt for an "after" scene — showing the space transformed with the product applied. Keep it under 100 words.`,
                },
                {
                    role: "user",
                    content: `Product: ${product}\nDescription: ${description}\nCategory: ${category}\nBefore scene: ${beforePrompt}`,
                },
            ],
            model: aiModel,
        })
        ctx.log.info("[Step 2] After prompt:", afterPrompt)

        // Step 3: Create timelapse video (before → after) 9:16
        ctx.log.info("[Step 3] Creating 9:16 timelapse video (before → after)...")

        // TODO: integrate with image generation + video rendering service
        const videoUrl = ""

        ctx.log.info("[video-timelapse-agent] Done.")

        return {
            video_url: videoUrl,
            status: "completed",
            product,
            category,
        }
    },
})
