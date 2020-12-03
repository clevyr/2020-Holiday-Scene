import * as THREE from 'https://unpkg.com/three@0.117.0/build/three.module.js'

export function ShadowMaterial()
{
    const uniforms = {
        uColor: { value: null },
        uAlpha: { value: null },
        uFadeRadius: { value: null }
    }

    const material = new THREE.ShaderMaterial({
        wireframe: false,
        transparent: true,
        uniforms,
        vertexShader: document.getElementById("shadow-vertex").textContent,
        fragmentShader: document.getElementById("shadow-fragment").textContent
    })

    return material
}
