import { World } from './World/World.js';

async function main() {
  const container = document.querySelector('#scene-container');

  const world = new World(container);

  window.world = world;

  await world.init();

  world.start();
  // world.render();
}

main().catch((err) => {
  console.error(err);
});