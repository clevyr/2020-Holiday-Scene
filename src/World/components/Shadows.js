import * as THREE from 'https://unpkg.com/three@0.117.0/build/three.module.js';
import { ShadowMaterial } from '../materials/Shadow.js';
import { TransformControls } from 'https://unpkg.com/three@0.117.0/examples/jsm/controls/TransformControls.js';

export class Shadows
{
    constructor(_options)
    {
        // Options
        this.renderer = _options.renderer
        this.camera = _options.camera

        // Set up
        this.alpha = 1
        this.maxDistance = 3
        this.distancePower = 2
        this.zFightingDistance = 0.001
        this.color = 'black'
        this.wireframeVisible = false
        this.items = []

        this.container = new THREE.Object3D()
        this.container.matrixAutoUpdate = false
        this.container.updateMatrix()

        this.setSun()
        this.setMaterials()
        this.setGeometry()
        this.setHelper()

        // Time tick
        this.container.tick = (delta) =>
        {
            for(const _shadow of this.items)
            {
                // Position
                const y = Math.max(_shadow.reference.position.y + _shadow.offsetY, 0)
                const sunOffset = this.sun.vector.clone().multiplyScalar(y)

                _shadow.mesh.position.x = _shadow.reference.position.x + sunOffset.x
                _shadow.mesh.position.z = _shadow.reference.position.z + sunOffset.z

                // Angle
                // Project the rotation as a vector on a plane and extract the angle
                const rotationVector = new THREE.Vector3(1, 0, 0)
                rotationVector.applyQuaternion(_shadow.reference.quaternion)
                // const planeVector = new THREE.Vector3(0, 0, 1)
                // planeVector.normalize()
                const projectedRotationVector = rotationVector.clone().projectOnPlane(new THREE.Vector3(0, 0, 1))

                let orientationAlpha = Math.abs(rotationVector.angleTo(new THREE.Vector3(0, 0, 1)) - Math.PI * 0.5) / (Math.PI * 0.5)
                orientationAlpha /= 0.5
                orientationAlpha -= 1 / 0.5
                orientationAlpha = Math.abs(orientationAlpha)
                orientationAlpha = Math.min(Math.max(orientationAlpha, 0), 1)

                const angle = Math.atan2(projectedRotationVector.y, projectedRotationVector.x)
                _shadow.mesh.rotation.y = angle

                // Alpha
                let alpha = (this.maxDistance - y) / this.maxDistance
                alpha = Math.min(Math.max(alpha, 0), 1)
                alpha = Math.pow(alpha, this.distancePower)

                _shadow.material.uniforms.uAlpha.value = this.alpha * _shadow.alpha * orientationAlpha * alpha
            }
        }
    }

    setSun()
    {
        this.sun = {}
        this.sun.position = new THREE.Vector3( 2,  8, 0)
        this.sun.vector = new THREE.Vector3()
        this.sun.helper = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 1, 0xffffff, 0.1, 0.4)
        this.sun.helper.visible = false
        this.container.add(this.sun.helper)

        this.sun.update = () =>
        {
            this.sun.vector.copy(this.sun.position).multiplyScalar(1 / this.sun.position.y).negate()
            this.sun.helper.position.copy(this.sun.position)

            const direction = this.sun.position.clone().negate().normalize()

            this.sun.helper.setDirection(direction)
            this.sun.helper.setLength(this.sun.helper.position.length())
        }

        this.sun.update()
    }

    setMaterials()
    {
        // Wireframe
        this.materials = {}
        this.materials.wireframe = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })

        // Base
        this.materials.base = new ShadowMaterial()
        this.materials.base.depthWrite = false
        this.materials.base.uniforms.uColor.value = new THREE.Color(this.color)
        this.materials.base.uniforms.uAlpha.value = 0
        this.materials.base.uniforms.uFadeRadius.value = 0.35
    }

    setGeometry()
    {
        this.geometry = new THREE.CircleBufferGeometry(1, 32)
    }

    setHelper()
    {
        if(!this.debug)
        {
            return
        }

        this.helper = {}

        this.helper.active = false

        this.helper.mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(3, 1, 1, 1), new THREE.MeshNormalMaterial())
        this.helper.mesh.position.z = 1.5
        this.helper.mesh.position.y = - 3
        this.helper.mesh.visible = this.helper.active
        this.container.add(this.helper.mesh)

        this.helper.transformControls = new TransformControls(this.camera.instance, this.renderer.domElement)
        this.helper.transformControls.size = 0.5
        this.helper.transformControls.attach(this.helper.mesh)
        this.helper.transformControls.visible = this.helper.active
        this.helper.transformControls.enabled = this.helper.active

        this.helper.shadow = this.add(this.helper.mesh, { sizeX: 6, sizeZ: 2, offsetY: - 0.35, alpha: 0.99 })
        this.helper.shadow.mesh.visible = this.helper.active

        document.addEventListener('keydown', (_event) =>
        {
            if(_event.key === 'r')
            {
                this.helper.transformControls.setMode('rotate')
            }
            else if(_event.key === 'g')
            {
                this.helper.transformControls.setMode('translate')
            }
        })

        this.helper.transformControls.addEventListener('dragging-changed', (_event) =>
        {
            this.camera.orbitControls.enabled = !_event.value
        })

        this.container.add(this.helper.transformControls)
    }

    add(_reference, _options = {})
    {
        const shadow = {}

        // Options
        shadow.offsetY = typeof _options.offsetY === 'undefined' ? 0 : _options.offsetY
        shadow.alpha = typeof _options.alpha === 'undefined' ? 1 : _options.alpha

        // Reference
        shadow.reference = _reference

        // Material
        shadow.material = this.materials.base.clone()

        // Mesh
        shadow.mesh = new THREE.Mesh(this.geometry, this.wireframeVisible ? this.materials.wireframe : shadow.material)
        shadow.mesh.position.y = this.zFightingDistance
        shadow.mesh.scale.set(_options.sizeX, _options.sizeZ, 1)
        shadow.mesh.rotation.set(THREE.MathUtils.degToRad(-90),0,0)

        // Save
        this.container.add(shadow.mesh)
        this.items.push(shadow)

        return shadow
    }
}
