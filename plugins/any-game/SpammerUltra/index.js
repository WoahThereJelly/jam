const { dispatch } = jam
const Store = require('electron-store');
const store = new Store();

/**
 * Elements
 */
const input = document.getElementById('inputTxt')
const inputType = document.getElementById('inputType')
const inputDelay = document.getElementById('inputDelay')
const inputRepeat = document.getElementById('inputRepeat')
const inputRunType = document.getElementById('inputRunType')
const stopButton = document.getElementById('stopButton')
const runButton = document.getElementById('runButton')
const table = document.getElementById('table')

const tab = ' '.repeat(2)

let runner
let runnerType
let runnerRow

class Spammer {
  constructor () {
    /**
     * Handles input events
     */
    input.onkeydown = e => {
      const keyCode = e.which

      if (keyCode === 9) {
        e.preventDefault()

        const s = input.selectionStart
        input.value = this.value.substring(0, input.selectionStart) + tab + input.value.substring(this.selectionEnd)
        input.selectionEnd = s + tab.length
      }
    }
  }

  /**
   * Sends a packet
   */
  async sendPacket (content, type) {
    if (!content) return

    content = content || input.value

    if (Array.isArray(content)) {
      return dispatch.sendMultipleMessages({
        type,
        messages: content
      })
    }

    if (type === 'aj') dispatch.sendRemoteMessage(content)
    else dispatch.sendConnectionMessage(content)
  }

  /**
   * Adds a click
   */
  addClick () {
    if (!input.value) return

    const type = inputType.value
    const content = input.value
    const delay = inputDelay.value
    const repeat = inputRepeat.value

    const row = table.insertRow()
    const typeCell = row.insertCell(0)
    const contentCell = row.insertCell(1)
    const delayCell = row.insertCell(2)
    const removeCell = row.insertCell(3)
    const repeatCell = row.insertCell(4)

    typeCell.innerText = type
    contentCell.innerText = content
    delayCell.innerText = delay
    removeCell.innerHTML = '<button type="button" class="btn btn-add" onclick="spammer.deleteRow(this)">Remove</button>'
    repeatCell.innerText = repeat
  }

  /**
   * Deletes a row
   */
  deleteRow (btn) {
    const row = btn.parentNode.parentNode
    row.parentNode.removeChild(row)
  }

  /**
   * Sends a click
   */
  sendClick () {
    const content = input.value
    const type = inputType.value

    switch (inputType.value) {
      case 'aj':
      case 'connection': {
        const packets = content.match(/[^\r\n]+/g)

        if (packets.length > 1) this.sendPacket(packets, type)
        else this.sendPacket(content, type)
      }
        break
    }
  }

  /**
   * Run click
   */
  runClick () {
    if (table.rows.length <= 1) {
      this.stopClick()
      return
    }

    stopButton.disabled = false
    runButton.disabled = true
    runnerRow = 1
    runnerType = inputRunType.value

    setTimeout(this.runNext())
  }

  /**
   * Handles run next
   */
  runNext () {
    let row, type, content, delay

    row = table.rows[runnerRow++]

    if (!row) {
      if (runnerType === 'loop') {
        this.runClick()
      } else {
        this.stopClick()
      }
      return
    }

    type = row.cells[0].innerText
    content = row.cells[1].innerText
    delay = parseInt(row.cells[2].innerText)

    switch (type) {
      case 'aj':
      case 'connection':
        this.sendPacket(content, type)
        break
    }

    row.classList.add('row-selected')

    runner = setTimeout(() => {
      row.classList.remove('row-selected')
      this.runNext()
    }, delay * 1000)
  }

  /**
   * Stops click
   */
  stopClick () {
    runButton.disabled = false
    stopButton.disabled = true

    if (runner) clearTimeout(runner)

    for (let i = 1; i < table.rows.length; i++) {
      table.rows[i].classList.remove('rowSelected')
    }
  }
}

const spammer = new Spammer()
