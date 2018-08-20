import JSZip from 'jszip'
import { saveAs } from 'file-saver/FileSaver'
import md5 from 'blueimp-md5'
import cheerio from 'cheerio'
import resize from './image'

const electron = window.require('electron')
const fs = electron.remote.require('fs')
const path = electron.remote.require('path')

// list of files that don't need to be copied to the zip
const COPY_BLACKLIST = ['index.html']

// Max image sizes [Height, Width]
const THUMB_SIZE = [200, 300]
const FULL_SIZE = [600, 800]

/**
 * Generates a new fileName for the destination file.
 * @param  {String} fileName the original filename
 * @return {String}          the md5'd filename
 */
const getNewFilename = (fileName) => {
  return `${md5(fileName)}.png`
}

const relativeRoot = 'src/external/'
// const appPath = process.env.NODE_ENV === 'production' ? electron.remote.app.getAppPath() : __dirname

/**
 * Generates the index file for the static page and inserts it into the destination zip
 * @param  {Object} zip         A JSZip instance
 * @param  {FileList}  [fileList=[]] A native FileList object
 * @return {undefined}          void
 */
const generateIndex = (zip, fileList, description) => {
  const indexPath = `${relativeRoot}index.html`

  // loading template
  const indexDocument = cheerio.load(fs.readFileSync(indexPath, { encoding: 'utf8' }))
  // finding images elements
  const thumbContainer = indexDocument('#main').first()
  const source = thumbContainer.find('article').first().clone().removeAttr('style')

  // generating image elements
  fileList.forEach((file) => {
    const currentThumb = source.clone()
    const fullImage = currentThumb.find('a').attr('href')
    const thumbImage = currentThumb.find('img').attr('src')

    const newName = getNewFilename(file.name)

    currentThumb.find('a').attr('href', `${fullImage}${newName}`)
    currentThumb.find('img').attr('src', `${thumbImage}${newName}`)

    thumbContainer.append(currentThumb)
  })

  // Setting description
  indexDocument('#description').first().text(description)

  // saving index.html into memory zip
  zip.file('index.html', indexDocument.html())
}

/**
 * Copies existing static assets recursevely to the destination zip file
 * @param  {Object} zip         A JSZip instance
 * @param  {String} [suffix=''] The suffix for the root folder in each iteration
 * @return {undefined}          void
 */
const copyStatic = (zip, suffix = '') => {
  const testFolder = `${relativeRoot}${suffix}`

  fs.readdirSync(testFolder).forEach((file) => {
    const filePath = path.resolve(testFolder, file)

    const isDirectory = fs.statSync(filePath).isDirectory()
    if (isDirectory) {
      const relativePath = `${suffix}${file}/`
      copyStatic(zip, relativePath)
    } else if (!COPY_BLACKLIST.includes(file)) {
      const readStream = fs.createReadStream(filePath)
      zip.folder(suffix).file(file, readStream)
    }
  })
}

const generateZip = (zip, fileList, description) => {
  // copying remaining static assets
  copyStatic(zip)
  // generating index.html with current images
  generateIndex(zip, fileList, description)
  // popping download dialog
  zip.generateAsync({ type: 'blob' }).then((content) => {
    saveAs(content, 'photop.zip')
  })
}

/**
 * Generates the exportable package
 * This can become a lenghty operation, so we'll return a promise in order to
 * show a loading animation elsewhere
 * @param  {FileList}  [fileList=[]] A native FileList object
 * @return {Promise}                A promise to operation end
 */
export default function generatePackage(fileList = [], description) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // zip contents will remain in memory until downloaded
      const zip = new JSZip()

      // simple count to check if all files were handled
      let missingFiles = fileList.length

      fileList.forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const newName = getNewFilename(file.name)

          // resizes will also parse imagem to png
          const resizeForThumb = resize(Buffer.from(e.target.result), ...THUMB_SIZE)
          const resizeForFull = resize(Buffer.from(e.target.result), ...FULL_SIZE)

          zip.folder('images/thumbs').file(newName, resizeForThumb)
          zip.folder('images/fulls').file(newName, resizeForFull)

          missingFiles -= 1

          // last file, generate zip
          if (missingFiles === 0) {
            generateZip(zip, fileList, description)

            // ending promise
            resolve()
          }
        }
        // opening file
        reader.readAsArrayBuffer(file)
      })
    })
  })
}
