import React from 'react'
import styled from 'styled-components'
import {Link} from 'gatsby'

const StyledFooter = styled.footer`
  padding: 2rem;
  background-color: #ecf0f1;
  div {
    max-width: 1080px;
    margin: 0 auto 0 auto;
  }
  ul {
    padding-left: 0;
    list-style-type: none;
    // background-color: red;
    li {
      padding: 0.25rem;
      // background-color: pink;
      a {
        color: #2e3131;
        text-decoration: none;
      }
    }
    li + li {
      margin-top: 0.5rem;
    }
  }
  ul + ul {
    margin-top: 2rem;
  }
  // @media screen and (min-width: 840px) {
  //   ul {
  //     display: inline-block;
  //     width: 214px;
  //   }
  //   ul + ul {
  //     margin-top: 0;
  //     margin-left: 2rem;
  //   }
  // }
`

const Footer = () => {
  return (
    <StyledFooter>
      <div>
        <ul>
          <li>&copy; <a href='https://euphoricadventur.es'>Euphoric Adventures</a> 2018 &mdash;</li>
          <li><Link to='/credits'>Credits</Link></li>
        </ul>
      </div>
    </StyledFooter>
  )
}

export default Footer
