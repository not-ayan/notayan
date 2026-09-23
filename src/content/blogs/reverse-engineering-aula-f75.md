When you buy an enthusiast budget mechanical keyboard like the **AULA F75** (or its sister board, the F87), you get gasket-mounted typing, pre-lubed switches, and solid wireless/wired capabilities. But you also inherit the dark side of PC peripherals: **OEM configuration software**.

The official driver is a Windows-only Electron/C++ app. It demands administrative privileges, runs background telemetry services, takes up hundreds of megabytes of disk space, and refuses to run on Linux, macOS, or Chromebooks.

This is the complete technical story of how we reverse-engineered the AULA F75's proprietary USB protocol from scratch—decompiling the official desktop client, capturing raw USB traffic with Wireshark, decoding the MCU's memory maps and packet structures, fixing deep hardware quirks, and building **OpenAULA Web**, a zero-install WebHID controller that runs entirely inside any modern web browser.

> **Live App**: [openaula.vercel.app](https://openaula.vercel.app) — no install, no driver, open in any Chromium-based browser with your keyboard plugged in.

---

## 1. The Target: Hardware & Architecture

Before diving into packet captures, we needed to know what microcontroller (MCU) was driving the board.

- **Device Name**: AULA F75 Mechanical Keyboard
- **USB Vendor ID (VID)**: `0x258A` (Sinowealth / SinoWealth Electronic Ltd.)
- **USB Product ID (PID)**: `0x010C` (Common Sinowealth Gaming Keyboard Controller)
- **HID Interface**: Interface `1` (`MI_01`), Usage Page `0xFF00` / Usage `0x0001` (Vendor-defined HID communication interface)
- **Report Size**: 520 bytes (Report ID `0x06` / `0x0A`) & 136-byte device configuration blocks

Sinowealth MCUs (like the SH68F88/SH68F90 family) are widely used across budget gaming peripherals (EPOMAKER, AULA, Royal Kludge, Redragon). Instead of standard QMK/VIA firmware, these chips run proprietary vendor firmware with rigid USB HID Feature Report commands.

---

## 2. Decompiling the Official Software

Our first step was static analysis of the official AULA distribution installer.

Extracting the application bundle revealed an Electron shell wrapping a native backend with packed configuration files and dynamic libraries (`.dll`).

### Discovering `KB.ini`
Buried inside the software assets was `KB.ini`, the master hardware descriptor used by the desktop app:

```ini
[Device]
VID=0x258A
PID=0x010C
Name=AULA F75
Layout=75Key
ReportID=6
ReportLen=520
ConfigLen=136

[Effects]
Count=18
0=Off
1=Static
2=Breathing
3=Wave
4=Spectrum
5=Rain
7=Ripple
8=Starlight
10=Snake
11=Aurora
12=Reactive
13=Marquee
15=Circle
16=RainDown
17=CenterRipple
18=Custom
```

This configuration file provided vital clues:
1. **Missing Effect IDs**: Notice that IDs `6`, `9`, and `14` were omitted from the list. The firmware skips these IDs internally. Attempting to set effect ID `6` causes the MCU to either reject the command or fall back into an undefined hardware lockup.
2. **Packet Boundaries**: The hardware communicated using 520-byte HID Feature Reports on Report ID `0x06`.
3. **Configuration Structure**: The keyboard stored its persistent profile in a 136-byte memory table.

---

## 3. USB Protocol Analysis & Traffic Captures

With static targets established, we connected the keyboard through a USB analyzer and used Wireshark with USBPcap to capture live traffic from the OEM app across several test scenarios:

### Capture 1: Baseline Handshake & Static Colors (`capture.pcap`)
- When the desktop software connects, it first sends a 14-byte handshake query:
```
Host -> Device (CMD 0x82):
06 82 00 00 00 00 00 00 00 00 00 00 00 00

Device -> Host (Model Response):
06 82 01 00 01 00 06 00 03 00 00 00 03 66
```
- Sending a static color (e.g. Pure Red `#FF0000`) revealed that the keyboard does not update lighting with a single packet. Instead, it follows a **4-step atomic commit transaction**.

### Capture 2: Dynamic Effects & Color Channels (`capture2.pcap`)
- Toggling between Rainbow Wave, Breathing, and Static modes proved that dynamic hardware effects and custom per-key lighting use completely distinct packet structures:
  - **Dynamic Shaders**: Controlled via a 136-byte device configuration block (`CMD 0x04`).
  - **Custom Per-Key RGB**: Transmitted as a 520-byte planar frame (`CMD 0x06`) or grouped color bank (`CMD 0x0A`).

### Capture 3: Speeds, Brightness, and Keystroke Response (`capture3.pcap`)
- Dissected the sub-registers for effect speed (5 levels: 0x00 to 0x04) and brightness (5 levels: 0x00 to 0x04), confirming their offsets inside the 136-byte configuration payload.

---

## 4. Cracking the Protocol

### 4.1 The 4-Step Hardware Commit Transaction
One of the most critical discoveries was that simply writing RGB data to the keyboard does **not** persist it. The Sinowealth MCU requires a strict 4-step sequence:

```
1. Send Feature Report (520 bytes: CMD 0x06 or 0x0A)
   └─ Staged in volatile frame buffer
2. Commit Trigger (CMD 0x84)
   └─ Flash write latch enabled
3. Read Device Config (GET_REPORT 136 bytes)
   └─ Validates hardware state and offsets
4. Writeback Config (CMD 0x04 with custom_flag = 1)
   └─ Lighting active and stored to EEPROM
```

If any step is skipped or executed out of order, the MCU discards the payload, resulting in unresponsive keys or flashing glitch artifacts.

---

### 4.2 The Two Lighting Modes

The AULA F75 supports two distinct ways to paint its LEDs:

#### A. Planar RGB Mode (`CMD 0x06`)
Instead of standard interleaved RGB (`[R, G, B, R, G, B...]`), the F75's frame buffer organizes colors into three independent 126-byte color planes:

| Byte Offset | Plane Length | Description |
| :--- | :--- | :--- |
| `0x00` | 1 byte | Report ID (`0x06`) |
| `0x01` | 1 byte | Command Code (`0x06` = Per-Key Planar) |
| `0x02 - 0x06` | 5 bytes | Reserved / Zero Padding |
| `0x07 - 0x84` | 126 bytes | **Red Plane** (Red channel for keys 0..125) |
| `0x85 - 0x102`| 126 bytes | **Green Plane** (Green channel for keys 0..125) |
| `0x103 - 0x180`| 126 bytes | **Blue Plane** (Blue channel for keys 0..125) |
| `0x181 - 0x207`| 135 bytes | Tail Padding (Zeros) |

#### B. Custom Profile Mode & The 21-Byte Hardware Alignment Gap (`CMD 0x0A`)
When saving custom static presets across key banks, `CMD 0x0A` packages LEDs in groups of 7 (21 bytes per group: 7 LEDs × 3 colors).

However, during testing we encountered an unexpected bug: **saturated colors (like `#F01D0E`) caused random key flicker across the bottom row.**

Disassembling the memory mapping revealed that the physical PCB layout contains **three 21-byte hardware gap offsets**. The firmware reserves space for a full 108-key matrix; on a 75% board, these unpopulated physical switches leave dummy memory addresses:

```typescript
// Hardware Alignment Table: Groups must be injected with 21-byte zero padding
// at specific intervals to keep LED indices aligned with physical switches.
const HARDWARE_GAP_OFFSETS = [
  4 * 21,  // Gap after Group 4 (Function row transition)
  8 * 21,  // Gap after Group 8 (Nav cluster transition)
  12 * 21  // Gap after Group 12 (Numpad omission transition)
];
```

Without these padding intervals, every key after the function row would shift out of phase, causing red and green bytes to misalign.

---

### 4.3 Direct Streaming Mode (`CMD 0x08`) & The Keepalive Requirement
For real-time screen ambilight or audio visualizers:
- Direct mode accepts interleaved RGB payloads via `CMD 0x08`.
- **The Catch**: The keyboard hardware features a hardware watchdog. If a new frame is not received within **800ms**, the keyboard assumes the host software crashed and automatically reverts to its default hardware wave animation.
- To maintain software control, the driver must maintain a heartbeat pulse every ~500ms.

---

## 5. Building the WebHID Controller

With the hardware protocol decoded, we implemented a full browser-based web application using **React 18**, **TypeScript**, **Tailwind CSS**, and the browser's native **WebHID API**.

```
┌─────────────────────────────────────────────────────────┐
│                     OpenAULA Web UI                     │
├──────────────────────────┬──────────────────────────────┤
│  Hardware Effects Panel  │    Per-Key RGB Painter       │
│  - 15 Dynamic Effects    │    - Visual Keyboard Matrix  │
│  - Brightness & Speed    │    - Color Palette & Hex     │
│  - Single/Multi Color    │    - Zone & Key Selection    │
├──────────────────────────┴──────────────────────────────┤
│               WebHID Hardware Driver Layer              │
│  - 4-Step Transaction Pipeline (CMD 0x06 / 0x0A / 0x04) │
│  - Mutex Queue & Concurrency Lock                       │
│  - 21-Byte Matrix Alignment Transformer                 │
│  - PWM Channel Color Calibration                        │
└─────────────────────────────────────────────────────────┘
```

### Why WebHID?
- **Zero Installation**: No `.exe`, no background services, no drivers needed.
- **Cross-Platform**: Works identically on Windows, macOS, Linux, and ChromeOS.
- **Security**: Direct USB access sandboxed by explicit browser permission prompts.

---

## 6. The Gauntlet of Bugs & Engineering Fixes

Bringing reverse-engineered code to production stability required diagnosing and fixing tricky edge cases:

### 1. The Ghost Effect Lockup
- **Problem**: Selecting certain effect presets caused the keyboard to freeze or revert to static white.
- **Root Cause**: The firmware omits IDs `6`, `9`, and `14`.
- **Fix**: Remapped all UI selectors to the verified 15-effect hardware table:
```typescript
export const EFFECT_IDS = {
  OFF: 0,
  STATIC: 1,
  BREATHING: 2,
  WAVE: 3,
  SPECTRUM: 4,
  RAIN: 5,
  RIPPLE: 7,
  STARLIGHT: 8,
  SNAKE: 10,
  AURORA: 11,
  REACTIVE: 12,
  MARQUEE: 13,
  CIRCLE: 15,
  RAIN_DOWN: 16,
  CENTER_RIPPLE: 17,
  CUSTOM: 18,
} as const;
```

### 2. USB Concurrency Races
- **Problem**: Dragging the brightness or color slider rapidly caused `DOMException: The device is already open` or failed transfers.
- **Root Cause**: WebHID `sendFeatureReport` calls cannot be overlapped on the same endpoint.
- **Fix**: Implemented a serialized promise queue with automatic request collapsing, ensuring only the latest frame is transmitted once the previous USB transaction completes.

### 3. The Mythical "Side Light Strip"
- **Problem**: Early protocol notes suggested controls for a side underglow RGB strip (common in F87 models).
- **Reality**: The AULA F75 physical chassis does not have side LED diffusion strips. Sending side-strip channel commands polluted configuration byte `0x19`, resetting user brightness. We removed all phantom strip code.

### 4. Hex Color `#` Prefix Handling
- **Problem**: Pasting standard 6-character hex strings (`ff0055`) into the custom color input broke validation unless users manually typed `#`.
- **Fix**: Added an input sanitizer that auto-detects raw hex values and prepends `#`.

### 5. Color Selection Dropping Dynamic Animations
- **Problem**: When changing effect color schemes, the keyboard would occasionally fall back to a static single-color flood, ignoring the chosen animation.
- **Root Cause**: Setting color and effect in the same packet triggered a race in the MCU's flash memory writer.
- **Fix**: Added a 60ms hardware settling delay between updating the color palette sub-register and firing the `0x84` commit pulse.

### 6. The Red Hue Bleed Underneath Cool Tones
- **Problem**: Selecting pure Cyan (`#00FFFF`) or Cool Blue resulted in keys showing a faint red tint underneath the backlight.
- **Root Cause**: The AULA F75's hardware LED driver uses a non-linear PWM duty cycle that overdrives the red channel at low voltages.
- **Fix**: Implemented a calibration curve in the color transformation layer that dampens secondary red PWM bias when blue/green channels dominate.

### 7. `formatComboLabel` & Short Config Crashes
- **Problem**: Users on specific firmware builds experienced `Uncaught TypeError: Cannot read properties of undefined (reading 'toString')` when opening the matrix view.
- **Root Cause**: Some firmware versions return configuration packets shorter than 136 bytes (132–134 bytes), leaving combo mapping arrays undefined.
- **Fix**: Added safe bounds checking and padded undersized HID reports with baseline defaults.

---

## 7. Current Project State & Architecture

The project now stands as a complete, lightweight alternative to proprietary OEM software:

- **Hardware Effects Tab**: Full control over all 15 native animations, multi-color & single-color modes, 5-level speed and brightness adjustments.
- **Per-Key RGB Painter**: Visual 75% interactive matrix allowing users to click and paint individual switches, select standard functional zones (WASD, Arrows, Numbers, Modifiers), and save directly to onboard hardware memory.
- **Clean Architecture**:
  - `src/lib/webhid.ts` — WebHID connection management, report parsing, and device descriptor matching.
  - `src/lib/rgbService.ts` — 4-step commit pipeline, planar color conversion, and hardware gap padding.
  - `src/lib/f75Constants.ts` — Effect maps, matrix layout coordinates, and key index lookups.
  - `src/components/KeyboardGrid.tsx` — Dynamic SVG/CSS mechanical keyboard rendering.

---

## 8. Acknowledgments & Upstream Research

This project stands on the shoulders of the open-source hardware community:
- **`veysiemrah/aula-rgb-controller`**: Foundational work decoding the Sinowealth 520-byte feature report structures.
- **`rodrigost23/OpenRGB`**: SinowealthKeyboard10c drivers that documented the direct streaming protocol and keepalive behavior.

---

## 9. Conclusion

Peripheral hardware should belong to the user who purchased it, not locked behind proprietary, platform-exclusive software suites. By decoding the USB communication layer and using modern open web standards like WebHID, we can replace bloatware with elegant, accessible tools that run on any machine with a browser.
