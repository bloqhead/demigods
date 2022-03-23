import express from 'express'
import cors from 'cors'
import fs from 'fs'
import { promisify } from 'util'
import { readdir, readFile } from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PORT = 3000
const app = express()
const ver = 1

// setup CORS
app.use(cors())

// set the rendering engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')

// start Express
app.listen(PORT, () => console.log(`API is running on: http://localhost:${PORT}`))

//
// Utilities
// 

function slugify(str) {
  str = str.toLowerCase();
  str = str.replace(/[“”‘’']/g,'')
  str = str.replace(/[^a-z0-9]+/g, '-');
  str = str.replace(/^-+|-+$/g, '');
  
  return str;
}

const readDirAsync = promisify(fs.readdir)

// data directory path
const dirName = path.join(__dirname, 'data')

const fullFileList = async () => {
  const res = await readDirAsync(dirName)
  const arr = []

  for (let i = 0; i < res.length; i++) {
    const slug = `/${res[i].toLowerCase().replace('.json', '')}`
    arr.push([
      slug, `${slug}/tier/:tier`,
      `${slug}/:id`,
      `${slug}/:slug`
    ])
  }

  return arr
}

//
// Endpoints
// 

// root
app.get('/', async (req, res) => {
  res.render('index', {
    items: await fullFileList(),
    version: `v${ver}`
  })
})


readdir(dirName, (err, fileList) => {
  if (err) throw err

  for (let i = 0; i < fileList.length; i++) {
    const fileName = fileList[i]

    if (!fileName.toLowerCase().endsWith('.json')) continue

    const fullFileName = path.join(dirName, fileName)
    const urlSlug = `/v${ver}/${fileName.toLowerCase().replace('.json', '')}`
    
    readFile(fullFileName, { encoding: 'utf-8' }, (err, data) => {
      try {
        const DATA = JSON.parse(data)

        // get all from category
        app.get(urlSlug, (req, res) => {
          res.json({
            status: 'success',
            data: DATA
          })
        })

        // get weapon by ID
        // the ID can be a slugified version of the weapon name, or the ID integer itself
        app.get(`${urlSlug}/:id`, (req, res) => {
          const { id } = req.params
          const item = DATA.filter((x) => {
            return x.id == id || slugify(x.weapon) == id
          })
          
          if (item && item.length > 0) {
            res.json({
              status: 'success',
              data: item
            })
          } else {
            res.json({
              status: 'error',
              message: `ID ${id} not found in ${urlSlug}`
            })
          }
        })

        // get weapons by tier
        app.get(`${urlSlug}/tier/:tier`, (req, res) => {
          const { tier } = req.params
          const items = DATA.filter(
            (x) => x.tier ? x.tier.toLowerCase() == tier.toLowerCase() : null
          )

          if (items && items.length > 0) {
            res.json({
              status: 'success',
              data: items
            })
          } else {
            res.json({
              status: 'error',
              message: `Tier ${tier} not found in ${urlSlug}`
            })
          }
        })
      } catch (err) {
        throw err
      }
    })
  }
})

export default app