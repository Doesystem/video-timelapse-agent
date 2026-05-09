import { defineAgent } from "@lifetimesoft/agent-sdk"
import { generateBeforeImage } from "./tools/generateBeforeImage"

export interface VideoTimelapseInput {
    image_url: string   // after image — ภาพผลลัพธ์สุดท้าย (บ้านเสร็จ / ห้องมีสินค้าแล้ว)
    product: string
    description: string
    category: "home" | "furniture"
}

interface VideoTimelapseOutput {
    video_url: string
    status: "completed" | "failed"
    product: string
    category: string
    before_prompt: string
    before_image_url: string
    after_image_url: string  // = image_url input
}

export default defineAgent<VideoTimelapseInput, VideoTimelapseOutput>({
    async run(ctx) {
        const input = ctx.input as VideoTimelapseInput | null

        ctx.log.info("[video-timelapse-agent] ctx.input: " + JSON.stringify(ctx.input))

        if (!input?.image_url?.trim()) {
            ctx.log.error("[video-timelapse-agent] Missing required field: image_url")
            return { video_url: "", status: "failed", product: input?.product ?? "", category: input?.category ?? "", before_prompt: "", before_image_url: "", after_image_url: "" }
        }
        if (!input?.category) {
            ctx.log.error("[video-timelapse-agent] Missing required field: category")
            return { video_url: "", status: "failed", product: input?.product ?? "", category: "", before_prompt: "", before_image_url: "", after_image_url: "" }
        }

        const { image_url, product, description, category } = input

        ctx.log.info(`[video-timelapse-agent] Starting for product: ${product} (${category})`)
        ctx.log.info(`[video-timelapse-agent] After image (input): ${image_url}`)

        // Step 1: Generate "before" image — remove everything, keep background
        // after image = image_url (user input), before = generated from it
        ctx.log.info("[Step 1] Generating before image from after reference...")
        const before = await generateBeforeImage({ image_url, product, description, category }, ctx)
        ctx.log.info("[Step 1] response before data: " + JSON.stringify(before))        

        // Step 2: Create timelapse video (before → after) 9:16
        // after_url = image_url (the original input)
        ctx.log.info("[Step 2] Creating 9:16 timelapse video (before → after)...")

        // TODO: integrate with video rendering service
        // const videoUrl = await createTimelapseVideo({ before_url: before.image_url, after_url: image_url })
        const videoUrl = ""

        ctx.log.info("[video-timelapse-agent] Done.")

        return {
            video_url: videoUrl,
            status: "completed",
            product,
            category,
            before_prompt: before.prompt,
            before_image_url: before.image_url,
            after_image_url: image_url,
        }
    },
})
