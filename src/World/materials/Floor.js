import * as THREE from 'https://unpkg.com/three@0.117.0/build/three.module.js'

export default function Floor()
{
    const uniforms = {
        tBackground: { value: null }
    }

    const material = new THREE.ShaderMaterial({
        wireframe: false,
        transparent: false,
        uniforms,
        vertexShader: document.getElementById("floor-vertex").textContent,
        fragmentShader: document.getElementById("floor-fragment").textContent
    })

    return material
}
