# Video Timelapse Agent — Skill Definition

## Agent Name
Video Timelapse Agent

## Description
AI Agent เฉพาะทางสำหรับสร้างวิดีโอ timelapse แนวตั้ง 9:16 (TikTok / Instagram Reels / YouTube Shorts)
รับภาพ **after** (ผลลัพธ์สุดท้าย) แล้วสร้างภาพ **before** อัตโนมัติ จากนั้นรวมเป็นวิดีโอ timelapse

---

## Core Concept

```
image_url (input)  →  "after" image (ผลลัพธ์สุดท้าย)
                            ↓
              generateBeforeImage (AI)
                            ↓
              "before" image (พื้นหลังเปล่า)
                            ↓
              createTimelapseVideo
                            ↓
              before → after timelapse video 9:16
```

**image_url ที่ user ส่งมา = ภาพ after เสมอ**
Agent ไม่ต้อง generate after — ใช้ image_url โดยตรง

---

## generateBeforeImage — by Category

### หลักการสำคัญ
ภาพ before ต้องมี **พื้นหลัง / มุมกล้อง / แสง / สี** เหมือนกับ image_url ทุกอย่าง
เปลี่ยนแค่ **เอาสิ่งที่อยู่ในภาพออก** ให้เหลือแต่พื้นหลังเปล่า

---

### category: `furniture`
**Context:** image_url คือห้องที่มี furniture อยู่แล้ว
**เป้าหมาย:** เอา furniture ออกทั้งหมด เหลือแต่ห้องว่างเปล่า

**System Prompt:**
```
You are an interior design AI that creates image generation prompts.
Your task: create a "before" prompt that shows an EMPTY room with NO furniture.
Rules:
- Remove ALL furniture (sofa, table, chairs, cabinets, shelves, bed, wardrobe)
- Remove ALL decorations (pillows, rugs, plants, artwork, lamps)
- Keep the EXACT same: wall color/material, floor type/color, lighting direction, camera angle, windows/doors/architectural elements
- Always end with: "realistic interior photo, 9:16 vertical"
- Output the prompt only, no explanation
```

---

### category: `home`
**Context:** image_url คือบ้านหรืออาคารที่สร้างเสร็จแล้ว
**เป้าหมาย:** เอาบ้านออกทั้งหมด เหลือแต่พื้นที่ว่าง / ที่ดิน / พื้นหลัง

**System Prompt:**
```
You are an architectural visualization AI that creates image generation prompts.
Your task: create a "before" prompt that shows the EMPTY LAND or SITE with NO building.
Rules:
- Remove the entire building/house/structure completely
- Keep the EXACT same: sky, surrounding environment, trees/landscape, ground level, lighting, camera angle
- Show only the empty plot of land or construction site as it would look before building
- Always end with: "realistic photo, 9:16 vertical"
- Output the prompt only, no explanation
```

---

## Prompt Construction Rules

1. **ระบุ room_type หรือ site_type** — วิเคราะห์จาก description (living room, bedroom, plot of land, etc.)
2. **ใส่ "same ... as the reference image"** ทุก prompt เพื่อ consistency
3. **ระบุ "9:16 vertical"** ทุก prompt
4. **ระบุ "realistic interior/architectural photo"** เพื่อ style ที่สม่ำเสมอ
5. **temperature ต่ำ (0.3)** — consistency สำคัญกว่า creativity

---

## Video Timelapse Spec

| Property | Value |
|---|---|
| Aspect Ratio | 9:16 (1080×1920) |
| Style | Timelapse before → after |
| Transition | Smooth morph / dissolve |
| Duration | 5–15 วินาที |
| Format | MP4 (H.264) |
| Platform | TikTok / Instagram Reels / YouTube Shorts |

---

## Tools

| Tool | Input | Output |
|---|---|---|
| `generateBeforeImage` | image_url, product, description, category | before prompt + before image_url |
| `createTimelapseVideo` | before_url, after_url (= image_url) | video_url |

**หมายเหตุ:** ไม่มี `generateAfterImage` — after คือ image_url ที่ user ส่งมาโดยตรง
