import * as config from './config.js'
const {name, version} = config.default

ReactDOM.render(React.createElement(
      'div',
      { className: 'box-shadow rounded-2 border p-6 bg-white' },
      React.createElement(
            'h1',
            null,
            'Welcome to ',
            name,
            ' ',
            React.createElement(
                  'span',
                  { className: 'Label Label--outline v-align-middle ml-2 text-gray-light' },
                  'v',
                  version
            )
      ),
      React.createElement(
            'p',
            null,
            'This bot was built using ',
            React.createElement(
                  'a',
                  { href: 'https://github.com/probot/probot' },
                  'Probot'
            ),
            ', a framework for building GitHub Apps.'
      )
), document.getElementById('probot'));

document.title = `${name} v${version} | built with Probot`
