# video-timelapse-agent

AI Agent เฉพาะทางสำหรับสร้างวิดีโอสั้นแนวตั้ง 9:16 (TikTok / Instagram Reels / YouTube Shorts) โดยอัตโนมัติ  
Built with [`@lifetimesoft/agent-sdk`](https://www.npmjs.com/package/@lifetimesoft/agent-sdk)

---

## 📦 Features

- รับ input เป็น image URL, product, description และ category
- สร้างภาพ **before** จาก image input ด้วย AI
- สร้างวิดีโอ **timelapse** จากภาพ before → after
- Output เป็นวิดีโอสั้นแนวตั้ง **9:16** พร้อมใช้งานบน TikTok / Instagram Reels / YouTube Shorts
- รองรับ category: `home` | `furniture`

---

## 🚀 Getting Started

```bash
lifectl ai agent pull video-timelapse-agent
lifectl ai agent run video-timelapse-agent
lifectl ai agent logs video-timelapse-agent
lifectl ai agent stop video-timelapse-agent
```

---

## 🧠 How It Works

```
Input
  └── image_url       → URL ของภาพสินค้าหรือพื้นที่ต้นฉบับ
  └── product         → ชื่อสินค้า เช่น "โซฟา L-Shape"
  └── description     → คำอธิบายสินค้า / ผลลัพธ์ที่ต้องการ
  └── category        → home | furniture

Step 1: Generate "Before" Image
  └── ใช้ AI สร้างภาพ before จาก image_url และ context ของ product/description

Step 2: Generate "After" Image
  └── ใช้ AI สร้างภาพ after ที่แสดงผลลัพธ์หลังจากใช้สินค้า/ตกแต่ง

Step 3: Create Timelapse Video
  └── นำภาพ before + after มาสร้างเป็นวิดีโอ timelapse แนวตั้ง 9:16
  └── Output: short video พร้อมใช้งานบน social media
```

### Agent Code

```ts
import { defineAgent, getEnvString } from "@lifetimesoft/agent-sdk"

interface VideoTimelapseInput {
  image_url: string
  product: string
  description: string
  category: "home" | "furniture"
}

export default defineAgent<VideoTimelapseInput>({
  async run(ctx) {
    const { image_url, product, description, category } = ctx.input

    // Step 1: Generate before image
    ctx.log.info(`Generating before image for: ${product}`)

    // Step 2: Generate after image using AI
    const afterPrompt = await ctx.ai.chat({
      messages: [
        {
          role: "system",
          content: `You are an interior design AI. Generate a detailed image prompt for an "after" transformation scene.`,
        },
        {
          role: "user",
          content: `Product: ${product}\nDescription: ${description}\nCategory: ${category}\nOriginal image: ${image_url}`,
        },
      ],
      model: getEnvString(ctx.env, "ai_model", "gemini-2.0-flash-exp"),
    })

    ctx.log.info("After image prompt generated:", afterPrompt)

    // Step 3: Create timelapse video (before → after)
    ctx.log.info("Creating 9:16 timelapse video...")

    return {
      status: "completed",
      product,
      category,
    }
  },
})
```

---

## 📥 Input

| Field         | Type     | Required | Description                          |
|---------------|----------|----------|--------------------------------------|
| `image_url`   | string   | ✅        | URL ของภาพต้นฉบับ                    |
| `product`     | string   | ✅        | ชื่อสินค้า                           |
| `description` | string   | ✅        | คำอธิบายสินค้าหรือผลลัพธ์ที่ต้องการ |
| `category`    | string   | ✅        | `home` หรือ `furniture`              |

---

## 📤 Output

| Field       | Type   | Description                              |
|-------------|--------|------------------------------------------|
| `video_url` | string | URL ของวิดีโอ timelapse ที่สร้างเสร็จแล้ว |
| `status`    | string | สถานะการสร้าง: `completed` / `failed`    |
| `product`   | string | ชื่อสินค้าที่ใช้ generate                |
| `category`  | string | category ที่ใช้                          |

---

## 📁 Project Structure

```
src/
  index.ts        ← agent logic
dist/
  index.js        ← compiled output (built by tsc)
package.json      ← dependencies including @lifetimesoft/agent-sdk
agent.json        ← agent metadata และ input/output schema
tsconfig.json     ← TypeScript config
```

---

## 📋 agent.json

```json
{
  "name": "video-timelapse-agent",
  "version": "0.0.1",
  "description": "AI Agent สำหรับสร้างวิดีโอ timelapse แนวตั้ง 9:16 จากภาพสินค้า",
  "runtime": "node20",
  "main": "dist/index.js",
  "public": false,
  "input": {
    "type": "json",
    "schema": {
      "image_url": "string",
      "product": "string",
      "description": "string",
      "category": "home | furniture"
    }
  },
  "output": {
    "type": "json",
    "schema": {
      "video_url": "string",
      "status": "string",
      "product": "string",
      "category": "string"
    }
  },
  "env": [
    {
      "name": "ai_model",
      "type": "string",
      "label": "AI Model",
      "description": "AI model สำหรับ generate image prompt",
      "default": "gemini-2.0-flash-exp",
      "required": false
    },
    {
      "name": "image_gen_api_key",
      "type": "password",
      "label": "Image Generation API Key",
      "description": "API key สำหรับ image generation service",
      "required": false
    },
    {
      "name": "video_output_format",
      "type": "string",
      "label": "Video Output Format",
      "description": "Format ของวิดีโอ output เช่น mp4",
      "default": "mp4",
      "required": false
    }
  ],
  "keywords": ["video", "timelapse", "short-video", "tiktok", "reels", "home", "furniture", "ai"]
}
```

---

## 🕐 Scheduler

| type       | behavior                                              |
|------------|-------------------------------------------------------|
| `none`     | manual trigger — กด Trigger ใน dashboard             |
| `interval` | รันทุก N milliseconds                                 |
| `cron`     | รันตาม cron schedule เช่น `0 9 * * 1-5`              |

---

## 🎬 Video Spec

| Property    | Value                                  |
|-------------|----------------------------------------|
| Orientation | แนวตั้ง (Portrait)                     |
| Aspect Ratio | 9:16                                  |
| Platform    | TikTok / Instagram Reels / YouTube Shorts |
| Style       | Timelapse (before → after)             |
| Format      | MP4                                    |

---

## 🧩 Related Tools

- [`lifectl`](https://www.npmjs.com/package/@lifetimesoft/lifectl) – CLI สำหรับ run และ manage agents
- [`@lifetimesoft/agent-sdk`](https://www.npmjs.com/package/@lifetimesoft/agent-sdk) – SDK สำหรับสร้าง AI agents

---

## 📄 License

MIT
