import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import classes from '../classes'

import { font, colours } from '../styleAbstractions'
import icons from '../icons'
import events from '../atomEvents'

import Box from '../components/Box/Box'
import Dropper from '../components/Dropper/Dropper'
import List from '../components/List/List'
import ListItem from '../components/ListItem/ListItem'
import Image from '../components/Image/Image'
import Heading2 from '../components/Heading2/Heading2'

import ActionModal from '../component-instances/ActionModal'
import ActionsList from '../component-instances/ActionsList'

const StyledResource = styled.div`
  section.image-events {
    .component--box.image {
      .image-container {
        position: relative;
        height: 128px;
        border: 1px solid #dadfe1;
        border-radius: 4px;
      }
      .image-container + .component--dropper {
        margin-top: 1rem;
      }
    }
    .component--box.events {
      margin-top: 1rem;
      padding: 1rem;
      .component--heading2 {
        margin-bottom: 1rem;
      }
      // background-color: yellow;
    }
  }
  section.actions {
    margin-top: 1rem;
    // background-color: red;
    .component--box.actions {
      padding: 1rem;
      .component--heading2 {
        margin-bottom: 1rem;
      }
      .no-actions {
        padding-top: 2rem;
        padding-bottom: 2rem;
        ${font}
        text-align: center;
        color: ${colours.fore};
        opacity: 0.5;
        // background-color: navy;
      }
    }
    .component--box.add-action {
      margin-top: 1rem;
      padding: 1rem;
      .component--heading2 {
        margin-bottom: 1rem;
      }
    }
  }
  @media screen and (min-width: 960px) {
    section.image-events {
      float: left;
      width: 240px;
      .component--box.events {
        margin-top: 2rem;
      }
    }
    section.actions {
      margin-top: 0;
      margin-left: calc(240px + 2rem);
      .component--box.add-action {
        margin-top: 2rem;
      }
    }
  }
`

