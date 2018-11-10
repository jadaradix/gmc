import Resource from '../Resource.js'

class ResourceImage extends Resource {
  constructor (json = {}) {
    super(json)
    this.type = 'image'
    this.fixed = ((typeof json.fixed === 'string' || json.fixed === null) ? json.fixed : 'ball')
    this.frameWidth = (typeof json.frameWidth === 'number' ? json.frameWidth : 64)
    this.frameHeight = (typeof json.frameHeight === 'number' ? json.frameHeight : 64)
  }

  getDefaultName () {
    return 'New image'
  }

  getRemoteUrl() {
    const pathname = (() => {
      if (typeof this.fixed === 'string') {
        return `fixed-image-${this.fixed}`
      } else {
        return this.id
      }
    })()
    return `https://storage.googleapis.com/gmc-resources/${pathname}.png`
  }

  toApi() {
    const r = super.toApi()
    return {
      ...r,
      fixed: this.fixed,
      remoteUrl: this.getRemoteUrl(),
      frameWidth: this.frameWidth,
      frameHeight: this.frameHeight
    }
  }

  toDatastore() {
    const r = super.toDatastore()
    return {
      ...r,
      fixed: this.fixed,
      frameWidth: this.frameWidth,
      frameHeight: this.frameHeight
    }
  }

  fromApiPost(json) {
    super.fromApiPost(json)
    this.fixed = (typeof json.fixed === 'string' || json.fixed === null) ? json.fixed : this.fixed
  }

  fromApiPatch(json) {
    super.fromApiPatch(json)
    this.fixed = (typeof json.fixed === 'string' || json.fixed === null) ? json.fixed : this.fixed
    this.frameWidth = (typeof json.frameWidth === 'number' ? json.frameWidth : 64)
    this.frameHeight = (typeof json.frameHeight === 'number' ? json.frameHeight : 64)
  }

  clientFromApiGet(json) {
    super.clientFromApiGet(json)
    this.fixed = json.fixed
    this.frameWidth = json.frameWidth
    this.frameHeight = json.frameHeight
  }
}

export default ResourceImage
