import type { Context } from "@lifetimesoft/agent-sdk"
import type { Category } from "./generateBeforeImage"

export interface GenerateTimelapseVideoInput {
    before_url: string  // URL of the "before" image (empty/bare state)
    after_url: string   // URL of the "after" image (finished state)
    category: Category
}

export interface GeneratedVideo {
    prompt: string
    video_url: string
}

// ─── Video Prompt Templates by Category ──────────────────────────────────────

function buildVideoPrompt(category: Category): string {
    switch (category) {
        case "home":
            return [
                "สร้าง VDO timelapse โดยใช้มุมกล้องแบบคงที่",
                "ต้องการให้มีคนงานเข้าไปทำงานก่อสร้าง ตกแต่ง ยกของ มีการนำเครื่องจักรมาใช้งาน",
                "จากรูปที่ 1 จนเสร็จเป็นรูปที่ 2",
            ].join(" ")

        case "furniture":
            return [
                "สร้าง VDO timelapse โดยใช้มุมกล้องแบบคงที่",
                "แสดงการจัดวางและตกแต่งเฟอร์นิเจอร์ในพื้นที่",
                "จากรูปที่ 1 จนเสร็จเป็นรูปที่ 2",
            ].join(" ")
    }
}

// ─── Tool ─────────────────────────────────────────────────────────────────────

export async function generateTimelapseVideo(
    input: GenerateTimelapseVideoInput,
    ctx: Context
): Promise<GeneratedVideo> {
    ctx.log.info(`[generateTimelapseVideo] category: ${input.category}`)
    ctx.log.info(`[generateTimelapseVideo] before_url: ${input.before_url}`)
    ctx.log.info(`[generateTimelapseVideo] after_url: ${input.after_url}`)

    const videoPrompt = buildVideoPrompt(input.category)
    ctx.log.info(`[generateTimelapseVideo] prompt: ${videoPrompt}`)

    const generatedVideoUrl = await ctx.ai.video({
        before_url: input.before_url,
        after_url: input.after_url,
        prompt: videoPrompt,
        aspect_ratio: "9:16",
        duration: 5,
    })

    ctx.log.info(`[generateTimelapseVideo] done — video_url: ${generatedVideoUrl}`)

    return {
        prompt: videoPrompt,
        video_url: generatedVideoUrl,
    }
}
