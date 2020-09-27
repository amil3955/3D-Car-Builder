import React, { useEffect, useReducer, useState } from 'react'
import swal from 'sweetalert'
import './App.css'

import vehicleConfigs from 'vehicleConfigs'
import Header from './Header'
import Editor from './Editor'
import Canvas from './Canvas'

function App({ auth, database }) {
  // Signed in status.
  const [userAuthenticated, setUserAuthenticated] = useState(false)

  // Current vehicle config.
  const [currentVehicle, setVehicle] = useReducer((currentVehicle, newState) => ({ ...currentVehicle, ...newState }))

  // Camera rotation.
  const [cameraAutoRotate, setCameraAutoRotate] = useState(true)

  // Run once.
  useEffect(() => {
    // Get session from url.
    let session = window.location.pathname.replace(/^\/([^/]*).*$/, '$1')
    // Existing session.
    if (session) {
      // Get config from URL.
      database()
        .ref('/configs/' + session)
        .once('value')
        .then(function (data) {
          let value = data.val()
          // If vehicle exists.
          if (value != null) {
            // Overwrite current vehicle from response.
            setVehicle(value)
          } else {
            console.log('No saved vehicle at this URL')
          }
        })
    } else {
      setVehicle(vehicleConfigs.defaults)
    }
  }, [database])

  // Listen for firebase auth state change.
  useEffect(() => {
    let unregisterAuthObserver = auth().onAuthStateChanged((user) => setUserAuthenticated(!!user))
    return () => {
      // Un-register firebase observer on unmount.
      unregisterAuthObserver()
    }
  }, [auth])

  // Save current config.
  const saveVehicle = () => {
    // Set new session.
    let session = randomString(16)
    // Store current config to db.
    database()
      .ref('/configs/' + session)
      .set(currentVehicle)
    // push session string to url.
    window.history.pushState({}, 'Save', '/' + session)
    // Notify user.
    swal('New Vehicle Saved!', 'Please copy or bookmark this page URL.', 'success')
  }

  // Request new part.
  const requestForm = () => {
    // Popup.
    swal({
      title: 'Vehicle Request',
      text: "Would you like your vehicle added or is there an addon we're missing? Let us know!",
      buttons: ['Cancel', 'Submit'],
      content: {
        element: 'input',
        attributes: {
          placeholder: 'Enter vehicle or part name here.',
        },
      },
    }).then((value) => {
      if (value === '') {
        swal('Error', 'You need to write something!', 'error')
        return false
      } else if (value) {
        // Save request.
        database().ref('/requests').push(value)
        // Notify user.
        swal('Awesome!', "Thanks for the suggestion! We'll add it to the list.", 'success')
      }
    })
  }

  // Random string generator.
  function randomString(length) {
    let text = ''
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
  }

  return (
    <div className="App">
      <Header userAuthenticated={userAuthenticated} requestForm={requestForm} />
      <Canvas vehicle={currentVehicle} setVehicle={setVehicle} saveVehicle={saveVehicle} cameraAutoRotate={cameraAutoRotate} />
      <Editor isActive={true} currentVehicle={currentVehicle} setVehicle={setVehicle} cameraAutoRotate={cameraAutoRotate} setCameraAutoRotate={setCameraAutoRotate} />
    </div>
  )
}

export default App
