import * as THREE from 'three'

export default function()
{
    const uniforms = {
        tShadow: { value: null },
        uShadowColor: { value: null },
        uAlpha: { value: null }
    }

    const material = new THREE.ShaderMaterial({
        wireframe: false,
        transparent: true,
        uniforms,
        vertexShader: document.getElementById("floorShadow-vertex").textContent,
        fragmentShader: document.getElementById("floorShadow-fragment").textContent
    })

    return material
}
