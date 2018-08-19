const electron = window.require('electron')
const { nativeImage } = electron

/**
 * Resizes an image to given dimensions
 * @param  {Array} imageBuffer An array buffer describing an image
 * @param  {Int} height      Maximum new image height
 * @param  {Int} width       Maximum new image width
 * @return {Promise}     A promise which will resolve to an electron NativeImage
 */
export default function resize(imageBuffer, height, width) {
  const image = nativeImage.createFromBuffer(imageBuffer)
  return image.resize({
    width,
  }).toPNG()
}
