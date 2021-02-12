// Import libraries
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124.0/build/three.module.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/controls/OrbitControls.js'
import { Rhino3dmLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/loaders/3DMLoader.js'
import { HDRCubeTextureLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/loaders/HDRCubeTextureLoader.js';

// declare variables to store scene, camera, and renderer
let scene, camera, renderer
const model = 'Rhino_Logo.3dm'

// call functions
init()
animate()

// function to setup the scene, camera, renderer, and load 3d model
function init () {

    // Rhino models are z-up, so set this as the default
    // THREE.Object3D.DefaultUp = new THREE.Vector3( 0, 0, 1 )

    // create a scene and a camera
    scene = new THREE.Scene()
    scene.background = new THREE.Color(1,1,1)
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
    camera.position.z = 30

    // create the renderer and add it to the html
    renderer = new THREE.WebGLRenderer( { antialias: true } )
    renderer.setSize( window.innerWidth, window.innerHeight )
    document.body.appendChild( renderer.domElement )

    // add some controls to orbit the camera
    const controls = new OrbitControls( camera, renderer.domElement )

    // add a directional light
    const directionalLight = new THREE.DirectionalLight( 0xffffff )
    directionalLight.intensity = 2
    scene.add( directionalLight )

    //////////////////////////////////////////////
    // load materials and cube maps

    let material, cubeMap

    // load a pbr material
    const tl = new THREE.TextureLoader()
    tl.setPath('materials/PBR/streaked-metal1/')
    material = new THREE.MeshPhysicalMaterial()
    material.map          = tl.load('streaked-metal1_base.png')
    material.aoMmap       = tl.load('streaked-metal1_ao.png')
    material.normalMap    = tl.load('streaked-metal1_normal.png')
    material.metalnessMap = tl.load('streaked-metal1_metallic.png')
    material.metalness = 0.2
    material.roughness = 0.0

    // or create a material
    // material = new THREE.MeshStandardMaterial( {
    //     color: 0xffffff,
    //     metalness: 0.0,
    //     roughness: 0.0
    // } )

    // load hdr cube map
    // cubeMap = new HDRCubeTextureLoader()
    //     .setPath( './textures/cube/pisaHDR/' )
    //     .setDataType( THREE.UnsignedByteType )
    //     .load( [ 'px.hdr', 'nx.hdr', 'py.hdr', 'ny.hdr', 'pz.hdr', 'nz.hdr' ] )
    
    // or, load cube map
    cubeMap = new THREE.CubeTextureLoader()
        .setPath('textures/cube/Bridge2/')
        .load( [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ] )
    
    scene.background = cubeMap
    material.envMap = scene.background

    //////////////////////////////////////////////

    // load the model
    const loader = new Rhino3dmLoader()
    loader.setLibraryPath( 'https://cdn.jsdelivr.net/npm/rhino3dm@0.13.0/' )

    loader.load( model, function ( object ) {

        //////////////////////////////////////////////
        // apply material to meshes

        object.traverse( function (child) { 
            if (child.isMesh) {
                child.material = material
                // couldn't get cube map to work with DefaultUp so rotate objects instead
                child.rotateX(-0.5 * Math.PI)
            }
        }, false)

        //////////////////////////////////////////////

        scene.add( object )

        // hide spinner when model loads
        // document.getElementById('loader').remove()

    } )

}

// function to continuously render the scene
function animate() {

    requestAnimationFrame( animate )
    renderer.render( scene, camera )

}



