/**
 * Local development runner — simulates a manual trigger from the platform.
 * Usage: npm run dev:run
 */
import type { Context } from "@lifetimesoft/agent-sdk"
import agent, { type VideoTimelapseInput } from "./index"

// ─── Mock Context ─────────────────────────────────────────────────────────────

let callCount = 0

function createDevContext(
    input: VideoTimelapseInput,
    env: Record<string, unknown> = {}
): Context<VideoTimelapseInput> {
    return {
        input,
        config: {
            agent: "video-timelapse-agent",
            version: "0.0.1",
            scheduler: { type: "none" },
        },
        env: {
            ai_model: "gemini-2.0-flash-exp",
            video_output_format: "mp4",
            ...env,
        },
        ai: {
            chat: async (req) => {
                callCount++
                const systemMsg = req.messages.find(m => m.role === "system")?.content ?? ""
                console.log(`[mock ai] call #${callCount}`)

                // ── before image prompt (generateBeforeImage) — furniture ──────
                if (systemMsg.includes("EMPTY room") && systemMsg.includes("NO furniture")) {
                    return `An empty living room with no furniture, bare hardwood floor, same cream-colored walls, same natural side lighting from left window, same wide-angle perspective, realistic interior photo, 9:16 vertical`
                }

                // ── before image prompt (generateBeforeImage) — home ──────────
                if (systemMsg.includes("EMPTY LAND") && systemMsg.includes("NO building")) {
                    return `An empty plot of land with no building, same surrounding trees and landscape, same sky and natural lighting, same camera angle, realistic photo, 9:16 vertical`
                }

                // Fallback
                return `Mock AI response for: ${systemMsg.slice(0, 60)}...`
            },
        },
        storage: {
            get: async () => null,
            set: async () => {},
            delete: async () => {},
        },
        queue: { push: async () => {} },
        log: {
            info:  (...args: unknown[]) => console.log("[info]", ...args),
            error: (...args: unknown[]) => console.error("[error]", ...args),
            debug: (...args: unknown[]) => console.debug("[debug]", ...args),
        },
        meta: {
            run_id: `dev-run-${Date.now()}`,
            timestamp: Date.now(),
        },
    }
}

// ─── Run ──────────────────────────────────────────────────────────────────────

async function main() {
    // ── Test case 1: category = furniture ────────────────────────────────────
    console.log("\n=== Test case 1: furniture ===")
    callCount = 0
    const ctx1 = createDevContext({
        image_url: "https://example.com/images/living-room-before.jpg",
        product: "โซฟา L-Shape สีเทา",
        description: "โซฟาสไตล์โมเดิร์น เหมาะกับห้องนั่งเล่นขนาดกลาง-ใหญ่",
        category: "furniture",
    })
    try {
        const result = await agent.run(ctx1)
        console.log("[result]", result)
        console.log("=== Test case 1 completed ===")
    } catch (err) {
        console.error("=== Test case 1 failed ===", err)
    }

    // ── Test case 2: category = home (บ้านที่สร้างเสร็จแล้ว) ─────────────────
    console.log("\n=== Test case 2: home (บ้านเสร็จแล้ว → ที่ดินเปล่า) ===")
    callCount = 0
    const ctx2 = createDevContext({
        image_url: "https://example.com/images/house-completed.jpg",
        product: "บ้านเดี่ยว 2 ชั้น สไตล์โมเดิร์น",
        description: "บ้านเดี่ยว 2 ชั้น หลังคาทรงแบน ผนังสีขาว พร้อมสวนหน้าบ้าน",
        category: "home",
    })
    try {
        const result = await agent.run(ctx2)
        console.log("[result]", result)
        console.log("=== Test case 2 completed ===")
    } catch (err) {
        console.error("=== Test case 2 failed ===", err)
        process.exit(1)
    }
}

main()
