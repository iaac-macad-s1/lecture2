// Import libraries
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124.0/build/three.module.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/controls/OrbitControls.js'
import { Rhino3dmLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/loaders/3DMLoader.js'

const button = document.querySelector('input')
button.addEventListener('click', download)

// ensure the rhino3dm library is loaded
let rhino
rhino3dm().then(async m => {
    console.log( 'Loaded rhino3dm.' )
    rhino = m // global

    // now that the library is loaded, initialize three.js scene, etc and create ojects
    init()
    create()
})

let doc
function create () {

    // create a new Rhino document
    doc = new rhino.File3dm()

    // define a few points
    const ptA = [0, 0, 0]
    const ptB = [10, 10, 10]

    // add a point to the document
    doc.objects().addPoint(ptA)

    // create a line and add it to the document
    const line = new rhino.LineCurve( ptA, ptB )
    doc.objects().add(line, null)

    // create a circle and add it to the document
    const circle = new rhino.Circle( 10 )
    circle.center = ptB
    doc.objects().add(circle.toNurbsCurve(), null)

    // set up Rhino loader 
    const loader = new Rhino3dmLoader()
    loader.setLibraryPath( 'https://cdn.jsdelivr.net/npm/rhino3dm@0.13.0/' )

    // create a copy of the doc.toByteArray data to get an ArrayBuffer
    let arr = new Uint8Array( doc.toByteArray() ).buffer

    loader.parse( arr, function ( object ) {

      // hide spinner
      document.getElementById('loader').remove()
      button.disabled = false
      console.log(object)
      scene.add(object)
  
    } )

}

function download() {

    const buffer = doc.toByteArray()
    const blob = new Blob( [ buffer ], { type: 'application/octect-stream' } )
    const link = document.createElement( 'a' )
    link.href = window.URL.createObjectURL( blob )
    link.download = 'myRhinoFile.3dm'
    link.click()

}

let scene, camera, renderer

function init () {

    // create a scene and a camera
    scene = new THREE.Scene()
    scene.background = new THREE.Color(1,1,1)

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
    camera.position.z = - 30

    // create the renderer and add it to the html
    renderer = new THREE.WebGLRenderer( { antialias: true } )
    renderer.setSize( window.innerWidth, window.innerHeight )
    document.body.appendChild( renderer.domElement )

    const controls = new OrbitControls( camera, renderer.domElement );

    animate()

}

const animate = function () {

    requestAnimationFrame( animate )
    renderer.render( scene, camera )

}



