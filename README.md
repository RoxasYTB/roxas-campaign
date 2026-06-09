# Roxas Campaign — GTA Vice City for GTAC

Full VC single-player campaign for GTA Connected. 50 missions, 16 buyable properties, save system, interiors, side missions.

## Install

Drop `roxas-campaign/` into your server's `resources/`, add `<resource src="roxas-campaign" />` in `server.xml`, restart.

## Commands

**Player:** `/help` — show commands

**Admin:** `/password <pw>` then `/admin` to auth.  
`/op <name> [pw]` `/deop <name>` — manage admins  
`/tp <loc|player|x,y,z>` `/save` `/god` — tools  
`/block <player>` `/unblock` — player management  
Cheat codes in chat (admin only by default)

## Config

Create `roxas-campaign/admins.json`:
```json
{"YourName": "yourPassword"}
```

Edit `client.js` — search `CHEATS_ENABLED` / `CHEATS_ADMIN_ONLY`.

## Technical

- **Engine**: GTAC (SpiderMonkey JS, no imports)
- **Save**: JSON (missions, pos, inventory, bonuses)
- **No deps**, no debug spam, ANSI admin logs only
- **Autosave**: kills PSAVE scripts, calls custom save

## Credits

RoxasYTB. Original VC by Rockstar North.
