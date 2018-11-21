import uuid from '../abstractions/uuid/index.dist.js'

const guessNameFromEmail = (email) => {
  return email
    .split('@')
    .shift()
    .split('.')
    .map(n => {
      return `${n[0].toUpperCase()}${n.substring(1)}`
    })
    .join(' ')
}

const VALID_SUBSCRIPTION_IDS = [
  'free',
  'pro',
  'beast'
]

class User {
  constructor (json = {}) {
    this.id = json.id || uuid()
    this.teamId = json.teamId || null
    this.createdAt = json.createdAt || Math.floor(new Date() / 1000)
    this.name = json.name || 'New User'
    this.email = json.email || 'a@b.c'
    this.passwordHash = json.passwordHash || null
    this.subscriptionEvents = json.subscriptionEvents || []
  }

  updateSubscription (id) {
    if (!VALID_SUBSCRIPTION_IDS.includes(id)) {
      throw new Error(`subscription id ${id} is not one of ${VALID_SUBSCRIPTION_IDS.join('/')}`)
    }
    this.subscriptionEvents.push({
      id,
      when: Math.floor(new Date() / 1000)
    })
  }

  getSubscription () {
    if (this.subscriptionEvents.length === 0) {
      this.updateSubscription('free')
    }
    return this.subscriptionEvents[this.subscriptionEvents.length - 1]
  }

  toApi () {
    const json = {
      id: this.id,
      teamId: this.teamId,
      createdAt: this.createdAt,
      name: this.name,
      email: this.email,
      subscription: this.getSubscription()
    }
    return JSON.parse(JSON.stringify(json))
  }

  toApiList () {
    const json = {
      id: this.id,
      teamId: this.teamId,
      name: this.name,
      email: this.email
    }
    return JSON.parse(JSON.stringify(json))
  }

  toDatastore () {
    const json = {
      id: this.id,
      teamId: this.teamId,
      createdAt: this.createdAt,
      name: this.name,
      email: this.email,
      passwordHash: this.passwordHash,
      subscriptionEvents: this.subscriptionEvents
      // someBoolean: (this.someBoolean === true),
    }
    return JSON.parse(JSON.stringify(json))
  }

  fromApiPost (json) {
    if (typeof json.email !== 'string' || json.email.indexOf('@') < 1) { // -1 or 0
      throw new Error('email is not valid')
    }
    this.teamId = (typeof json.teamId === 'string') ? json.teamId : this.teamId
    this.name = guessNameFromEmail(json.email)
    this.email = json.email
  }

  fromApiPatch (json) {
    if (typeof json.teamId === 'string') {
      if (json.teamId.length === 0) {
        throw new Error('teamId is not valid')
      } else {
        this.teamId = json.teamId
      }
    }
    if (typeof json.name === 'string') {
      if (json.name.length === 0) {
        throw new Error('name is not valid')
      } else {
        this.name = json.name
      }
    }
    if (typeof json.email === 'string') {
      if (json.email.indexOf('@') < 1) {
        throw new Error('email is not valid')
      } else {
        this.email = json.email
      }
    }
  }

  clientFromApiGet (json) {
    this.id = json.id
    this.teamId = json.teamId
    this.name = json.name
    this.email = json.email
    this.subscription = json.subscription
  }
}

export default User
