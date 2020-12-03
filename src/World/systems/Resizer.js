const setSize = (container, camera, renderer, composer) => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    composer.setSize(container.clientWidth, container.clientHeight);
};

class Resizer {
    constructor(container, camera, renderer, composer) {

        setSize(container, camera, renderer, composer);

        window.addEventListener('resize', () => {
            setSize(container, camera, renderer, composer);

            this.onResize();
        });
    }
    onResize() {}
}

export { Resizer };