class ResourceAtom extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentEvent: 'create',
      actionClassInstance: null,
      actionClassInstanceIsAdding: false
    }
    this.onChooseImage = this.onChooseImage.bind(this)
    this.onChooseEvent = this.onChooseEvent.bind(this)
    this.onChooseAddAction = this.onChooseAddAction.bind(this)
    this.onActionModalGood = this.onActionModalGood.bind(this)
    this.onActionModalBad = this.onActionModalBad.bind(this)
    this.onActionModalUpdateArgument = this.onActionModalUpdateArgument.bind(this)
    this.actOnAction = this.actOnAction.bind(this)
    this.actionClassInstances = Object.keys(classes.actions).map(k => {
      return new classes.actions[k]()
    })
  }

  onUpdate(data) {
    this.props.onUpdate(data)
  }

  onChooseImage(imageId) {
    if (imageId === 'none') {
      imageId = null
    }
    this.onUpdate({
      imageId
    })
  }

  onChooseEvent(currentEvent) {
    this.setState({
      currentEvent
    })
  }

  onChooseAddAction(id) {
    const actionClassInstance = new classes.actions[id]()
    // console.log('[component-resource-Atom] [onChooseAddAction] actionClassInstance', actionClassInstance)
    const argumentsCount = actionClassInstance.defaultRunArguments.size
    actionClassInstance.defaultRunArguments.forEach((v) => {
      actionClassInstance.runArguments.push(v.value)
    })
    if (argumentsCount === 0) {
      return this.setState({
        actionClassInstanceIsAdding: true
      }, () => {
        this.onActionModalGood(actionClassInstance)
      })
    }
    this.setState({
      actionClassInstance,
      actionClassInstanceIsAdding: true
    })
  }

  onActionModalGood(actionClassInstance) {
    const isAdding = this.state.actionClassInstanceIsAdding
    let events = {}
    if (isAdding === true) {
      events = {
        ...this.props.resource.events,
        [this.state.currentEvent]: [
          ...this.props.resource.events[this.state.currentEvent],
          {
            id: actionClassInstance.id,
            runArguments: actionClassInstance.runArguments,
            appliesTo: 'this'
          }
        ]
      }
    } else {
      events = this.props.resource.events
      // events = {
      //   ...this.props.resource.events,
      //   [this.state.currentEvent]: [
      //     ...this.props.resource.events[this.state.currentEvent],
      //     {
      //       id: actionClassInstance.id,
      //       runArguments: actionClassInstance.runArguments,
      //       appliesTo: 'this'
      //     }
      //   ]
      // }
    }
    this.onUpdate({
      events
    })
    this.setState({
      actionClassInstance: null
    })
  }

  onActionModalBad() {
    this.setState({
      actionClassInstance: null
    })
  }

  onActionModalUpdateArgument(index, value) {
    const { actionClassInstance } = this.state
    actionClassInstance.runArguments[index] = value
    this.setState({
      actionClassInstance
    })
  }

  actOnAction(id, action) {
    id = parseInt(id, 10)
    const actions = {
      'edit': () => {
        console.warn('[component-resource-Atom] [actOnAction] id, action', id, action)
        const actualAction = this.props.resource.events[this.state.currentEvent][id]
        const actionClassInstance = new classes.actions[actualAction.id]()
        actionClassInstance.runArguments = actualAction.runArguments
        console.log('[component-resource-Atom] [actOnAction] actionClassInstance', actionClassInstance)
        this.setState({
          actionClassInstance,
          actionClassInstanceIsAdding: false
        })
      },
      'delete': () => {
        this.onUpdate({
          events: {
            ...this.props.resource.events,
            [this.state.currentEvent]: this.props.resource.events[this.state.currentEvent].filter((a, i) => {
              return (i !== id)
            })
          }
        })
      }
    }
    const foundAction = actions[action]
    if (typeof foundAction === 'function') {
      actions[action]()
    }
  }

  render() {
    const imageResources = [
      ...this.props.resources
        .filter(r => r.type === 'image')
        .map(r => {
          return {
            id: r.id,
            name: r.name
          }
        }),
      {
        id: 'none',
        name: '<None>'
      }
    ]

    const imageId = (this.props.resource.imageId === null ? 'none' : this.props.resource.imageId)
    const foundImageResource = this.props.resources.find(r => r.id === this.props.resource.imageId)

    const imageSrc = (foundImageResource !== undefined ?
      foundImageResource.getRemoteUrl()
      :
      null
    )

    // if (this.state.actionClassInstance) {
    //   console.warn('[component-resource-Atom] [render] this.state.actionClassInstance.defaultRunArguments', this.state.actionClassInstance.defaultRunArguments)
    //   console.warn('[component-resource-Atom] [render] this.state.actionClassInstance.defaultRunArguments.keys()', this.state.actionClassInstance.defaultRunArguments.keys())
    // }

    const currentEventName = events.find(e => e.id === this.state.currentEvent).name
    return (
      <StyledResource>
        {this.state.actionClassInstance !== null &&
          <ActionModal actionClassInstance={this.state.actionClassInstance} resources={this.props.resources} onGood={this.onActionModalGood} onBad={this.onActionModalBad} onUpdateArgument={this.onActionModalUpdateArgument} />
        }
        <section className='image-events'>
          <Box className='image'>
            <div className='image-container'>
              <Image src={imageSrc} />
            </div>
            <Dropper options={imageResources} value={imageId} onChoose={this.onChooseImage} />
          </Box>
          <Box className='events'>
            <Heading2>Events</Heading2>
            <List>
              {events.map(e => {
                return <ListItem id={e.id} key={e.id} icon={icons.events[e.icon]} onChoose={this.onChooseEvent} selected={e.id === this.state.currentEvent}>{e.name}</ListItem>
              })}
            </List>
          </Box>
        </section>
        <section className='actions'>
          <Box className='actions'>
            <Heading2>{currentEventName} event actions</Heading2>
            <ActionsList resources={this.props.resources} actions={this.props.resource.events[this.state.currentEvent]} actionClassInstances={this.actionClassInstances} onAction={this.actOnAction} />
          </Box>
          <Box className='add-action'>
            <Heading2>Add an action</Heading2>
            <List>
              {this.actionClassInstances.map(a => {
                return <ListItem id={a.id} key={a.id} actions={['add']} onAction={(id, action) => this.onChooseAddAction(id)} icon={icons.actions[a.id]} onChoose={this.onChooseAddAction}>{a.name}</ListItem>
              })}
            </List>
          </Box>
        </section>
      </StyledResource>
    )
  }
}

ResourceAtom.propTypes = {
  resources: PropTypes.array,
  resource: PropTypes.object.isRequired,
  onUpdate: PropTypes.func
}

ResourceAtom.defaultProps = {
  onUpdate: () => {}
}

export default ResourceAtom