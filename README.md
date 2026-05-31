# GTA Vice City Campaign for GTA Connected

Full VC single-player campaign ported to GTA Connected's multiplayer engine. 50 missions, 16 buyable properties, clothes, revenue pickups, save system, side missions. All custom JS, not the original SCM files.

## What's included

- **50 missions** : all main missions minus 2 (Shakedown + Cap the Collector) that GTAC can't run. Pink spheres on the map, walk in to start. Unlock sequence matches original.
- **16 properties** : safehouses to buy/spawn at + money assets (Malibu, Print Works, etc). Walk to pickup, press TAB, pay. Doors open, garages switch, revenue pickups appear.
- **10 outfits** : original VC clothes pickups, skin saved to profile. Skins 161-171.
- **Side missions** : Vigilante (+50 armour), Pizza (+50 HP + $5k), Taxi (unlocks Kaufman Cabs), Paramedic/Firefighter (native SCM, should work).
- **Save system** : auto on pickup touch + interval kill of native PSAVE scripts. Admin `/save`. Persists: missions, money, ammo, skins, position, time, interior, clothes, bonuses.
- **Bonuses** : Startup (+50 HP/armour), Vigilante (+50 armour, 3 police stints), Pizza (+50 HP + $5k, 3 pizza stints).
- **Revenue pickups** : protection pickups on owned assets. Malibu pays after mission 24.
- **Bridge barriers** : removed after mission 13 (Phnom Penh '86).
- **Interiors** : all major interiors with proper camera switching.

## What doesn't work

- **Shakedown** (31) : needs `has_glass_been_shattered_nearby` to track window smashing. GTAC doesn't have this native.
- **Cap the Collector** (51) : mafia attacks your revenue assets. GTAC's custom pickups don't integrate with the mission's asset detection, so it finishes instantly.

Both are protection missions that originally gated money properties. Since they can't work, all money assets unlock after **mission 32 (Bar Brawl)** instead. Bridge barriers unlock at mission 13 instead of 25 protection missions.

## How to install

1. Clone into your GTAC server's `resources/` folder.
2. Add `<resource src="roxas-campaign" />` inside `<resources>` in `server.xml`.
3. Restart server or start resource from admin panel.
4. Players join at spawn, walk to the pink marker at Ocean View to start.

### server.xml example
```xml
<server>
    <servername>My VC Server</servername>
    <game>gta:vc</game>
    <gamemode>Campaign</gamemode>
    <serverbrowser>true</serverbrowser>
    <maxplayers>32</maxplayers>
    <resources>
        <resource src="roxas-campaign" />
    </resources>
</server>
```

### Configuration

| File | Settings |
|------|----------|
| `server/config.js` | spawn pos/rot/skin, stream distance, hospitals, `NEED_ADMIN_PASSWORD` (default true) |
| `client/config.js` | `CHEATS_ENABLED`, `CHEATS_ADMIN_ONLY` (default true), weather |

### Commands

**Player:** `/help`

**Admin:** `/password <pw>` `/admin` `/op <name> [pw]` `/deop <name>` `/setpassword <pw>` `/tp <location\|player\|[x,y,z]>` `/save` `/god` `/block <player>` `/unblock <player>`

**Cheats:** VC cheat codes in chat (admin only by default).

## Project structure

```
meta.xml              load order
server/               runs server-side
  config.js, utils.js, player.js, health.js, main.js
  admin/, cheats/, commands/, missions/, saves/
client/               runs client-side
  config.js, utils.js, stats.js, blips.js
  barriers/, buypoints/, cheats/, commands/, config/,
  interiors/, main/, missions/, saves/
```

Modular by feature. No single-file bloat.

## Technical

- **Engine**: GTAC (SpiderMonkey JS, global scope, no import/require/export)
- **Save**: JSON : `{ missions, playerposition, health, armour, money, hour, minute, camerainterior, equippedWeapon, ammunitions, kcabsReward, clothesBought, bonuses, skin }`
- **No external dependencies**, no debug spam (ANSI-colored admin logs only)
- **Skins**: tracked via server `skinUpdated` event, not `localPlayer.model`
- **Doors**: `SET_VISIBILITY_OF_CLOSEST_OBJECT_OF_TYPE` + brute-force handle scan → `CREATE_OBJECT_NO_OFFSET` with collision off
- **Barriers**: object spawn, removed by mission progress
- **Autosave**: terminates PSAVE scripts @ 500ms, calls custom save

## Credits

Made by RoxasYTB. Original VC by Rockstar North / DMA Design. Reference disassembly by the modding community.

Report bugs, send fixes, whatever.
