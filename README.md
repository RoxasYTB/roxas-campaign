# Roxas Campaign — GTA Vice City for GTA Connected

Full VC single-player campaign ported to GTAC's multiplayer engine. 50 missions, 16 buyable properties, 10 outfits, save system, interiors, side missions.

## Install

1. Drop `roxas-campaign/` into your server's `resources/` folder.
2. Add `<resource src="roxas-campaign" />` in `server.xml` `<resources>`.
3. Restart or start resource.

## What's included

- **50 missions** — all main VC missions (except Shakedown & Cap the Collector, blocked by missing GTAC natives). Pink spheres, walk in to start.
- **16 properties** — safehouses + revenue assets. Walk to pickup, press TAB, pay.
- **10 outfits** — original VC clothes pickups, saved to profile (skins 161-171).
- **Save system** — auto on pickup, admin `/save`. Persists: missions, money, ammo, skin, position, time, interior, clothes, bonuses.
- **Side missions** — Vigilante, Pizza, Taxi, Paramedic, Firefighter.
- **Interiors** — all major interiors with camera switching.
- **Revenue pickups** — protection pickups on owned assets.
- **Bridge barriers** — removed after mission 13.
- **Bonuses** — Startup (+50 HP/armour), Vigilante (+50 armour), Pizza (+50 HP + $5k).

## Commands

- `/help` — player commands
- `/password <pw>` `/admin` — admin auth
- `/op <name> [pw]` `/deop <name>` `/setpassword <pw>` — admin management
- `/tp <loc|player|[x,y,z]>` `/save` `/god` — admin tools
- `/block <player>` `/unblock <player>` — player management
- Cheat codes in chat (admin only by default)

## Configuration

Create `roxas-campaign/server/config/admins.json`:
```json
["PlayerName1", "PlayerName2"]
```

Create `roxas-campaign/server/config/camera.json` for fixed-camera interiors:
```json
{}
```

Edit the resource's `client.js` — search for `CHEATS_ENABLED` / `CHEATS_ADMIN_ONLY` at the top.

## Technical

- **Engine**: GTAC (SpiderMonkey JS, global scope, no import/export)
- **Save format**: JSON (missions, playerstate, inventory, bonuses)
- **No external deps**, no debug spam, ANSI-colored admin logs only
- **Skins**: tracked via `skinUpdated` event
- **Doors**: visibility toggle + brute-force handle scan
- **Autosave**: kills PSAVE scripts @ 500ms, calls custom save

## Credits

RoxasYTB. Original VC by Rockstar North. Reference disassembly by modding community.
