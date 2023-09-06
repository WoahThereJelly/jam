const Application = require('./application')
const Dispatch = require('./application/dispatch')
const { ipcRenderer } = require('electron')

/**
 * Instantiates the application
 */
const application = new Application()
const dispatch = new Dispatch()


/**
* Console message.
*/
application.consoleMessage({
  message: 'Instantiating please wait.',
  type: 'wait'
})

/**
* Initializes the application.
*/
application.instantiate()
  .then(() => {
    application.consoleMessage({
      message: 'Successfully instantiated.',
      type: 'success'
    })
    
    // Use the dispatch method here after instantiation is completed
    jam.application.dispatch.open("Spammer Ultra")
  })

/**
  * IPC events.
  */
ipcRenderer
  .on('message', (sender, { ...args }) => application.consoleMessage({
    ...args
  }))
  .on('close', () => application.patcher.unpatchApplication())

/**
 * Application events.
 */
application
  .on('ready', () => application.activateAutoComplete())
  .on('refresh:plugins', () => application.refreshAutoComplete())

/**
 * Logger
 */
console.log = message => {
  if (typeof message === 'object') {
    message = JSON.stringify(message)
  }

  application.consoleMessage({
    type: 'logger',
    message: `<highlight>Debugger</highlight>: ${message}`
  })
}

/**
* Application window.
*/
window.jam = {
  application,
  dispatch: application.dispatch,
  settings: application.settings,
  server: application.server
}

// /**
//  * Preparing to open Plugin (FOR TESTING PURPOSES)
//  */
// dispatch.open("Spammer Ultra")