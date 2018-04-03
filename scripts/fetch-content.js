/* eslint-disable no-restricted-syntax, no-await-in-loop */

require('dotenv').config()
const download = require('image-downloader')
const contentfulStatic = require('contentful-static')
const save = require('./structure-content')

const destructureImg = image => {
  const { file: { url, fileName } } = image
  return { url, fileName }
}

async function saveImages (content) {
  for (const item of content) {
    const data = destructureImg(item.image)
  
    const options = {
      url: `http:${data.url}`,
      dest: `./templates/images/shows/${data.fileName}`
    }

    await download.image(options)
  }
}

function sync (space, accessToken) {
  contentfulStatic.config({
    space,
    accessToken
  })

  contentfulStatic.sync(async (err, json) => {
    if (err) {
      console.log('contentful-static: data could not be fetched')
      return false
    }

    const languages = Object.keys(json.entries)

    for (const lang of languages) {
      const content = json.entries[lang]
      const shows = content
        .filter(item => item.sys.contentType.sys.id === 'shows')
        .map(item => {
          item.fields.image = item.fields.image.fields
          return item.fields
        })
      const metadata = content
        .filter(item => item.sys.contentType.sys.id === 'metadata')
        .map(item => item.fields)

      save(
        {
          shows,
          metadata
        }
      )

      await saveImages(shows)
    }
  })
}

sync(
  process.env.CONTENTFUL_SPACE,
  process.env.CONTENTFUL_KEY
)
