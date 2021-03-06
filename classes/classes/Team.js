import uuid from '../abstractions/uuid/index.dist.js'

class Team {
  constructor (json = {}) {
    this.id = json.id || uuid()
    this.createdAt = json.createdAt || Math.floor(new Date() / 1000)
    this.name = json.name || 'My team'
  }

  toApi () {
    const json = {
      id: this.id,
      createdAt: this.createdAt,
      name: this.name
    }
    return JSON.parse(JSON.stringify(json))
  }

  toDatastore () {
    const json = {
      id: this.id,
      createdAt: this.createdAt,
      name: this.name
    }
    return JSON.parse(JSON.stringify(json))
  }

  fromApiPost (json) {
    if (typeof json.name === 'string') {
      if (json.name.length === 0) {
        throw new Error('name is not valid')
      } else {
        this.name = json.name
      }
    }
  }

  fromApiPatch (json) {
    if (typeof json.name === 'string') {
      if (json.name.length === 0) {
        throw new Error('name is not valid')
      } else {
        this.name = json.name
      }
    }
  }

  clientFromApiGet (json) {
    this.id = json.id
    this.createdAt = json.createdAt
    this.name = json.name
  }
}

export default Team
