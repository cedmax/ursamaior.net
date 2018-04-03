const fs = require('fs')
const slugify = require('slugify')
const mkdirp = require('mkdirp')

const titlify = (title) => slugify(title.toLowerCase())

const saveShared = ({ shows, metadata }) => {
  const json = {
    "site-title": metadata.title,
    copyright: metadata.footer,
    navbar: []
  }
  
  shows = shows.sort((a, b) => b.year - a.year)

  for (const show of shows) {
    json.navbar.push({
      "href": `${titlify(show.title)}.html`, 
      "year": show.year, 
      "text": show.title
    })
  }

  fs.writeFileSync('./contents/shared.json', JSON.stringify(json, null, 2), 'UTF-8')
  mkdirp.sync(`./contents/_index`);
  fs.writeFileSync('./contents/_index/body.markdown', metadata.homepage, 'UTF-8')
  fs.writeFileSync('./contents/index.json', JSON.stringify({ video: metadata.video }, null, 2), 'UTF-8')
}

const saveShows = ({shows}) => {
  for (const show of shows) {
    const slug = titlify(show.title);

    fs.writeFileSync(`./contents/${slug}.json`, JSON.stringify({
      "title": show.title,
      "subtitle": show.subtitle,
      "image": `images/shows/${show.image.file.fileName}`,
      "links": show.links,
      "background": show.background,
      "color": show.colour
    }, null, 2), 'UTF-8')

    mkdirp.sync(`./contents/_${slug}`);
    fs.writeFileSync(`./contents/_${slug}/body.markdown`, show.description, 'UTF-8')
    fs.writeFileSync(`./contents/_${slug}/credits.markdown`, show.credits, 'UTF-8')

  }
}

module.exports = ({shows, metadata}) => {
  saveShared({shows, metadata: metadata[0] })
  saveShows({shows})
}