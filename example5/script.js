// Import libraries
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124.0/build/three.module.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/controls/OrbitControls.js'
import { Rhino3dmLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/loaders/3DMLoader.js'

let camera, scene, raycaster, renderer
const mouse = new THREE.Vector2()
window.addEventListener( 'click', onClick, false);

init()
animate()

function init() {

    THREE.Object3D.DefaultUp = new THREE.Vector3( 0, 0, 1 );
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 26, - 40, 5 );

    scene = new THREE.Scene();

    const directionalLight = new THREE.DirectionalLight( 0xffffff );
    directionalLight.position.set( 0, 0, 2 );
    directionalLight.castShadow = true;
    directionalLight.intensity = 2;
    scene.add( directionalLight );

// change according to old docs
    const loader = new Rhino3dmLoader();
    loader.setLibraryPath( 'jsm/libs/rhino3dm/' );

    loader.load( 'models/3dm/Rhino_Logo.3dm', function ( object ) {

        scene.add( object );
        initGUI( object.userData.layers );

    } );

    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( width, height );
    container.appendChild( renderer.domElement );

    controls = new OrbitControls( camera, container );

    window.addEventListener( 'resize', resize, false );

}

function resize() {

    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize( width, height );

}

function animate() {

    controls.update();
    renderer.render( scene, camera );

    requestAnimationFrame( animate );

}

function initGUI( layers ) {

    gui = new GUI( { width: 300 } );
    const layersControl = gui.addFolder( 'layers' );
    layersControl.open();

    for ( let i = 0; i < layers.length; i ++ ) {

        const layer = layers[ i ];
        layersControl.add( layer, 'visible' ).name( layer.name ).onChange( function ( val ) {

            const name = this.object.name;

            scene.traverse( function ( child ) {

                if ( child.userData.hasOwnProperty( 'attributes' ) ) {

                    if ( 'layerIndex' in child.userData.attributes ) {

                        const layerName = layers[ child.userData.attributes.layerIndex ].name;

                        if ( layerName === name ) {

                            child.visible = val;
                            layer.visible = val;

                        }

                    }

                }

            } );

        } );

    }

}

