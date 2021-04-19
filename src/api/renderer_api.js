/**
 *
 *    Copyright (c) 2020 Silicon Labs
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

const observable = require('../util/observable.js')
const restApi = require('../../src-shared/rest-api.js')
const storage = require('../util/storage.js')

// This file provide glue logic to enable function calls & HTML attribute data change listener logic
// between front-end containers (jxBrowser, Electron, etc) and the node.js
//
// If a callback applies (e.g. when a function returns a value),
// the javascript code will invoke the Java function name "${id}Callback"
// e.g. for function "open", "openCallback" is invoked.

/**
 * Each declared 'function' entry offers such features:
 * - ability to invoke front-end functions within container via function 'id' with callback.
 * - ability to observe specific HTML target (a DOM Node) for data change.
 *
 * Per entry, 'type' is 'observer', it is dedicated as a data cahgne listener. The
 * e.g. The 'open' function is invoked by the container when opening a new configuration.
 * The front-end is informed and proceed to init UI elements.
 */
function renderer_api_info() {
  return {
    prefix: 'zap',
    description: 'Zap Renderer API',
    functions: [
      {
        id: restApi.rendererApiId.open,
        description: 'Open file...',
      },
      {
        id: restApi.rendererApiId.save,
        description: 'Save file...',
      },
      {
        id: restApi.rendererApiId.reportFiles,
        description: 'Reports files selected by the renderer.',
      },
      {
        id: restApi.rendererApiId.progressStart,
        description: 'Start progress indicator.',
      },
      {
        id: restApi.rendererApiId.progressEnd,
        description: 'End progress indicator.',
      },
      {
        id: restApi.rendererApiId.debugNavBar,
        description: 'Show debug navigation bar...',
      },
      {
        id: restApi.rendererApiId.setTheme,
        description: 'Set theme...',
      },
      {
        id: restApi.rendererApiId.setItem,
        description: 'Set item...',
      },
      {
        id: restApi.rendererApiId.getItem,
        description: 'Get item...',
      },
      {
        id: restApi.rendererApiId.removeItem,
        description: 'Remove item...',
      },
    ],
  }
}

function fnOpen(zapFilePath, studioFilePath) {
  // Make a request for a user with a given ID
  window
    .axios_server_post(`${restApi.ide.open}`, {
      zapFilePath,
      studioFilePath,
    })
    .then((res) => window.location.reload())
    .catch((err) => console.log(err))
}

function fnSave(zap_file) {
  let data = {}
  if (zap_file != null) data.path = zap_file
  window
    .axios_server_post(`${restApi.ide.save}`, data)
    .catch((err) => console.log(err))
}

function renderer_api_execute(id, ...args) {
  let ret = null
  switch (id) {
    case restApi.rendererApiId.open:
      ret = fnOpen.apply(null, args)
      break
    case restApi.rendererApiId.save:
      ret = fnSave.apply(null, args)
      break
    case restApi.rendererApiId.progressStart:
      observable.setObservableAttribute(restApi.progress_attribute, args[0])
      break
    case restApi.rendererApiId.progressEnd:
      observable.setObservableAttribute(restApi.progress_attribute, '')
      break
    case restApi.rendererApiId.reportFiles:
      observable.setObservableAttribute(
        restApi.reported_files,
        JSON.parse(args[0])
      )
      break
    case restApi.rendererApiId.debugNavBar:
      observable.setObservableAttribute(restApi.debugNavBar, args[0])
      break
    case restApi.rendererApiId.setTheme:
      observable.setObservableAttribute(restApi.themeData, args[0])
      break
    case restApi.rendererApiId.setStorageItem:
      storage.setItem(args[0], args[1])
      break
    case restApi.rendererApiId.getStorageItem:
      ret = storage.getItem(args[0])
      break
    case restApi.rendererApiId.removeStorageItem:
      storage.removeItem(args[0])
      break
  }
  return ret
}

function renderer_notify(key, value) {
  console.log(`rendererApiJson:${JSON.stringify({ key: key, value: value })}`)
}

exports.renderer_api_info = renderer_api_info
exports.renderer_api_execute = renderer_api_execute
exports.renderer_notify = renderer_notify
