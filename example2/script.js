// Import libraries
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124.0/build/three.module.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/controls/OrbitControls.js'
import { Rhino3dmLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/loaders/3DMLoader.js'

THREE.Object3D.DefaultUp = new THREE.Vector3( 0, 0, 1 );

// create a scene and a camera
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
camera.position.y = - 30

// create the renderer and add it to the html
const renderer = new THREE.WebGLRenderer( { antialias: true } )
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )

const controls = new OrbitControls( camera, renderer.domElement );

const directionalLight = new THREE.DirectionalLight( 0xffffff );
directionalLight.position.set( 0, 0, 2 );
directionalLight.castShadow = true;
directionalLight.intensity = 2;
scene.add( directionalLight );

const loader = new Rhino3dmLoader()
loader.setLibraryPath( 'https://cdn.jsdelivr.net/npm/rhino3dm@0.13.0/' )

loader.load( 'Rhino_Logo.3dm', function ( object ) {

    scene.add( object )

} )

function animate() {

    requestAnimationFrame( animate )
    renderer.render( scene, camera )

}

animate()

