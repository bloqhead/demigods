# ⚔️ D E M I G O D S ⚔️

## An [Elden Ring](https://en.bandainamcoent.eu/elden-ring/elden-ring) weapons data API

v1.0 | [Homepage](https://demigods.vercel.app/)

This API returns a JSON response with information about all weapons in the Elden Ring universe.

Built on Node and [Express](https://expressjs.com/). Hosted on [Vercel](https://vercel.com/).

### Examples

* **All items:** `https://demigods.vercel.app/v1/all/`
* **By Type:** `https://demigods.vercel.app/v1/axe/`
* **By Tier:** `https://demigods.vercel.app/v1/axe/tier/e/`
* **By ID:** `https://demigods.vercel.app/v1/axe/93/`
* **Or by Slug:** `https://demigods.vercel.app/v1/axe/rosus-axe/`

All endpoint examples are located in the `data` directory. Item slugs are derived from their names.

#### Slug examples

* "Rosus' Axe" => `rosus-axe`
* "Cleanrot Knight's Sword" => `cleanrot-knights-sword`

## Roadmap / Ideas

* Endpoints for things like armor and possibly special items
* Move to something more flexible and robust, like SQLite
* Toy with the idea of GraphQL

---

_Elden Ring is property of BANDAI NAMCO. This is completely unofficial._
