# Roxas Campaign — GTA Vice City for GTAC

Full VC single-player campaign for GTA Connected. 50 missions, 16 buyable properties, save system, interiors, side missions.

## Install

Drop `roxas-campaign/` into your server's `resources/`, add `<resource src="roxas-campaign" />` in `server.xml`, restart.

## Commands

**Player:** `/help`

**Admin:** `/password <pw>` — auth with the server password.  
`/op <name> [pw]` `/deop <name>` — manage other admins  
`/tp <loc|player|x,y,z>` `/save` `/god` — tools  
`/block <player>` `/unblock` — player management  
Cheat codes in chat (admin only by default)

## Config

Create `roxas-campaign/admins.json`:
```json
{"YourName": "yourPassword"}
```

Edit `roxas-campaign/config.json` (auto-created on first start):
```json
{"cheats": {"enabled": true, "adminOnly": true}, "admin": {"needPassword": true}}
```

## Technical

- **Engine**: GTAC (SpiderMonkey JS, no imports)
- **Save**: JSON (missions, pos, inventory, bonuses)
- **No deps**, no debug spam, ANSI admin logs only
- **Autosave**: kills PSAVE scripts, calls custom save

## Credits

RoxasYTB. Original VC by Rockstar North.
