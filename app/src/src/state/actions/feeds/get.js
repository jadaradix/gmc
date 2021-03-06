import api from '../../../api'
import classes from '../../../classes'

export default function (state, { id }) {
  const foundFeed = state.feeds.get(id)
  if (Array.isArray(foundFeed)) {
    return Promise.resolve(state)
  }
  return api
    .get('api-core', `feed/${id}`)
    .then(feedItems => {
      feedItems = feedItems.map(fi => {
        const feedItemClass = new classes.FeedItem()
        feedItemClass.clientFromApiGet(fi)
        return feedItemClass
      })
      state.feeds.set(id, feedItems)
      return {
        ...state
      }
    })
}
