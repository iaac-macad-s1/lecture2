// Import libraries
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124.0/build/three.module.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/controls/OrbitControls.js'
import { Rhino3dmLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/loaders/3DMLoader.js'

let camera, scene, raycaster, renderer
const mouse = new THREE.Vector2()
window.addEventListener('click', onClick, false);

init()
animate()

function init() {

    THREE.Object3D.DefaultUp = new THREE.Vector3(0, 0, 1)

    // create a scene and a camera
    scene = new THREE.Scene()
    scene.background = new THREE.Color(1, 1, 1)

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 5, 1000)
    camera.position.set(0, 30, 0);

    // create the renderer and add it to the html
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)

    const directionalLight = new THREE.DirectionalLight(0xffffff)
    directionalLight.position.set(20, 50, 22)
    directionalLight.castShadow = true
    directionalLight.intensity = 2
    scene.add(directionalLight)

    const directionalLight2 = new THREE.DirectionalLight(0xffffff)
    directionalLight2.position.set(-20, -50, 22)
    directionalLight2.castShadow = true
    directionalLight2.intensity = 2
    scene.add(directionalLight2)

    raycaster = new THREE.Raycaster()

    const loader = new Rhino3dmLoader()
    loader.setLibraryPath('https://cdn.jsdelivr.net/npm/rhino3dm@0.13.0/')

    loader.load('model.3dm', function(object) {

        document.getElementById('loader').remove()
        scene.add(object)
        console.log(object)



        let container = document.getElementById('container')
        container = document.createElement('div')
        container.id = 'container'
        const table = document.createElement('table')
        container.appendChild(table)
        const row = document.createElement('tr')
        row.innerHTML = `<td>What is in the boxes?</td>`
        table.appendChild(row)
        document.body.appendChild(container)


    })




}



function onClick(event) {

    console.log(`click! (${event.clientX}, ${event.clientY})`)

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    raycaster.setFromCamera(mouse, camera)

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children, true)

    let container = document.getElementById('container')
    if (container) {
        container.remove()
    }

    if (intersects.length > 0) {
        // get closest object
        const object = intersects[0].object

        // create transparency of materials when clicked
        console.log(object) // debug
        object.material.color.set('pink')
            //object.material.opacity = 0.2
            //object.material.transparent = true
        object.rotation.x += 0.02;
        object.rotation.y += 0.02;
        object.rotation.z += 0.1;

        // get user strings
        let data, count
        if (object.userData.attributes !== undefined) {
            data = object.userData.attributes.userStrings
            object.material.color.set('crimson')
        } else {
            // breps store user strings differently...
            data = object.parent.userData.attributes.userStrings
        }

        // do nothing if no user strings
        if (data === undefined)

            return

        console.log(data)

        // create container div with table inside
        container = document.createElement('div')
        container.id = 'container'

        const table = document.createElement('table')
        container.appendChild(table)



        for (let i = 0; i < data.length; i++) {

            const row = document.createElement('tr')
            row.innerHTML = `<td>Remove the box out of the object without making object turning red.</td><td>Try to click only the box.</td>`
                //row.innerHTML = `<td>Inside this box there is ${data[ i ][ 0 ]}</td><td>${data[ i ][ 1 ]}</td>`
            table.appendChild(row)
        }


        document.body.appendChild(container)
    }

}

function animate() {


    requestAnimationFrame(animate)

    renderer.render(scene, camera)


}